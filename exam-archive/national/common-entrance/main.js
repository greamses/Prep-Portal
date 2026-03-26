import setupQuiz from '../question.js'
const quizData = [
{
    question: "Which is the smallest: \\( 0.3 \\), \\( \\frac{1}{4} \\), \\( 26\\% \\), \\( 0.22 \\)?",
    image: null,
    options: [
        "\\( 0.22 \\)",
        "\\( \\frac{1}{4} \\)",
        "\\( 26\\% \\)",
        "\\( 0.3 \\)"
    ],
    correctIndex: 0,
    hint: "Convert them all to decimals or percentages to compare easily.",
    explanation: [
        "\\( 0.3 = 30\\% \\)",
        "\\( \\frac{1}{4} = 25\\% \\)",
        "\\( 26\\% = 26\\% \\)",
        "\\( 0.22 = 22\\% \\)",
        "Smallest is \\( 0.22 \\)."
    ]
},
{
    question: "Express the ratio \\( 1:3 \\) as a percentage of the total for the first part.",
    image: null,
    options: [
        "\\( 33.3\\% \\)",
        "\\( 25\\% \\)",
        "\\( 75\\% \\)",
        "\\( 10\\% \\)"
    ],
    correctIndex: 1,
    hint: "Find the total number of parts first.",
    explanation: [
        "Total parts = \\( 1 + 3 = 4 \\)",
        "First part as fraction = \\( \\frac{1}{4} \\)",
        "\\( \\frac{1}{4} = 25\\% \\)"
    ]
},
{
    question: "Express \\( 20 \\) mins as a percentage of \\( 2 \\) hours.",
    image: null,
    options: [
        "\\( 10\\% \\)",
        "\\( 20\\% \\)",
        "\\( 16.67\\% \\)",
        "\\( 25\\% \\)"
    ],
    correctIndex: 2,
    hint: "Convert hours to minutes first.",
    explanation: [
        "\\( 2 \\text{ hours} = 120 \\text{ mins} \\)",
        "Fraction: \\( \\frac{20}{120} = \\frac{1}{6} \\)",
        "\\( \\frac{1}{6} \\times 100 \\approx 16.67\\% \\)"
    ]
},
{
    question: "Simplify \\( 7x + 3y - 2x + 5y \\).",
    image: null,
    options: [
        "\\( 9x + 8y \\)",
        "\\( 5x - 2y \\)",
        "\\( 13xy \\)",
        "\\( 5x + 8y \\)"
    ],
    correctIndex: 3,
    hint: "Group the like terms together (the \\( x \\)'s and the \\( y \\)'s).",
    explanation: [
        "\\( = (7x - 2x) + (3y + 5y) \\)",
        "\\( = 5x + 8y \\)"
    ]
},
{
    question: "If \\( x = 5 \\) and \\( y = -2 \\), find \\( 4x + 3y \\).",
    image: null,
    options: [
        "\\( 14 \\)",
        "\\( 26 \\)",
        "\\( 6 \\)",
        "\\( -14 \\)"
    ],
    correctIndex: 0,
    hint: "Substitute the numbers into the algebraic expression.",
    explanation: [
        "\\( 4(5) + 3(-2) \\)",
        "\\( = 20 - 6 \\)",
        "\\( = 14 \\)"
    ]
},
{
    question: "Expand and simplify \\( 3(x - 4) + 2(x + 5) \\).",
    image: null,
    options: [
        "\\( 5x - 22 \\)",
        "\\( 5x - 2 \\)",
        "\\( 5x + 2 \\)",
        "\\( x - 2 \\)"
    ],
    correctIndex: 1,
    hint: "Multiply out the brackets first, then collect like terms.",
    explanation: [
        "\\( = 3x - 12 + 2x + 10 \\)",
        "\\( = (3x + 2x) + (-12 + 10) \\)",
        "\\( = 5x - 2 \\)"
    ]
},
{
    question: "A mother is \\( 3 \\) times as old as her daughter. In \\( 10 \\) years’ time, the mother will be \\( 2 \\) times as old as her daughter. How old is the daughter now?",
    image: null,
    options: [
        "\\( 10 \\)",
        "\\( 20 \\)",
        "\\( 5 \\)",
        "\\( 30 \\)"
    ],
    correctIndex: 0,
    hint: "Let daughter's age be \\( x \\) and mother's age be \\( 3x \\). Write an equation for their ages in \\( 10 \\) years.",
    explanation: [
        "Now: Daughter = \\( x \\), Mother = \\( 3x \\)",
        "In \\( 10 \\) years: Daughter = \\( x + 10 \\), Mother = \\( 3x + 10 \\)",
        "Equation: \\( 3x + 10 = 2(x + 10) \\)",
        "\\( 3x + 10 = 2x + 20 \\)",
        "\\( x = 10 \\)"
    ]
},
{
    question: "Solve \\( 5x - 8 = 12 \\).",
    image: null,
    options: [
        "\\( x = 20 \\)",
        "\\( x = 2 \\)",
        "\\( x = 4 \\)",
        "\\( x = 0.8 \\)"
    ],
    correctIndex: 2,
    hint: "Add \\( 8 \\) to both sides, then divide by \\( 5 \\).",
    explanation: [
        "\\( 5x - 8 = 12 \\)",
        "\\( 5x = 12 + 8 \\)",
        "\\( 5x = 20 \\)",
        "\\( x = \\frac{20}{5} = 4 \\)"
    ]
},
{
    question: "Solve \\( 4(2x - 3) = 20 \\).",
    image: null,
    options: [
        "\\( x = 2 \\)",
        "\\( x = 4 \\)",
        "\\( x = 8 \\)",
        "\\( x = 5 \\)"
    ],
    correctIndex: 1,
    hint: "Divide both sides by \\( 4 \\) first, or expand the brackets.",
    explanation: [
        "Divide by \\( 4 \\):",
        "\\( 2x - 3 = 5 \\)",
        "\\( 2x = 5 + 3 \\)",
        "\\( 2x = 8 \\)",
        "\\( x = 4 \\)"
    ]
},
{
    question: "Solve \\( \\frac{x}{3} + 4 = 10 \\).",
    image: null,
    options: [
        "\\( x = 2 \\)",
        "\\( x = 6 \\)",
        "\\( x = 42 \\)",
        "\\( x = 18 \\)"
    ],
    correctIndex: 3,
    hint: "Subtract \\( 4 \\) from both sides, then multiply by \\( 3 \\).",
    explanation: [
        "\\( \\frac{x}{3} = 10 - 4 \\)",
        "\\( \\frac{x}{3} = 6 \\)",
        "\\( x = 6 \\times 3 \\)",
        "\\( x = 18 \\)"
    ]
},
{
    question: "Write \\( 1984 \\) in Roman Numerals.",
    image: null,
    options: [
        "\\( \\text{MCMLXXXIV} \\)",
        "\\( \\text{MDCCCCLXXXIV} \\)",
        "\\( \\text{MMLXXXIV} \\)",
        "\\( \\text{MCMXCIIV} \\)"
    ],
    correctIndex: 0,
    hint: "Break the number down into its place values: \\( 1000 \\), \\( 900 \\), \\( 80 \\), and \\( 4 \\).",
    explanation: [
        "\\( 1000 = \\text{M} \\)",
        "\\( 900 = \\text{CM} \\)",
        "\\( 80 = \\text{LXXX} \\)",
        "\\( 4 = \\text{IV} \\)",
        "Combined: \\( \\text{MCMLXXXIV} \\)"
    ]
},
{
    question: "Convert \\( 1011_2 \\) into denary.",
    image: null,
    options: [
        "\\( 11 \\)",
        "\\( 13 \\)",
        "\\( 9 \\)",
        "\\( 15 \\)"
    ],
    correctIndex: 0,
    hint: "Use powers of \\( 2 \\): \\( 8, 4, 2, 1 \\).",
    explanation: [
        "\\( = 8 + 0 + 2 + 1 \\)",
        "\\( = 11 \\)"
    ]
},
{
    question: "Find the HCF and LCM of \\( 12 \\) and \\( 16 \\).",
    image: null,
    options: [
        "HCF: \\( 3 \\), LCM: \\( 60 \\)",
        "HCF: \\( 8 \\), LCM: \\( 30 \\)",
        "HCF: \\( 4 \\), LCM: \\( 48 \\)",
        "HCF: \\( 3 \\), LCM: \\( 20 \\)"
    ],
    correctIndex: 2,
    hint: "Find the largest number that divides both, and the smallest number they both divide into.",
    explanation: [
        "Factors of \\( 12 \\): \\( 1, 2, 3, 4, 6, 12 \\)",
        "Factors of \\( 16 \\): \\( 1, 2, 4, 8, 16 \\)",
        "Highest Common Factor: \\( 4 \\)",
        "Multiples of \\( 12 \\): \\( 12, 24, 36, 48 \\dots \\)",
        "Multiples of \\( 16 \\): \\( 16, 32, 48 \\dots \\)",
        "Lowest Common Multiple: \\( 48 \\)"
    ]
},
{
    question: "Calculate \\( 10 + 2 \\times (8 - 2^2) \\).",
    image: null,
    options: [
        "\\( 48 \\)",
        "\\( 18 \\)",
        "\\( 24 \\)",
        "\\( 14 \\)"
    ],
    correctIndex: 1,
    hint: "Follow BIDMAS/BODMAS: Indices first, then brackets, then multiplication, then addition.",
    explanation: [
        "\\( = 10 + 2 \\times (8 - 4) \\)",
        "\\( = 10 + 2 \\times 4 \\)",
        "\\( = 10 + 8 \\)",
        "\\( = 18 \\)"
    ]
},
{
    question: "Round \\( 12.345 \\) to \\( 2 \\) decimal places.",
    image: null,
    options: [
        "\\( 12.34 \\)",
        "\\( 12.35 \\)",
        "\\( 12.30 \\)",
        "\\( 12.40 \\)"
    ],
    correctIndex: 1,
    hint: "Look at the third decimal digit. If it is \\( 5 \\) or more, round the second digit up.",
    explanation: [
        "The third decimal digit is \\( 5 \\).",
        "Because \\( 5 \\ge 5 \\), round up the second digit (\\( 4 \\rightarrow 5 \\)).",
        "\\( 12.345 \\rightarrow 12.35 \\)"
    ]
},
{
    question: "Which are the only prime numbers between \\( 20 \\) and \\( 30 \\)?",
    image: null,
    options: [
        "\\( 21, 23, 29 \\)",
        "\\( 23, 27 \\)",
        "\\( 23, 29 \\)",
        "\\( 21, 27, 29 \\)"
    ],
    correctIndex: 2,
    hint: "A prime number has only two factors: \\( 1 \\) and itself.",
    explanation: [
        "\\( 21 = 3 \\times 7 \\) (not prime)",
        "\\( 23 \\) (prime)",
        "\\( 27 = 3 \\times 9 \\) (not prime)",
        "\\( 29 \\) (prime)"
    ]
},
{
    question: "Calculate \\( -10 - (-2) \\times 4 \\).",
    image: null,
    options: [
        "\\( -32 \\)",
        "\\( -2 \\)",
        "\\( -18 \\)",
        "\\( 2 \\)"
    ],
    correctIndex: 1,
    hint: "Multiply first, then handle the subtraction.",
    explanation: [
        "\\( = -10 - (-8) \\)",
        "\\( = -10 + 8 \\)",
        "\\( = -2 \\)"
    ]
},
{
    question: "Calculate \\( \\sqrt{100} + \\sqrt[3]{27} \\).",
    image: null,
    options: [
        "\\( 12 \\)",
        "\\( 14 \\)",
        "\\( 18 \\)",
        "\\( 13 \\)"
    ],
    correctIndex: 3,
    hint: "Find the square root of \\( 100 \\) and the cube root of \\( 27 \\) first.",
    explanation: [
        "\\( \\sqrt{100} = 10 \\)",
        "\\( \\sqrt[3]{27} = 3 \\)",
        "\\( 10 + 3 = 13 \\)"
    ]
},
{
    question: "Calculate \\( \\frac{21.2 \\times 4.9}{0.5} \\).",
    image: null,
    options: [
        "\\( 207.76 \\)",
        "\\( 308.9 \\)",
        "\\( 400.33 \\)",
        "\\( 20.07 \\)"
    ],
    correctIndex: 0,
    hint: "Dividing by \\( 0.5 \\) is the same as multiplying by \\( 2 \\).",
    explanation: [
        "Numerator: \\( 21.2 \\times 4.9 = 103.88 \\)",
        "\\( \\frac{103.88}{0.5} = 103.88 \\times 2 \\)",
        "\\( = 207.76 \\)"
    ]
},
{
    question: "\\( \\frac{4}{7} \\) of a class of \\( 28 \\) students are girls. How many are boys?",
    image: null,
    options: [
        "\\( 7 \\)",
        "\\( 9 \\)",
        "\\( 12 \\)",
        "\\( 10 \\)"
    ],
    correctIndex: 2,
    hint: "Find the fraction of boys first, or find the number of girls and subtract from the total.",
    explanation: [
        "Fraction of boys = \\( 1 - \\frac{4}{7} = \\frac{3}{7} \\)",
        "Number of boys = \\( \\frac{3}{7} \\times 28 \\)",
        "\\( = 3 \\times 4 \\)",
        "\\( = 12 \\)"
    ]
},
{
    question: "Simplify \\( \\frac{24}{36} \\) to its lowest terms.",
    image: null,
    options: [
        "\\( \\frac{12}{18} \\)",
        "\\( \\frac{6}{9} \\)",
        "\\( \\frac{2}{3} \\)",
        "\\( \\frac{3}{4} \\)"
    ],
    correctIndex: 2,
    hint: "Find the highest common factor (HCF) of \\( 24 \\) and \\( 36 \\).",
    explanation: [
        "HCF of \\( 24 \\) and \\( 36 \\) is \\( 12 \\).",
        "Divide top and bottom by \\( 12 \\):",
        "\\( \\frac{24 \\div 12}{36 \\div 12} \\)",
        "\\( = \\frac{2}{3} \\)"
    ]
},
{
    question: "Calculate \\( 1\\frac{1}{2} + 2\\frac{1}{4} \\).",
    image: null,
    options: [
        "\\( 3\\frac{1}{2} \\)",
        "\\( 3\\frac{3}{4} \\)",
        "\\( 4\\frac{1}{4} \\)",
        "\\( 3\\frac{1}{4} \\)"
    ],
    correctIndex: 1,
    hint: "Convert to a common denominator before adding the fractions.",
    explanation: [
        "\\( 1\\frac{1}{2} = 1\\frac{2}{4} \\)",
        "\\( 1\\frac{2}{4} + 2\\frac{1}{4} = 3\\frac{3}{4} \\)"
    ]
},
{
    question: "Find \\( \\frac{1}{3} \\) of \\( \\frac{9}{10} \\).",
    image: null,
    options: [
        "\\( \\frac{3}{10} \\)",
        "\\( \\frac{1}{10} \\)",
        "\\( \\frac{9}{30} \\)",
        "\\( \\frac{10}{27} \\)"
    ],
    correctIndex: 0,
    hint: "“Of” means multiply. Simplify by cross-canceling first.",
    explanation: [
        "\\( \\frac{1}{3} \\times \\frac{9}{10} \\)",
        "Cancel \\( 3 \\) and \\( 9 \\):",
        "\\( = \\frac{1 \\times 3}{1 \\times 10} \\)",
        "\\( = \\frac{3}{10} \\)"
    ]
},
{
    question: "Calculate \\( \\frac{1}{2} \\div \\frac{1}{4} \\).",
    image: null,
    options: [
        "\\( \\frac{1}{8} \\)",
        "\\( 2 \\)",
        "\\( 4 \\)",
        "\\( \\frac{1}{2} \\)"
    ],
    correctIndex: 1,
    hint: "Keep the first fraction, change division to multiplication, and flip the second fraction.",
    explanation: [
        "\\( \\frac{1}{2} \\times \\frac{4}{1} \\)",
        "\\( = \\frac{4}{2} \\)",
        "\\( = 2 \\)"
    ]
},
{
    question: "Write \\( \\frac{1}{8} \\) as a decimal.",
    image: null,
    options: [
        "\\( 0.1 \\)",
        "\\( 0.125 \\)",
        "\\( 0.8 \\)",
        "\\( 0.25 \\)"
    ],
    correctIndex: 1,
    hint: "Divide \\( 1 \\) by \\( 8 \\) using long division.",
    explanation: [
        "\\( 1 \\div 8 = 0.125 \\)"
    ]
},
{
    question: "Calculate \\( 15\\% \\) of \\( \£60 \\).",
    image: null,
    options: [
        "\\( \£6 \\)",
        "\\( \£15 \\)",
        "\\( \£9 \\)",
        "\\( \£12 \\)"
    ],
    correctIndex: 2,
    hint: "Find \\( 10\\% \\) and \\( 5\\% \\) first, then add them together.",
    explanation: [
        "\\( 10\\% \\text{ of } 60 = 6 \\)",
        "\\( 5\\% \\text{ of } 60 = 3 \\)",
        "\\( 15\\% = 6 + 3 \\)",
        "\\( = \£9 \\)"
    ]
},
{
    question: "A shirt costing \\( \£40 \\) is reduced by \\( 25\\% \\). What is the new price?",
    image: null,
    options: [
        "\\( \£30 \\)",
        "\\( \£10 \\)",
        "\\( \£35 \\)",
        "\\( \£25 \\)"
    ],
    correctIndex: 0,
    hint: "\\( 25\\% \\) is the same as \\( \\frac{1}{4} \\). Find \\( \\frac{1}{4} \\) of \\( \£40 \\) and subtract it.",
    explanation: [
        "\\( 25\\% = \\frac{1}{4} \\)",
        "\\( \\frac{1}{4} \\text{ of } 40 = 10 \\)",
        "New price = \\( 40 - 10 \\)",
        "\\( = \£30 \\)"
    ]
},
{
    question: "\\( 15\\% \\) of a number is \\( 12 \\). What is the original number?",
    image: null,
    options: [
        "\\( 60 \\)",
        "\\( 120 \\)",
        "\\( 80 \\)",
        "\\( 100 \\)"
    ],
    correctIndex: 2,
    hint: "Divide \\( 12 \\) by \\( 15 \\) to find \\( 1\\% \\), then multiply by \\( 100 \\).",
    explanation: [
        "\\( 15\\% = 12 \\)",
        "\\( 1\\% = \\frac{12}{15} = 0.8 \\)",
        "\\( 100\\% = 0.8 \\times 100 \\)",
        "\\( = 80 \\)"
    ]
},
{
    question: "Which is the smallest: \\( 0.25 \\), \\( \\frac{1}{5} \\), \\( 22\\% \\), \\( 0.21 \\)?",
    image: null,
    options: [
        "\\( 0.25 \\)",
        "\\( \\frac{1}{5} \\)",
        "\\( 22\\% \\)",
        "\\( 0.21 \\)"
    ],
    correctIndex: 1,
    hint: "Convert them all to decimals or percentages to compare easily.",
    explanation: [
        "\\( 0.25 = 25\\% \\)",
        "\\( \\frac{1}{5} = 20\\% \\)",
        "\\( 22\\% = 22\\% \\)",
        "\\( 0.21 = 21\\% \\)",
        "The smallest is \\( \\frac{1}{5} \\) (\\( 20\\% \\))."
    ]
},
{
    question: "Express the ratio \\( 1:4 \\) as a percentage of the total for the first part.",
    image: null,
    options: [
        "\\( 25\\% \\)",
        "\\( 20\\% \\)",
        "\\( 10\\% \\)",
        "\\( 40\\% \\)"
    ],
    correctIndex: 1,
    hint: "Find the total number of parts first.",
    explanation: [
        "Total parts = \\( 1 + 4 = 5 \\)",
        "First part as fraction = \\( \\frac{1}{5} \\)",
        "\\( \\frac{1}{5} = 20\\% \\)"
    ]
},
{
    question: "Express \\( 45 \\) mins as a percentage of \\( 1 \\) hour \\( 30 \\) mins.",
    image: null,
    options: [
        "\\( 75\\% \\)",
        "\\( 80\\% \\)",
        "\\( 50\\% \\)",
        "\\( 20\\% \\)"
    ],
    correctIndex: 2,
    hint: "Convert hours to minutes first so both units are the same.",
    explanation: [
        "\\( 1 \\text{ hour } 30 \\text{ mins} = 90 \\text{ mins} \\)",
        "Fraction: \\( \\frac{45}{90} \\)",
        "\\( = \\frac{1}{2} = 50\\% \\)"
    ]
},
{
    question: "Simplify \\( 5a + 2b - 3a + 4b \\).",
    image: null,
    options: [
        "\\( 8a + 6b \\)",
        "\\( 2a + 6b \\)",
        "\\( 2a - 2b \\)",
        "\\( 8ab \\)"
    ],
    correctIndex: 1,
    hint: "Group the like terms together (the \\( a \\)'s and the \\( b \\)'s).",
    explanation: [
        "\\( = (5a - 3a) + (2b + 4b) \\)",
        "\\( = 2a + 6b \\)"
    ]
},
{
    question: "If \\( x = 4 \\) and \\( y = -3 \\), find \\( 3x + 2y \\).",
    image: null,
    options: [
        "\\( 18 \\)",
        "\\( 6 \\)",
        "\\( 10 \\)",
        "\\( -6 \\)"
    ],
    correctIndex: 1,
    hint: "Substitute the numbers into the algebraic expression.",
    explanation: [
        "\\( 3(4) + 2(-3) \\)",
        "\\( = 12 - 6 \\)",
        "\\( = 6 \\)"
    ]
},
{
    question: "Expand and simplify \\( 2(x - 3) + 3(x + 2) \\).",
    image: null,
    options: [
        "\\( 5x \\)",
        "\\( 5x - 12 \\)",
        "\\( 5x + 12 \\)",
        "\\( x + 1 \\)"
    ],
    correctIndex: 0,
    hint: "Multiply out the brackets first, then collect like terms.",
    explanation: [
        "\\( = 2x - 6 + 3x + 6 \\)",
        "\\( = (2x + 3x) + (-6 + 6) \\)",
        "\\( = 5x \\)"
    ]
},
{
    question: "A father is \\( 4 \\) times as old as his son. In \\( 6 \\) years’ time, the father will be \\( 3 \\) times as old as his son. How old is the son now?",
    image: null,
    options: [
        "\\( 6 \\text{ years} \\)",
        "\\( 8 \\text{ years} \\)",
        "\\( 10 \\text{ years} \\)",
        "\\( 12 \\text{ years} \\)"
    ],
    correctIndex: 3,
    hint: "Let son's age be \\( x \\) and father's age be \\( 4x \\). Write an equation for their ages in \\( 6 \\) years.",
    explanation: [
        "Now: Son = \\( x \\), Father = \\( 4x \\)",
        "In \\( 6 \\) years: Son = \\( x + 6 \\), Father = \\( 4x + 6 \\)",
        "Equation: \\( 4x + 6 = 3(x + 6) \\)",
        "\\( 4x + 6 = 3x + 18 \\)",
        "\\( x = 12 \\)"
    ]
},
{
    question: "Solve \\( 4x - 5 = 15 \\).",
    image: null,
    options: [
        "\\( x = 2.5 \\)",
        "\\( x = 5 \\)",
        "\\( x = 4 \\)",
        "\\( x = 20 \\)"
    ],
    correctIndex: 1,
    hint: "Add \\( 5 \\) to both sides, then divide by \\( 4 \\).",
    explanation: [
        "\\( 4x = 15 + 5 \\)",
        "\\( 4x = 20 \\)",
        "\\( x = \\frac{20}{4} = 5 \\)"
    ]
},
{
    question: "Solve \\( 3(2x - 2) = 18 \\).",
    image: null,
    options: [
        "\\( x = 3 \\)",
        "\\( x = 4 \\)",
        "\\( x = 5 \\)",
        "\\( x = 2 \\)"
    ],
    correctIndex: 1,
    hint: "Divide both sides by \\( 3 \\) first, or expand the brackets.",
    explanation: [
        "Divide by \\( 3 \\):",
        "\\( 2x - 2 = 6 \\)",
        "\\( 2x = 6 + 2 \\)",
        "\\( 2x = 8 \\)",
        "\\( x = 4 \\)"
    ]
},
{
    question: "Solve \\( \\frac{x}{2} + 5 = 12 \\).",
    image: null,
    options: [
        "\\( x = 14 \\)",
        "\\( x = 3.5 \\)",
        "\\( x = 7 \\)",
        "\\( x = 15 \\)"
    ],
    correctIndex: 0,
    hint: "Subtract \\( 5 \\) from both sides, then multiply by \\( 2 \\).",
    explanation: [
        "\\( \\frac{x}{2} = 12 - 5 \\)",
        "\\( \\frac{x}{2} = 7 \\)",
        "\\( x = 7 \\times 2 \\)",
        "\\( x = 14 \\)"
    ]
},
{
    question: "Find the next term in the sequence: \\( 1, 4, 9, 16, \\dots \\)",
    image: null,
    options: [
        "\\( 20 \\)",
        "\\( 25 \\)",
        "\\( 24 \\)",
        "\\( 30 \\)"
    ],
    correctIndex: 1,
    hint: "Look at the relationship of the numbers to their position (1st, 2nd, 3rd...). These are square numbers.",
    explanation: [
        "\\( 1^2 = 1 \\)",
        "\\( 2^2 = 4 \\)",
        "\\( 3^2 = 9 \\)",
        "\\( 4^2 = 16 \\)",
        "\\( 5^2 = 25 \\)"
    ]
},
{
    question: "What is the pattern for the sequence: \\( 2, 5, 8, 11, \\dots \\)?",
    image: null,
    options: [
        "\\( n + 3 \\)",
        "\\( 3n - 1 \\)",
        "\\( 3n + 2 \\)",
        "\\( 2n + 1 \\)"
    ],
    correctIndex: 1,
    hint: "Find the common difference first (the number multiplying \\( n \\)). Then find the 'zeroth' term.",
    explanation: [
        "Difference is \\( +3 \\), so the rule starts with \\( 3n \\).",
        "For \\( n=1 \\), \\( 3(1) = 3 \\). To get to \\( 2 \\), we subtract \\( 1 \\).",
        "Rule: \\( 3n - 1 \\)"
    ]
},
{
    question: "Express this statement as an algebraic equation: ‘Twice the sum of a number and \\( 7 \\) is \\( 25 \\).’",
    image: null,
    options: [
        "\\( 2(x + 7) = 25 \\)",
        "\\( 2x + 7 = 25 \\)",
        "\\( 2x + 25 = 7 \\)",
        "\\( 25 + 2x < 7 \\)"
    ],
    correctIndex: 0,
    hint: "‘Sum of’ means addition happens before the multiplication, requiring brackets.",
    explanation: [
        "Sum of a number and \\( 7 \\): \\( (x + 7) \\)",
        "Twice the sum: \\( 2(x + 7) \\)",
        "Is \\( 25 \\): \\( 2(x + 7) = 25 \\)"
    ]
},
{
    question: "Solve \\( 3(x - 1) = x + 7 \\).",
    image: null,
    options: [
        "\\( x = 4 \\)",
        "\\( x = 5 \\)",
        "\\( x = 2 \\)",
        "\\( x = 8 \\)"
    ],
    correctIndex: 1,
    hint: "Expand the brackets first, then move all \\( x \\)'s to one side and numbers to the other.",
    explanation: [
        "\\( 3x - 3 = x + 7 \\)",
        "\\( 3x - x = 7 + 3 \\)",
        "\\( 2x = 10 \\)",
        "\\( x = 5 \\)"
    ]
},
{
    question: "Find the missing angle \\( x \\) in a triangle if the other two angles are \\( 54^\\circ \\) and \\( 56^\\circ \\).",
    image: null,
    options: [
        "\\( 70^\\circ \\)",
        "\\( 26^\\circ \\)",
        "\\( 154^\\circ \\)",
        "\\( 38^\\circ \\)"
    ],
    correctIndex: 0,
    hint: "Angles in a triangle add up to \\( 180^\\circ \\).",
    explanation: [
        "Sum of known angles = \\( 54 + 56 = 110^\\circ \\)",
        "Missing angle = \\( 180 - 110 \\)",
        "\\( = 70^\\circ \\)"
    ]
},
{
    question: "Calculate the area of a triangle with base \\( 10 \\text{ cm} \\) and height \\( 6 \\text{ cm} \\).",
    image: null,
    options: [
        "\\( 60 \\text{ cm}^2 \\)",
        "\\( 30 \\text{ cm}^2 \\)",
        "\\( 16 \\text{ cm}^2 \\)",
        "\\( 32 \\text{ cm}^2 \\)"
    ],
    correctIndex: 1,
    hint: "Area of a triangle = \\( \\frac{1}{2} \\times \\text{base} \\times \\text{height} \\).",
    explanation: [
        "\\( \\text{Area} = \\frac{1}{2} \\times 10 \\times 6 \\)",
        "\\( = 5 \\times 6 \\)",
        "\\( = 30 \\text{ cm}^2 \\)"
    ]
},
{
    question: "What is the height of a trapezium with an area of \\( 40 \\text{ cm}^2 \\) and parallel bases of \\( 8 \\text{ cm} \\) and \\( 12 \\text{ cm} \\)?",
    image: null,
    options: [
        "\\( 5 \\text{ cm} \\)",
        "\\( 7 \\text{ cm} \\)",
        "\\( 9 \\text{ cm} \\)",
        "\\( 4 \\text{ cm} \\)"
    ],
    correctIndex: 3,
    hint: "Area of trapezium = \\( \\frac{1}{2} \\times (a + b) \\times h \\). Substitute the known values.",
    explanation: [
        "\\( 40 = \\frac{1}{2} \\times (8 + 12) \\times h \\)",
        "\\( 40 = \\frac{1}{2} \\times (20) \\times h \\)",
        "\\( 40 = 10 \\times h \\)",
        "\\( h = 4 \\text{ cm} \\)"
    ]
},
{
    question: "How many edges does a triangular prism have?",
    image: null,
    options: [
        "\\( 6 \\)",
        "\\( 7 \\)",
        "\\( 8 \\)",
        "\\( 9 \\)"
    ],
    correctIndex: 3,
    hint: "Count the edges of the two triangular bases, plus the rectangular sides connecting them.",
    explanation: [
        "Triangular base 1: \\( 3 \\text{ edges} \\)",
        "Triangular base 2: \\( 3 \\text{ edges} \\)",
        "Connecting sides: \\( 3 \\text{ edges} \\)",
        "Total = \\( 3 + 3 + 3 = 9 \\)"
    ]
},
{
    question: "Calculate the volume of a cuboid \\( 5 \\text{ cm} \\times 2 \\text{ cm} \\times 3 \\text{ cm} \\).",
    image: './cuboid.svg',
    options: [
        "\\( 10 \\text{ cm}^3 \\)",
        "\\( 30 \\text{ cm}^3 \\)",
        "\\( 15 \\text{ cm}^3 \\)",
        "\\( 60 \\text{ cm}^3 \\)"
    ],
    correctIndex: 1,
    hint: "Volume = length \\( \\times \\) width \\( \\times \\) height.",
    explanation: [
        "\\( V = 5 \\times 2 \\times 3 \\)",
        "\\( = 10 \\times 3 \\)",
        "\\( = 30 \\text{ cm}^3 \\)"
    ]
},
{
    question: "Find the surface area of a cube with a side length of \\( 4 \\text{ cm} \\).",
    image: './cube.svg',
    options: [
        "\\( 24 \\text{ cm}^2 \\)",
        "\\( 28 \\text{ cm}^2 \\)",
        "\\( 96 \\text{ cm}^2 \\)",
        "\\( 64 \\text{ cm}^2 \\)"
    ],
    correctIndex: 2,
    hint: "A cube has \\( 6 \\) identical square faces. Find the area of one face and multiply by \\( 6 \\).",
    explanation: [
        "Area of one face = \\( 4 \\times 4 = 16 \\text{ cm}^2 \\)",
        "Total surface area = \\( 6 \\times 16 \\)",
        "\\( = 96 \\text{ cm}^2 \\)"
    ]
},
{
    question: "The hypotenuse of a right-angled triangle with sides \\( 6 \\text{ cm} \\) and \\( 8 \\text{ cm} \\) is:",
    image: './pyt.svg',
    options: [
        "\\( 10 \\text{ cm} \\)",
        "\\( 14 \\text{ cm} \\)",
        "\\( 12 \\text{ cm} \\)",
        "\\( 100 \\text{ cm} \\)"
    ],
    correctIndex: 0,
    hint: "Use Pythagoras' theorem: \\( a^2 + b^2 = c^2 \\).",
    explanation: [
        "\\( 6^2 + 8^2 = c^2 \\)",
        "\\( 36 + 64 = 100 \\)",
        "\\( c = \\sqrt{100} \\)",
        "\\( c = 10 \\text{ cm} \\)"
    ]
},
{
    question: "Calculate the area of a semi-circle with radius \\( 7 \\text{ cm} \\) (use \\( \\pi = \\frac{22}{7} \\)).",
    image: './semi-circle.svg',
    options: [
        "\\( 616 \\text{ cm}^2 \\)",
        "\\( 77 \\text{ cm}^2 \\)",
        "\\( 154 \\text{ cm}^2 \\)",
        "\\( 314 \\text{ cm}^2 \\)"
    ],
    correctIndex: 1,
    hint: "Find the area of a full circle (\\( \\pi r^2 \\)), then divide by \\( 2 \\).",
    explanation: [
        "Full circle area = \\( \\frac{22}{7} \\times 7^2 \\)",
        "\\( = 22 \\times 7 = 154 \\text{ cm}^2 \\)",
        "Semi-circle area = \\( \\frac{154}{2} \\)",
        "\\( = 77 \\text{ cm}^2 \\)"
    ]
},
{
    question: "Share \\( \£60 \\) in the ratio \\( 1:2 \\).",
    image: null,
    options: [
        "\\( \£20, \£40 \\)",
        "\\( \£30, \£30 \\)",
        "\\( \£10, \£50 \\)",
        "\\( \£15, \£45 \\)"
    ],
    correctIndex: 0,
    hint: "Add the ratio parts together to find the total number of parts, then divide \\( \£60 \\) by this total.",
    explanation: [
        "Total parts = \\( 1 + 2 = 3 \\)",
        "Value of \\( 1 \\) part = \\( \\frac{60}{3} = 20 \\)",
        "Person 1: \\( 1 \\times 20 = \£20 \\)",
        "Person 2: \\( 2 \\times 20 = \£40 \\)"
    ]
},
{
    question: "A map scale is \\( 1:10,000 \\). What is the real distance for \\( 5 \\text{ cm} \\) on the map?",
    image: null,
    options: [
        "\\( 500 \\text{ m} \\)",
        "\\( 50 \\text{ m} \\)",
        "\\( 5 \\text{ km} \\)",
        "\\( 50 \\text{ km} \\)"
    ],
    correctIndex: 0,
    hint: "Multiply \\( 5 \\) by \\( 10,000 \\) to get the distance in cm, then convert to meters.",
    explanation: [
        "Real distance = \\( 5 \\times 10,000 = 50,000 \\text{ cm} \\)",
        "Convert cm to m (divide by \\( 100 \\)):",
        "\\( 50,000 \\div 100 = 500 \\text{ m} \\)"
    ]
},
{
    question: "The sum of \\( 3 \\) consecutive numbers is \\( 57 \\). What is the smallest number?",
    image: null,
    options: [
        "\\( 17 \\)",
        "\\( 18 \\)",
        "\\( 19 \\)",
        "\\( 20 \\)"
    ],
    correctIndex: 1,
    hint: "Let the numbers be \\( x \\), \\( x+1 \\), and \\( x+2 \\). Set their sum to \\( 57 \\).",
    explanation: [
        "\\( x + (x + 1) + (x + 2) = 57 \\)",
        "\\( 3x + 3 = 57 \\)",
        "\\( 3x = 54 \\)",
        "\\( x = 18 \\)"
    ]
},
{
    question: "The average of \\( 6 \\) numbers is \\( 12 \\). The average of \\( 5 \\) of these numbers is \\( 11 \\). What is the \\( 6 \\text{th} \\) number?",
    image: null,
    options: [
        "\\( 12 \\)",
        "\\( 15 \\)",
        "\\( 17 \\)",
        "\\( 20 \\)"
    ],
    correctIndex: 2,
    hint: "Find the total sum of the \\( 6 \\) numbers, and the total sum of the \\( 5 \\) numbers.",
    explanation: [
        "Sum of \\( 6 \\) numbers = \\( 6 \\times 12 = 72 \\)",
        "Sum of \\( 5 \\) numbers = \\( 5 \\times 11 = 55 \\)",
        "\\( 6 \\text{th} \\text{ number} = 72 - 55 \\)",
        "\\( = 17 \\)"
    ]
},
{
    question: "What is the sum of the interior angles of a pentagon?",
    image: null,
    options: [
        "\\( 360^\\circ \\)",
        "\\( 180^\\circ \\)",
        "\\( 900^\\circ \\)",
        "\\( 540^\\circ \\)"
    ],
    correctIndex: 3,
    hint: "Use the formula \\( (n - 2) \\times 180 \\), where \\( n \\) is the number of sides.",
    explanation: [
        "A pentagon has \\( n = 5 \\) sides.",
        "\\( (5 - 2) \\times 180 \\)",
        "\\( = 3 \\times 180 \\)",
        "\\( = 540^\\circ \\)"
    ]
},
{
    question: "Find the range of: \\( 3, 8, 2, 5, 10 \\).",
    image: null,
    options: [
        "\\( 2 \\)",
        "\\( 5 \\)",
        "\\( 8 \\)",
        "\\( 6 \\)"
    ],
    correctIndex: 2,
    hint: "Range is the difference between the highest and lowest values.",
    explanation: [
        "Highest value = \\( 10 \\)",
        "Lowest value = \\( 2 \\)",
        "Range = \\( 10 - 2 \\)",
        "\\( = 8 \\)"
    ]
},
{
    question: "In a pie chart, a \\( 60^\\circ \\) sector represents \\( 12 \\) cars. What is the total number of cars?",
    image: null,
    options: [
        "\\( 30 \\)",
        "\\( 90 \\)",
        "\\( 72 \\)",
        "\\( 50 \\)"
    ],
    correctIndex: 2,
    hint: "A full pie chart is \\( 360^\\circ \\). Figure out how many \\( 60^\\circ \\) sectors fit into \\( 360^\\circ \\).",
    explanation: [
        "\\( 360 \\div 60 = 6 \\text{ sectors} \\)",
        "Total cars = \\( 12 \\times 6 \\)",
        "\\( = 72 \\text{ cars} \\)"
    ]
},
{
    question: "What is the probability of rolling an even number on a standard \\( 6 \\)-sided die?",
    image: null,
    options: [
        "\\( \\frac{1}{6} \\)",
        "\\( \\frac{1}{3} \\)",
        "\\( \\frac{1}{2} \\)",
        "\\( \\frac{2}{3} \\)"
    ],
    correctIndex: 2,
    hint: "Count how many even numbers are on a die, and divide by the total number of sides.",
    explanation: [
        "Even outcomes: \\( 2, 4, 6 \\) (\\( 3 \\) outcomes)",
        "Total possible outcomes: \\( 6 \\)",
        "Probability = \\( \\frac{3}{6} \\)",
        "\\( = \\frac{1}{2} \\)"
    ]
},
{
    question: "A sum of \\( \\text{₦}50,000 \\) is invested at a rate of \\( 10\\% \\) per annum for \\( 3 \\) years. What is the simple interest earned?",
    image: null,
    options: [
        "\\( \\text{₦}10,000 \\)",
        "\\( \\text{₦}12,000 \\)",
        "\\( \\text{₦}15,000 \\)",
        "\\( \\text{₦}18,000 \\)"
    ],
    correctIndex: 2,
    hint: "Use the formula \\( I = \\frac{P \\times R \\times T}{100} \\).",
    explanation: [
        "\\( I = \\frac{50,000 \\times 10 \\times 3}{100} \\)",
        "\\( I = 500 \\times 30 \\)",
        "\\( I = \\text{₦}15,000 \\)"
    ]
},
{
    question: "A car travels \\( 210 \\text{ km} \\) in \\( 3 \\text{ hours } 30 \\text{ mins} \\) at a constant speed. What is its speed in \\( \\text{km/h} \\)?",
    image: null,
    options: [
        "\\( 50 \\text{ km/h} \\)",
        "\\( 55 \\text{ km/h} \\)",
        "\\( 60 \\text{ km/h} \\)",
        "\\( 65 \\text{ km/h} \\)"
    ],
    correctIndex: 2,
    hint: "Convert \\( 3 \\text{ hours } 30 \\text{ mins} \\) into a decimal number of hours, then divide distance by time.",
    explanation: [
        "Time = \\( 3.5 \\text{ hours} \\)",
        "Speed = \\( \\frac{\\text{Distance}}{\\text{Time}} \\)",
        "Speed = \\( \\frac{210}{3.5} \\)",
        "\\( = 60 \\text{ km/h} \\)"
    ]
}];

setupQuiz(quizData, 3600)

