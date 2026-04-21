// ai.js — CPU intelligence. Five analysis levels.

import { state } from './state.js';

/**
 * Follows snake/ladder chains from a position (depth-capped to prevent cycles).
 * Returns the final resting square after the move.
 */
export function simulateChain(startPos, delta) {
  const { SNAKES, LADDERS } = state;
  let pos   = Math.min(64, Math.max(1, startPos + delta));
  let depth = 0;
  while ((SNAKES[pos] !== undefined || LADDERS[pos] !== undefined) && depth < 6) {
    pos = SNAKES[pos] ?? LADDERS[pos];
    depth++;
  }
  return pos;
}

/**
 * Returns true if the CPU should USE the card, false to DISCARD.
 *
 * Levels
 * ──────
 * basic       → always use (pure random play)
 * standard    → avoid self moves that land directly on a snake head
 * advanced    → score immediate snake/ladder impact for self + opponent
 * expert      → positional weighting + near-win threat assessment
 * grandmaster → full chain simulation + deep positional scoring
 */
export function evaluateCardTactics(card, pi, level) {
  if (level === 'basic') return true;

  const { SNAKES, LADDERS, players } = state;
  const oppi   = 1 - pi;
  const myPos  = players[pi].pos;
  const oppPos = players[oppi].pos;

  // ── Standard ──────────────────────────────────────────────────────────────
  if (level === 'standard') {
    if (card.type === 'self') {
      const target = Math.min(64, Math.max(1, myPos + card.amount));
      if (SNAKES[target]) return false;
    }
    return true;
  }

  // ── Advanced ──────────────────────────────────────────────────────────────
  if (level === 'advanced') {
    let score = 0;
    if (card.type === 'self') {
      const t = Math.min(64, Math.max(1, myPos + card.amount));
      score += card.amount * 2;
      if (SNAKES[t])  score -= (t - SNAKES[t])  * 2;
      if (LADDERS[t]) score += (LADDERS[t] - t) * 2;
    } else {
      const t = Math.min(64, Math.max(1, oppPos + card.amount));
      score += Math.abs(card.amount) * 2;
      if (LADDERS[t]) score -= (LADDERS[t] - t) * 3; // bad: gifts opp a ladder
      if (SNAKES[t])  score += (t - SNAKES[t])  * 2; // good: opp hits snake
    }
    return score >= 0;
  }

  // ── Expert ────────────────────────────────────────────────────────────────
  if (level === 'expert') {
    let score = 0;
    if (card.type === 'self') {
      const t    = Math.min(64, Math.max(1, myPos + card.amount));
      const final= SNAKES[t] ?? (LADDERS[t] ?? t);
      score += (final - myPos);
      if (final >= 58) score += 12;
      if (final === 64) score += 40;
      if (oppPos >= 58) score -= 6; // less urgent if opp is close to winning anyway
    } else {
      const t    = Math.min(64, Math.max(1, oppPos + card.amount));
      const final= SNAKES[t] ?? (LADDERS[t] ?? t);
      score += (oppPos - final);
      if (oppPos >= 55) score += 14;         // critical blocking situation
      if (LADDERS[t])   score -= (LADDERS[t] - t) * 4; // don't gift a ladder
    }
    return score >= 0;
  }

  // ── Grandmaster ───────────────────────────────────────────────────────────
  if (level === 'grandmaster') {
    let score = 0;
    if (card.type === 'self') {
      const final = simulateChain(myPos, card.amount);
      score += (final - myPos) * 3;
      if (final >= 60) score += 25;
      if (final === 64) score += 80;
      if (oppPos >= 58 && card.amount < 4) score -= 10; // waste if opp about to win
    } else {
      const final = simulateChain(oppPos, card.amount);
      score += (oppPos - final) * 3;
      if (oppPos >= 55) score += 20;         // high-priority block
      if (final >= myPos) score -= 8;        // opp still ahead — low payoff
      if (final === 1)    score += 30;       // sent to start — jackpot
    }
    return score >= 0;
  }

  return true; // unknown level fallback
}
