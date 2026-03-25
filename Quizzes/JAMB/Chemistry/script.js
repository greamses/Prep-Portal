import setupQuiz from '../../../question.js'

const quizData = [
  {
    "question": "The molecule with the highest number of lone pair of electrons is",
    "image": null,
    "options": [
      "H2O",
      "NH3",
      "CH4",
      "CO2"
    ],
    "correctIndex": 3,
    "hint": "Draw Lewis structures for each molecule and count all non-bonding electron pairs across all atoms.",
    "explanation": [
      "In H2O, oxygen has 2 lone pairs.",
      "In NH3, nitrogen has 1 lone pair.",
      "In CH4, carbon has 0 lone pairs.",
      "In CO2 (O=C=O), the carbon atom has 0 lone pairs, but each oxygen atom has 2 lone pairs, totaling 4 lone pairs for the whole molecule."
    ]
  },
  {
    "question": "The composition of petroleum varies because it is a",
    "image": null,
    "options": [
      "hydrocarbon",
      "liquid",
      "mixture",
      "natural resource"
    ],
    "correctIndex": 2,
    "hint": "Consider the fundamental chemical definition of substances that do not have a fixed, constant formula.",
    "explanation": [
      "Petroleum is a complex mixture of many different hydrocarbons and other organic compounds.",
      "Unlike pure compounds, mixtures do not have a fixed chemical composition; their constituents can vary depending on their geological source."
    ]
  },
  {
    "question": "Based on the functional groups (I: ROH, II: RCOR', III: ROR', IV: RCOOH, V: RCOOR'), the two compounds that will combine in the presence of an acid catalyst to produce compound V are",
    "image": null,
    "options": [
      "I and IV",
      "III and IV",
      "I and II",
      "II and III"
    ],
    "correctIndex": 0,
    "hint": "Recall the reaction process known as esterification.",
    "explanation": [
      "Esterification is the reaction between an alkanol (alcohol) and an alkanoic acid (carboxylic acid) in the presence of an acid catalyst to produce an ester (alkanoate) and water.",
      "In the provided list, I is an alkanol (ROH) and IV is an alkanoic acid (RCOOH). Compound V is an ester (RCOOR')."
    ]
  },
  {
    "question": "An example of an alkaline gas is",
    "image": null,
    "options": [
      "HCl",
      "N2",
      "NH3",
      "NO2"
    ],
    "correctIndex": 2,
    "hint": "Think of a common gas that turns moist red litmus paper blue.",
    "explanation": [
      "Ammonia (NH3) is a classic example of a basic or alkaline gas.",
      "When dissolved in water, it forms ammonium hydroxide, which contains hydroxide ions (OH-), giving it its alkaline property."
    ]
  },
  {
    "question": "The dusty and sand particles present in the air is an example of",
    "image": null,
    "options": [
      "a suspension",
      "a dispersion",
      "an emulsion",
      "a saturated solution"
    ],
    "correctIndex": 0,
    "hint": "Consider the type of heterogeneous mixture where solid particles are large enough to eventually settle out.",
    "explanation": [
      "A suspension is a heterogeneous mixture containing large solid particles that will eventually settle out over time.",
      "Dust and sand in the air are solid particles suspended in a gaseous medium, fitting this description."
    ]
  },
  {
    "question": "The property of metal that makes it suitable as a catalyst is",
    "image": null,
    "options": [
      "filled f-orbital",
      "partially filled d-orbitals",
      "partially filled f-orbital",
      "filled d-orbital"
    ],
    "correctIndex": 1,
    "hint": "Think about why transition metals are commonly used in industrial catalytic processes like the Haber process.",
    "explanation": [
      "Many metals, particularly transition metals, are effective catalysts because they have partially filled d-orbitals.",
      "These d-orbitals allow the metal to form temporary, intermediate bonds with reactant molecules, providing an alternative reaction pathway with a lower activation energy."
    ]
  },
  {
    "question": "When ΔH is positive and small, and ΔS is positive and large, the reaction will be",
    "image": null,
    "options": [
      "Non-spontaneous",
      "favour forward reaction only",
      "favour backward reaction only",
      "spontaneous"
    ],
    "correctIndex": 3,
    "hint": "Evaluate the Gibbs free energy equation: ΔG = ΔH - TΔS.",
    "explanation": [
      "Spontaneity is determined by the sign of the Gibbs free energy change (ΔG). A reaction is spontaneous if ΔG is negative.",
      "In the equation ΔG = ΔH - TΔS, if ΔH is a small positive value and ΔS is a large positive value, the term -TΔS will likely outweigh ΔH at most temperatures, resulting in a negative ΔG."
    ]
  },
  {
    "question": "Calculate the pH of 0.001M KOH solution.",
    "image": null,
    "options": [
      "11",
      "14",
      "12",
      "3"
    ],
    "correctIndex": 0,
    "hint": "First calculate the pOH using the concentration of hydroxide ions, then use the relation pH + pOH = 14.",
    "explanation": [
      "KOH is a strong base that dissociates completely: [OH-] = 0.001M = 10^-3 M.",
      "Calculate pOH: pOH = -log[OH-] = -log(10^-3) = 3.",
      "Calculate pH: Since pH + pOH = 14, then pH = 14 - 3 = 11."
    ]
  },
  {
    "question": "The acid used in making baking soda and soft drink is",
    "image": null,
    "options": [
      "tartaric acid",
      "fatty acid",
      "boric acid",
      "citric acid"
    ],
    "correctIndex": 3,
    "hint": "Consider a common organic acid found in citrus fruits used widely in the food industry.",
    "explanation": [
      "Citric acid is a common organic acid used as an acidulant in many soft drinks.",
      "It is also often used in combination with sodium bicarbonate (baking soda) in effervescent products to create carbon dioxide gas bubbles."
    ]
  },
  {
    "question": "For the reaction NH3(g) + HCl(g) → NH4Cl(g), an increase in pressure will",
    "image": null,
    "options": [
      "lower the equilibrium constant",
      "favour the product",
      "favour the reactant",
      "increase the equilibrium constant"
    ],
    "correctIndex": 1,
    "hint": "Apply Le Chatelier's principle regarding total moles of gaseous reactants versus products.",
    "explanation": [
      "According to Le Chatelier's Principle, increasing pressure shifts the equilibrium towards the side with fewer moles of gas.",
      "The reactants consist of 2 moles of gas, while the product is 1 mole of gas. Therefore, an increase in pressure shifts the equilibrium to the right, favoring the product side."
    ]
  },
  {
    "question": "The compound CH3CH(NH2)CH2CH2CH3 is an example of a",
    "image": null,
    "options": [
      "primary amine",
      "tertiary amine",
      "quaternary amine",
      "secondary amine"
    ],
    "correctIndex": 0,
    "hint": "Count how many carbon (alkyl) groups are directly bonded to the nitrogen atom.",
    "explanation": [
      "Amines are classified based on the number of alkyl groups attached to the nitrogen atom.",
      "In this structure, the nitrogen is bonded to one large alkyl group and two hydrogen atoms. This makes it a primary amine."
    ]
  },
  {
    "question": "Nitrogen, a component of air, is primarily used for the industrial",
    "image": null,
    "options": [
      "production of cooling agent",
      "production of margarine",
      "production of HNO3",
      "manufacturing of oil"
    ],
    "correctIndex": 2,
    "hint": "Think about the major industrial chemical pathway starting from atmospheric nitrogen via the Haber process.",
    "explanation": [
      "Nitrogen is used to produce ammonia (NH3) in the Haber process.",
      "Ammonia is then used as the primary starting material in the Ostwald process for manufacturing nitric acid (HNO3), an essential industrial chemical."
    ]
  },
  {
    "question": "In the reaction 2Na + Cl2 → 2NaCl, the species that undergoes reduction is",
    "image": null,
    "options": [
      "Na",
      "NaCl",
      "Cl-",
      "Cl2"
    ],
    "correctIndex": 3,
    "hint": "Reduction involves a gain of electrons, which is reflected as a decrease in oxidation state.",
    "explanation": [
      "The oxidation state of Sodium (Na) changes from 0 to +1 (oxidation).",
      "The oxidation state of Chlorine in Cl2 changes from 0 to -1 in NaCl. This decrease in oxidation state signifies reduction, meaning Cl2 is the species reduced."
    ]
  },
  {
    "question": "The sublimation of a solid to a gas involves",
    "image": null,
    "options": [
      "energy absorption",
      "vapourization",
      "melting",
      "osmotic diffusion"
    ],
    "correctIndex": 0,
    "hint": "Consider whether heat energy must be added to a system for a solid to become a gas.",
    "explanation": [
      "Sublimation is a phase change from solid directly to gas. To overcome the intermolecular forces of the solid phase, the substance must take in heat from its surroundings.",
      "Therefore, sublimation is an endothermic process that involves the absorption of energy."
    ]
  },
  {
    "question": "The products of the thermal decomposition of ammonium trioxonitrate(V) are",
    "image": null,
    "options": [
      "N2O and H2O",
      "NO2 and H2O",
      "N2O and O2",
      "NO3 and H2O"
    ],
    "correctIndex": 0,
    "hint": "Recall the balanced chemical equation for the controlled heating of ammonium nitrate.",
    "explanation": [
      "Ammonium trioxonitrate(V) is the chemical name for ammonium nitrate (NH4NO3).",
      "Upon controlled heating, it decomposes according to the equation: NH4NO3 → N2O + 2H2O, yielding dinitrogen monoxide and water vapor."
    ]
  },
  {
    "question": "In the chemical equation 2X + 2HCl → 2XCl + H2, X is",
    "image": null,
    "options": [
      "K",
      "Mg",
      "Ca",
      "Ba"
    ],
    "correctIndex": 0,
    "hint": "Examine the stoichiometry and the formula of the product chloride to determine the metal's valency.",
    "explanation": [
      "The product XCl indicates that the metal X has a valency of +1.",
      "Potassium (K) is a Group 1 alkali metal with a valency of +1. The other options (Mg, Ca, Ba) are Group 2 alkaline earth metals with a valency of +2, which would form chlorides with the formula XCl2."
    ]
  },
  {
    "question": "Alkanoic acids have higher boiling points than alkanols of similar molecular weight because",
    "image": null,
    "options": [
      "alkanoic acids are more volatile than alkanols",
      "alkanols are more polar than alkanoic acids",
      "alkanoic acids are larger molecules",
      "alkanoic acids form stronger hydrogen bonds"
    ],
    "correctIndex": 3,
    "hint": "Consider the ability of carboxylic acids to form stable dimers through hydrogen bonding.",
    "explanation": [
      "While both have hydroxyl groups for hydrogen bonding, alkanoic acids can form stable dimers where two hydrogen bonds hold a pair of molecules together.",
      "This double hydrogen bonding significantly increases the amount of energy required to boil the substance compared to alkanols."
    ]
  },
  {
    "question": "Water drops are spherical in shape because of",
    "image": null,
    "options": [
      "polarity",
      "viscocity",
      "density",
      "surface tension"
    ],
    "correctIndex": 3,
    "hint": "Recall the physical property that causes a liquid surface to minimize its area.",
    "explanation": [
      "Surface tension is a force that pulls surface molecules toward the interior of a liquid, causing the surface to contract.",
      "This force results in the liquid adopting a shape that minimizes surface area for a given volume, which is a sphere."
    ]
  },
  {
    "question": "In the electrolysis of brine using a neutral electrode, which ion is discharged at the anode?",
    "image": null,
    "options": [
      "2H+",
      "Na+",
      "Cl-",
      "OH-"
    ],
    "correctIndex": 2,
    "hint": "Consider how ion concentration affects the preferential discharge of anions in an electrolytic cell.",
    "explanation": [
      "Brine is a concentrated NaCl solution containing Cl- and OH- anions. At the anode, these ions compete for discharge.",
      "Due to its high concentration in brine, the chloride ion (Cl-) is preferentially discharged over the hydroxide ion (OH-) to form chlorine gas."
    ]
  },
  {
    "question": "Calculate the time required to deposit 4.5g of copper from CuSO4 solution by passing a current of 2.5 Amperes. (Cu = 64g ; 1F = 96500C/mol)",
    "image": null,
    "options": [
      "2714 sec",
      "2527 sec",
      "5428 sec",
      "6785 sec"
    ],
    "correctIndex": 2,
    "hint": "Apply Faraday's first law equation: mass (m) = (Current (I) × Time (t) × Molar Mass (M)) / (Valency (n) × Faraday (F)).",
    "explanation": [
      "Using the formula m = (ItM) / (nF), for Cu2+, n = 2. Rearrange to find time: t = (m × n × F) / (I × M).",
      "Plugging in the values: t = (4.5 × 2 × 96500) / (2.5 × 64) = 868500 / 160 = 5428.125 seconds.",
      "Rounding to the nearest whole number gives 5428 sec."
    ]
  }
]

setupQuiz(quizData, 3600)