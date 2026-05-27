/**
 * models.js - Centralized AI Model Configurations
 *
 * NOTE ON GROQ CORS:
 * Groq's API does not support direct browser requests (CORS).
 * To call these models graciously from the frontend, ensure your fetch
 * logic handles failures by suggesting a proxy or using a server-side
 * middleware to securely append headers.
 */

import { GROQ_MODELS, GEMINI_MODELS_UI } from '../../utils/ai-models.js';

export const SHARED_MODELS = {
  groq: GROQ_MODELS.map(m => ({ ...m, requiresProxy: true })),
  gemini: GEMINI_MODELS_UI,
};

// ─── SUBJECT DATA REGISTRY ──────────────────────────────────
// Maps URL parameters (?s=...) to the physical data.js paths
export const SUBJECT_REGISTRY = {
  plants: "/blogs/science/biology/plants/auto/data.js",
  animals: "/blogs/science/biology/animal/auto/data.js",
  animalfacts: "/blogs/science/biology/animal/auto/data.js",
};

// Alias for backward compatibility if needed in data.js
export const SUBJECT_MODELS = SHARED_MODELS;
