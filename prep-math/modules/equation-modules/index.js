// modules/equation-modules/index.js

import { SingleStepModule } from './SingleStepModule.js';

export const EQUATION_MODULES = [
  SingleStepModule,
];

export function generateFallbackEquation(classId, topic) {
  console.log(`[Fallback] Generating for ${classId} - ${topic}`);
  
  for (const ModuleClass of EQUATION_MODULES) {
    const module = new ModuleClass(classId, topic);
    if (module.canHandle()) {
      const result = module.generate();
      if (result && result.eq) {
        console.log(`[Fallback] Generated: ${result.eq} → ${result.goal}`);
        return result;
      }
    }
  }
  
  // Ultimate fallback
  return {
    type: 'equation',
    eq: "x+2=5",
    goal: "x=3",
    hint: "Subtract 2 from both sides: x = 5 - 2 = 3"
  };
}