export const STANDARD_CARDS = [
    { 
        title: "Lucky Strike", 
        desc: "Move forward 2 spaces.", 
        type: 'self', 
        amount: 2 
    },
    { 
        title: "Minor Boost", 
        desc: "Move forward 3 spaces.", 
        type: 'self', 
        amount: 3 
    },
    { 
        title: "Sabotage", 
        desc: "Opponent moves back 2 spaces.", 
        type: 'opponent', 
        amount: -2 
    },
    { 
        title: "Tripwire", 
        desc: "Opponent moves back 3 spaces.", 
        type: 'opponent', 
        amount: -3 
    }
];

export const BONUS_HUGE_WINS = [
    { title: "MEGA BOOST!", desc: "Move forward 8 spaces.", type: 'self', amount: 8 },
    { title: "SUPER LEAP!", desc: "Move forward 6 spaces.", type: 'self', amount: 6 }
];

export const BONUS_SMALL_WINS = [
    { title: "Tiny Step", desc: "Move forward 1 space.", type: 'self', amount: 1 },
    { title: "Small Jump", desc: "Move forward 2 spaces.", type: 'self', amount: 2 },
    { title: "Minor Snag", desc: "Opponent moves back 1.", type: 'opponent', amount: -1 }
];

export class CardManager {
    constructor(gameState, onCardApplied) {
        this.gameState = gameState;
        this.onCardApplied = onCardApplied;
    }
    
    getRandomStandardCard() {
        return STANDARD_CARDS[Math.floor(Math.random() * STANDARD_CARDS.length)];
    }
    
    getBonusCardPool() {
        const huge = BONUS_HUGE_WINS[Math.floor(Math.random() * BONUS_HUGE_WINS.length)];
        const small1 = BONUS_SMALL_WINS[Math.floor(Math.random() * BONUS_SMALL_WINS.length)];
        const small2 = BONUS_SMALL_WINS[Math.floor(Math.random() * BONUS_SMALL_WINS.length)];
        
        let pool = [huge, small1, small2];
        // Shuffle
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        
        return pool;
    }
    
    evaluateCardTactics(card, pi, level) {
        if (level === 'basic') return true;
        
        let score = 0;
        const targetPi = card.type === 'self' ? pi : 1 - pi;
        let target = this.gameState.players[targetPi].pos + card.amount;
        
        if (target > 64) target = 64;
        if (target < 1) target = 1;
        
        if (card.type === 'self') {
            score += card.amount * 2;
            
            if (this.gameState.snakes[target]) {
                let tail = this.gameState.snakes[target];
                score -= (target - tail) * 2;
            }
            if (this.gameState.ladders[target]) {
                let top = this.gameState.ladders[target];
                score += (top - target) * 2;
            }
        } else {
            score += Math.abs(card.amount) * 2;
            
            if (this.gameState.ladders[target]) {
                let top = this.gameState.ladders[target];
                score -= (top - target) * 3;
            }
            if (this.gameState.snakes[target]) {
                let tail = this.gameState.snakes[target];
                score += (target - tail) * 2;
            }
        }
        
        return score >= 0;
    }
    
    applyCard(targetPi, amount) {
        let newPos = this.gameState.players[targetPi].pos + amount;
        if (newPos > 64) newPos = 64;
        if (newPos < 1) newPos = 1;
        
        return { targetPi, newPos };
    }
}