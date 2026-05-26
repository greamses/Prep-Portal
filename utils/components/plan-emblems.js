/**
 * FREE TIER - "The Rose"
 * Upgraded to a 24x24 geometric mandala/rosette.
 * Features 8 outer shadow petals, 8 inner detailed petals, and a solid pistil core.
 * Uses overlapping opacities to create a beautiful, rich depth.
 */
export const SVG_ROSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-label="Free">
  <g fill="currentColor">
    <!-- Outer shadow petals -->
    <g opacity="0.25">
      <path d="M12 1C18 1 19 10 12 12C5 10 6 1 12 1Z"/>
      <path d="M12 1C18 1 19 10 12 12C5 10 6 1 12 1Z" transform="rotate(45 12 12)"/>
      <path d="M12 1C18 1 19 10 12 12C5 10 6 1 12 1Z" transform="rotate(90 12 12)"/>
      <path d="M12 1C18 1 19 10 12 12C5 10 6 1 12 1Z" transform="rotate(135 12 12)"/>
      <path d="M12 1C18 1 19 10 12 12C5 10 6 1 12 1Z" transform="rotate(180 12 12)"/>
      <path d="M12 1C18 1 19 10 12 12C5 10 6 1 12 1Z" transform="rotate(225 12 12)"/>
      <path d="M12 1C18 1 19 10 12 12C5 10 6 1 12 1Z" transform="rotate(270 12 12)"/>
      <path d="M12 1C18 1 19 10 12 12C5 10 6 1 12 1Z" transform="rotate(315 12 12)"/>
    </g>
    <!-- Inner detailed petals -->
    <g opacity="0.8">
      <path d="M12 3.5C15 3.5 15.5 10 12 12C8.5 10 9 3.5 12 3.5Z"/>
      <path d="M12 3.5C15 3.5 15.5 10 12 12C8.5 10 9 3.5 12 3.5Z" transform="rotate(45 12 12)"/>
      <path d="M12 3.5C15 3.5 15.5 10 12 12C8.5 10 9 3.5 12 3.5Z" transform="rotate(90 12 12)"/>
      <path d="M12 3.5C15 3.5 15.5 10 12 12C8.5 10 9 3.5 12 3.5Z" transform="rotate(135 12 12)"/>
      <path d="M12 3.5C15 3.5 15.5 10 12 12C8.5 10 9 3.5 12 3.5Z" transform="rotate(180 12 12)"/>
      <path d="M12 3.5C15 3.5 15.5 10 12 12C8.5 10 9 3.5 12 3.5Z" transform="rotate(225 12 12)"/>
      <path d="M12 3.5C15 3.5 15.5 10 12 12C8.5 10 9 3.5 12 3.5Z" transform="rotate(270 12 12)"/>
      <path d="M12 3.5C15 3.5 15.5 10 12 12C8.5 10 9 3.5 12 3.5Z" transform="rotate(315 12 12)"/>
    </g>
    <!-- Center pistil -->
    <circle cx="12" cy="12" r="2.5" opacity="0.95"/>
  </g>
</svg>`;

/**
 * PRO TIER - "The Crown"
 * Upgraded to a 24x24 dimensional royal crown.
 * Features a semi-transparent background dome (velvet), a thick jeweled base
 * using negative space cutouts, and 3 distinctly jeweled peaks.
 */
export const SVG_CROWN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-label="Pro">
  <g fill="currentColor">
    <!-- Back dome (velvet inset) -->
    <path d="M4 17 C 4 8, 20 8, 20 17 Z" opacity="0.25"/>
    
    <!-- Front Crown peaks -->
    <path d="M2.5 17 L 4.5 7.5 L 8.5 11.5 L 12 3.5 L 15.5 11.5 L 19.5 7.5 L 21.5 17 Z" opacity="0.95"/>
    
    <!-- Peak Jewels -->
    <circle cx="4.5" cy="5.5" r="1.5"/>
    <circle cx="12" cy="1.5" r="2"/>
    <circle cx="19.5" cy="5.5" r="1.5"/>
    
    <!-- Ornate Base with Jewel Cutouts -->
    <path d="M2.5 18 C 2.5 17 3.5 16.5 4.5 16.5 H 19.5 C 20.5 16.5 21.5 17 21.5 18 V 20.5 C 21.5 21.5 20.5 22.5 19.5 22.5 H 4.5 C 3.5 22.5 2.5 21.5 2.5 20.5 V 18 Z M 7.5 18 A 1.5 1.5 0 1 0 7.5 21 A 1.5 1.5 0 1 0 7.5 18 Z M 12 17.5 A 2 2 0 1 0 12 21.5 A 2 2 0 1 0 12 17.5 Z M 16.5 18 A 1.5 1.5 0 1 0 16.5 21 A 1.5 1.5 0 1 0 16.5 18 Z" fill-rule="evenodd"/>
  </g>
</svg>`;

/**
 * PREMIUM TIER - "The Shield"
 * Upgraded to a 24x24 multi-layered paladin shield.
 * Features a thick outer rim, a floating inner core shield (creating a visual gap),
 * and a perfect 4-point diamond star cut directly out of the center core.
 */
export const SVG_SHIELD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-label="Premium">
  <g fill="currentColor">
    <!-- Outer Frame/Rim -->
    <path d="M12 1.5 C 12 1.5, 2.5 4.5, 2.5 9.5 C 2.5 15.5, 8 20.5, 12 23 C 16 20.5, 21.5 15.5, 21.5 9.5 C 21.5 4.5, 12 1.5, 12 1.5 Z M 12 4 C 19 6.5, 19 10, 19 10 C 19 14.5, 15 18.5, 12 20.5 C 9 18.5, 5 14.5, 5 10 C 5 6.5, 12 4, 12 4 Z" fill-rule="evenodd" opacity="0.35"/>
    
    <!-- Inner Shield with 4-Point Star Cutout -->
    <path d="M12 5.5 C 12 5.5, 6.5 7.5, 6.5 10.5 C 6.5 14, 9.5 17.5, 12 19 C 14.5 17.5, 17.5 14, 17.5 10.5 C 17.5 7.5, 12 5.5, 12 5.5 Z M 12 7 L 13.2 10.2 L 16.5 11 L 13.2 11.8 L 12 15 L 10.8 11.8 L 7.5 11 L 10.8 10.2 Z" fill-rule="evenodd" opacity="0.95"/>
  </g>
</svg>`;

export function planEmblem(isPremium, planName = "") {
  if (!isPremium) return SVG_ROSE;
  const n = (planName || "").toLowerCase();
  if (n.includes("monthly") || n.includes("premium")) return SVG_SHIELD;
  return SVG_CROWN;
}

export function planTier(isPremium, planName = "") {
  if (!isPremium) return "free";
  const n = (planName || "").toLowerCase();
  return n.includes("monthly") || n.includes("premium") ? "premium" : "pro";
}
