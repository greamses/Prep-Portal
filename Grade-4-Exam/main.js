const quizData = [
  // ==========================================
  // OBJECTIVE QUESTIONS (1 - 30)
  // ==========================================
  {
    question: "A baker uses 75% of a bag of flour. Which fraction represents this in simplest form?",
    image: null,
    options: ["\\( \\frac{1}{2} \\)", "\\( \\frac{3}{4} \\)", "\\( \\frac{7}{5} \\)", "\\( \\frac{3}{5} \\)"],
    correctIndex: 1,
    hint: "Percent means out of 100. Write 75% as a fraction and simplify.",
    explanation: [
      "75% can be written as \\( \\frac{75}{100} \\).",
      "Divide the numerator and denominator by 25: \\( 75 \\div 25 = 3 \\) and \\( 100 \\div 25 = 4 \\).",
      "The simplified fraction is \\( \\frac{3}{4} \\)."
    ]
  },
  {
    question: "An athlete completed \\( \\frac{2}{5} \\) of a marathon. What percentage have they finished?",
    image: null,
    options: ["20%", "25%", "40%", "50%"],
    correctIndex: 2,
    hint: "Multiply the fraction by 100% to convert it to a percentage.",
    explanation: [
      "To convert a fraction to a percentage, multiply by 100.",
      "\\( \\frac{2}{5} \\times 100\\% = \\frac{200}{5}\\% \\).",
      "\\( 200 \\div 5 = 40\\% \\)."
    ]
  },
  {
    question: "A storage drive is 12.5% full. Express this as a fraction in simplest form.",
    image: null,
    options: ["\\( \\frac{1}{8} \\)", "\\( \\frac{1}{4} \\)", "\\( \\frac{1}{10} \\)", "\\( \\frac{1}{5} \\)"],
    correctIndex: 0,
    hint: "12.5% is \\( \\frac{12.5}{100} \\). Multiply top and bottom by 10 to remove the decimal.",
    explanation: [
      "\\( 12.5\\% = \\frac{12.5}{100} \\).",
      "Multiply by 10 to remove the decimal: \\( \\frac{125}{1000} \\).",
      "Divide top and bottom by 125: \\( 125 \\div 125 = 1 \\) and \\( 1000 \\div 125 = 8 \\).",
      "The fraction is \\( \\frac{1}{8} \\)."
    ]
  },
  {
    question: "A student spends \\( \\frac{1}{20} \\) of their day exercising. What percentage is this?",
    image: null,
    options: ["1%", "5%", "10%", "20%"],
    correctIndex: 1,
    hint: "Multiply the fraction by 100%.",
    explanation: [
      "\\( \\frac{1}{20} \\times 100\\% = \\frac{100}{20}\\% \\).",
      "\\( 100 \\div 20 = 5\\% \\)."
    ]
  },
  {
    question: "The fraction of seats filled in a theater is \\( \\frac{13}{20} \\). What percentage is filled?",
    image: null,
    options: ["13%", "52%", "65%", "75%"],
    correctIndex: 2,
    hint: "Multiply the fraction by 100%.",
    explanation: [
      "\\( \\frac{13}{20} \\times 100\\% = 13 \\times 5\\% \\).",
      "\\( 13 \\times 5 = 65\\% \\)."
    ]
  },
  {
    question: "A charity received \\( 33\\frac{1}{3}\\% \\) of its goal. What is this as a simplified fraction?",
    image: null,
    options: ["\\( \\frac{1}{3} \\)", "\\( \\frac{1}{4} \\)", "\\( \\frac{3}{10} \\)", "\\( \\frac{1}{30} \\)"],
    correctIndex: 0,
    hint: "Convert the mixed number to an improper fraction, then divide by 100.",
    explanation: [
      "\\( 33\\frac{1}{3} = \\frac{100}{3} \\).",
      "As a percentage: \\( \\frac{100}{3} \\div 100 = \\frac{100}{3} \\times \\frac{1}{100} \\).",
      "The 100s cancel out, leaving \\( \\frac{1}{3} \\)."
    ]
  },
  {
    question: "A chef has \\( \\frac{17}{3} \\) cups of milk. How is this written as a mixed fraction?",
    image: null,
    options: ["\\( 5\\frac{1}{3} \\)", "\\( 5\\frac{2}{3} \\)", "\\( 6\\frac{1}{3} \\)", "\\( 4\\frac{5}{3} \\)"],
    correctIndex: 1,
    hint: "Divide the numerator by the denominator. The remainder becomes the new numerator.",
    explanation: [
      "Divide 17 by 3: \\( 17 \\div 3 = 5 \\) with a remainder of 2.",
      "The whole number is 5, and the remainder 2 stays over the denominator 3.",
      "The mixed fraction is \\( 5\\frac{2}{3} \\)."
    ]
  },
  {
    question: "A recipe uses \\( 3\\frac{4}{5} \\) pounds of flour. Convert this to an improper fraction.",
    image: null,
    options: ["\\( \\frac{12}{5} \\)", "\\( \\frac{15}{5} \\)", "\\( \\frac{7}{5} \\)", "\\( \\frac{19}{5} \\)"],
    correctIndex: 3,
    hint: "Multiply the whole number by the denominator and add the numerator.",
    explanation: [
      "Multiply the whole number (3) by the denominator (5): \\( 3 \\times 5 = 15 \\).",
      "Add the numerator (4): \\( 15 + 4 = 19 \\).",
      "Place 19 over the original denominator: \\( \\frac{19}{5} \\)."
    ]
  },
  {
    question: "A construction site uses \\( \\frac{41}{8} \\) tons of gravel. Convert to a mixed number.",
    image: null,
    options: ["\\( 5\\frac{1}{8} \\)", "\\( 4\\frac{9}{8} \\)", "\\( 5\\frac{3}{8} \\)", "\\( 6\\frac{1}{8} \\)"],
    correctIndex: 0,
    hint: "Divide 41 by 8 to find the whole number and the remainder.",
    explanation: [
      "Divide 41 by 8: \\( 41 \\div 8 = 5 \\) with a remainder of 1.",
      "The mixed number is \\( 5\\frac{1}{8} \\)."
    ]
  },
  {
    question: "In binary, a setting is represented by \\( 1011_2 \\). What is its decimal value?",
    image: null,
    options: ["\\( 9 \\)", "\\( 11 \\)", "\\( 13 \\)", "\\( 10 \\)"],
    correctIndex: 1,
    hint: "Multiply each digit by powers of 2, starting from \\( 2^0 \\) on the right.",
    explanation: [
      "\\( 1011_2 = (1 \\times 2^3) + (0 \\times 2^2) + (1 \\times 2^1) + (1 \\times 2^0) \\).",
      "\\( = 8 + 0 + 2 + 1 \\).",
      "\\( = 11 \\)."
    ]
  },
  {
    question: "An IP address segment has the decimal value 25. What is this in binary?",
    image: null,
    options: ["\\( 11001_2 \\)", "\\( 10101_2 \\)", "\\( 11111_2 \\)", "\\( 11011_2 \\)"],
    correctIndex: 0,
    hint: "Repeatedly divide by 2 and write down the remainders.",
    explanation: [
      "\\( 25 \\div 2 = 12 \\) R 1",
      "\\( 12 \\div 2 = 6 \\) R 0",
      "\\( 6 \\div 2 = 3 \\) R 0",
      "\\( 3 \\div 2 = 1 \\) R 1",
      "\\( 1 \\div 2 = 0 \\) R 1",
      "Reading remainders from bottom to top: \\( 11001_2 \\)."
    ]
  },
  {
    question: "Convert \\( 11100_2 \\) to decimal.",
    image: null,
    options: ["\\( 14 \\)", "\\( 24 \\)", "\\( 28 \\)", "\\( 30 \\)"],
    correctIndex: 2,
    hint: "Use place values of 16, 8, 4, 2, and 1.",
    explanation: [
      "\\( 11100_2 = (1 \\times 16) + (1 \\times 8) + (1 \\times 4) + (0 \\times 2) + (0 \\times 1) \\).",
      "\\( 16 + 8 + 4 = 28 \\)."
    ]
  },
  {
    question: "One light blinks every 12 seconds, another every 18 seconds. In how many seconds will they blink together again?",
    image: null,
    options: ["\\( 6 \\)", "\\( 36 \\)", "\\( 48 \\)", "\\( 216 \\)"],
    correctIndex: 1,
    hint: "Find the Least Common Multiple (LCM) of 12 and 18.",
    explanation: [
      "Multiples of 12: 12, 24, 36, 48...",
      "Multiples of 18: 18, 36, 54...",
      "The lowest common multiple they share is 36."
    ]
  },
  {
    question: "A florist has 24 roses and 36 lilies. What is the maximum number of identical bouquets she can make using all flowers?",
    image: null,
    options: ["\\( 6 \\)", "\\( 12 \\)", "\\( 24 \\)", "\\( 72 \\)"],
    correctIndex: 1,
    hint: "Find the Highest Common Factor (HCF) of 24 and 36.",
    explanation: [
      "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24.",
      "Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36.",
      "The highest common factor is 12."
    ]
  },
  {
    question: "Three alarms ring every 4, 6, and 10 minutes. If they all ring at 8:00 AM, when is the next time they ring together?",
    image: null,
    options: ["8:12 AM", "8:30 AM", "9:00 AM", "8:20 AM"],
    correctIndex: 2,
    hint: "Find the LCM of 4, 6, and 10.",
    explanation: [
      "LCM of 4, 6, and 10.",
      "Multiples of 10: 10, 20, 30, 40, 50, 60.",
      "60 is divisible by both 4 and 6. Therefore, LCM = 60 minutes.",
      "60 minutes = 1 hour. 8:00 AM + 1 hour = 9:00 AM."
    ]
  },
  {
    question: "What is the Highest Common Factor (HCF) of 56 and 84?",
    image: null,
    options: ["\\( 7 \\)", "\\( 14 \\)", "\\( 28 \\)", "\\( 168 \\)"],
    correctIndex: 2,
    hint: "Find the prime factors and multiply the lowest powers of common primes.",
    explanation: [
      "Prime factors of 56 = \\( 2^3 \\times 7 \\)",
      "Prime factors of 84 = \\( 2^2 \\times 3 \\times 7 \\)",
      "Common factors are 2 and 7.",
      "HCF = \\( 2^2 \\times 7 = 4 \\times 7 = 28 \\)."
    ]
  },
  {
    question: "What is the Least Common Multiple (LCM) of 15 and 20?",
    image: null,
    options: ["\\( 5 \\)", "\\( 60 \\)", "\\( 100 \\)", "\\( 300 \\)"],
    correctIndex: 1,
    hint: "Find the smallest number that both 15 and 20 divide evenly into.",
    explanation: [
      "Multiples of 20: 20, 40, 60, 80...",
      "Check divisibility by 15: 60 \\(\\div\\) 15 = 4.",
      "The LCM is 60."
    ]
  },
  {
    question: "A gardener has 45 tomato and 75 pepper plants. What is the maximum number of plants per row if each row must be identical?",
    image: null,
    options: ["\\( 5 \\)", "\\( 15 \\)", "\\( 25 \\)", "\\( 3 \\)"],
    correctIndex: 1,
    hint: "Find the Highest Common Factor (HCF) of 45 and 75.",
    explanation: [
      "Factors of 45: 1, 3, 5, 9, 15, 45.",
      "Factors of 75: 1, 3, 5, 15, 25, 75.",
      "The highest common factor is 15."
    ]
  },
  {
    question: "Which of the following is a prime number?",
    image: null,
    options: ["\\( 1 \\)", "\\( 9 \\)", "\\( 15 \\)", "\\( 17 \\)"],
    correctIndex: 3,
    hint: "A prime number is only divisible by 1 and itself.",
    explanation: [
      "1 is not considered prime.",
      "9 is divisible by 3.",
      "15 is divisible by 3 and 5.",
      "17 has no other divisors except 1 and 17, so it is a prime number."
    ]
  },
  {
    question: "How many prime numbers are there between 20 and 30?",
    image: null,
    options: ["\\( 1 \\)", "\\( 2 \\)", "\\( 3 \\)", "\\( 4 \\)"],
    correctIndex: 1,
    hint: "List the numbers from 21 to 29 and check which ones cannot be divided by anything other than 1 and themselves.",
    explanation: [
      "Numbers between 20 and 30: 21, 22, 23, 24, 25, 26, 27, 28, 29.",
      "The only numbers that are prime are 23 and 29.",
      "There are 2 prime numbers."
    ]
  },
  {
    question: "Which of these numbers is NOT a prime number?",
    image: null,
    options: ["\\( 2 \\)", "\\( 37 \\)", "\\( 51 \\)", "\\( 19 \\)"],
    correctIndex: 2,
    hint: "Check divisibility rules. If the sum of the digits is divisible by 3, the number is divisible by 3.",
    explanation: [
      "2 is a prime number (the only even prime).",
      "37 and 19 are prime numbers.",
      "For 51, the sum of its digits is \\( 5 + 1 = 6 \\), which is divisible by 3. \\( 51 \\div 3 = 17 \\). Therefore, 51 is not prime."
    ]
  },
  {
    question: "A bus travels 912 miles over 12 days. How many miles does it cover per day?",
    image: null,
    options: ["\\( 72 \\)", "\\( 76 \\)", "\\( 84 \\)", "\\( 86 \\)"],
    correctIndex: 1,
    hint: "Divide the total miles by the number of days.",
    explanation: [
      "\\( 912 \\div 12 = 76 \\).",
      "The bus covers 76 miles per day."
    ]
  },
  {
    question: "A warehouse has 3,456 boxes. If a truck holds 48 boxes, how many trucks are needed?",
    image: null,
    options: ["\\( 70 \\)", "\\( 72 \\)", "\\( 74 \\)", "\\( 68 \\)"],
    correctIndex: 1,
    hint: "Divide the total number of boxes by the capacity of one truck.",
    explanation: [
      "\\( 3456 \\div 48 \\).",
      "We can simplify the division: \\( 3456 \\div 12 = 288 \\). Then \\( 288 \\div 4 = 72 \\).",
      "72 trucks are needed."
    ]
  },
  {
    question: "Solve 1,105 divided by 17.",
    image: null,
    options: ["\\( 62 \\)", "\\( 65 \\)", "\\( 55 \\)", "\\( 75 \\)"],
    correctIndex: 1,
    hint: "Use long division. Estimate \\( 110 \\div 17 \\).",
    explanation: [
      "\\( 1105 \\div 17 \\).",
      "\\( 17 \\times 6 = 102 \\), so \\( 110 - 102 = 8 \\). Bring down the 5 to get 85.",
      "\\( 17 \\times 5 = 85 \\).",
      "Therefore, \\( 1105 \\div 17 = 65 \\)."
    ]
  },
  {
    question: "A library has 120 books. If \\( \\frac{3}{8} \\) of them are mysteries, how many non-mystery books are there?",
    image: null,
    options: ["\\( 15 \\)", "\\( 40 \\)", "\\( 45 \\)", "\\( 75 \\)"],
    correctIndex: 3,
    hint: "Find the number of mystery books first, then subtract from the total. (Note: Option D was adjusted from the original text to reflect the correct math).",
    explanation: [
      "Number of mysteries = \\( 120 \\times \\frac{3}{8} \\).",
      "\\( 120 \\div 8 = 15 \\). \\( 15 \\times 3 = 45 \\) mysteries.",
      "Number of non-mysteries = \\( 120 - 45 = 75 \\)."
    ]
  },
  {
    question: "In a survey of 200 people, \\( \\frac{4}{25} \\) said they prefer tea. How many people is that?",
    image: null,
    options: ["\\( 8 \\)", "\\( 16 \\)", "\\( 32 \\)", "\\( 40 \\)"],
    correctIndex: 2,
    hint: "Multiply 200 by the fraction.",
    explanation: [
      "\\( 200 \\times \\frac{4}{25} \\).",
      "\\( 200 \\div 25 = 8 \\).",
      "\\( 8 \\times 4 = 32 \\)."
    ]
  },
  {
    question: "If you eat \\( \\frac{2}{3} \\) of a 12-slice pizza, how many slices did you eat?",
    image: null,
    options: ["\\( 4 \\)", "\\( 6 \\)", "\\( 8 \\)", "\\( 9 \\)"],
    correctIndex: 2,
    hint: "Multiply 12 by \\( \\frac{2}{3} \\).",
    explanation: [
      "\\( 12 \\times \\frac{2}{3} \\).",
      "\\( 12 \\div 3 = 4 \\).",
      "\\( 4 \\times 2 = 8 \\)."
    ]
  },
  {
    question: "Reduce \\( \\frac{48}{72} \\) to its simplest form.",
    image: null,
    options: ["\\( \\frac{4}{6} \\)", "\\( \\frac{12}{18} \\)", "\\( \\frac{2}{3} \\)", "\\( \\frac{3}{4} \\)"],
    correctIndex: 2,
    hint: "Find the Highest Common Factor (HCF) of 48 and 72.",
    explanation: [
      "Both numbers can be divided by 24.",
      "\\( 48 \\div 24 = 2 \\).",
      "\\( 72 \\div 24 = 3 \\).",
      "The simplest form is \\( \\frac{2}{3} \\)."
    ]
  },
  {
    question: "Simplify the fraction \\( \\frac{105}{135} \\).",
    image: null,
    options: ["\\( \\frac{7}{9} \\)", "\\( \\frac{21}{27} \\)", "\\( \\frac{5}{7} \\)", "\\( \\frac{3}{4} \\)"],
    correctIndex: 0,
    hint: "Divide both the numerator and denominator by their greatest common divisor (15).",
    explanation: [
      "Both numbers end in 5, so they are divisible by 5: \\( 105 \\div 5 = 21 \\), \\( 135 \\div 5 = 27 \\).",
      "Now we have \\( \\frac{21}{27} \\). Both are divisible by 3: \\( 21 \\div 3 = 7 \\), \\( 27 \\div 3 = 9 \\).",
      "The simplest form is \\( \\frac{7}{9} \\)."
    ]
  },
  {
    question: "Reduce \\( \\frac{84}{144} \\) to its simplest form.",
    image: null,
    options: ["\\( \\frac{14}{24} \\)", "\\( \\frac{21}{36} \\)", "\\( \\frac{1}{2} \\)", "\\( \\frac{7}{12} \\)"],
    correctIndex: 3,
    hint: "Find the highest common factor of 84 and 144, which is 12.",
    explanation: [
      "Divide both numbers by 12.",
      "\\( 84 \\div 12 = 7 \\).",
      "\\( 144 \\div 12 = 12 \\).",
      "The simplest form is \\( \\frac{7}{12} \\)."
    ]
  },

  // ==========================================
  // SUBJECTIVE QUESTIONS CONVERTED TO OBJECTIVE
  // ==========================================
  {
    question: "If 5 more than a number is 18, the number is ____.",
    image: null,
    options: ["\\( 11 \\)", "\\( 12 \\)", "\\( 13 \\)", "\\( 14 \\)"],
    correctIndex: 2,
    hint: "Set up the equation \\( x + 5 = 18 \\) and solve for x.",
    explanation: [
      "Let the number be \\( x \\).",
      "\\( x + 5 = 18 \\)",
      "\\( x = 18 - 5 = 13 \\)."
    ]
  },
  {
    question: "The decimal number 13 in binary is ____.",
    image: null,
    options: ["\\( 1101_2 \\)", "\\( 1011_2 \\)", "\\( 1110_2 \\)", "\\( 1001_2 \\)"],
    correctIndex: 0,
    hint: "Find the powers of 2 that add up to 13 (8 + 4 + 1).",
    explanation: [
      "13 = 8 + 4 + 1 = \\( 2^3 + 2^2 + 2^0 \\).",
      "In binary, this is written as \\( 1101_2 \\)."
    ]
  },
  {
    question: "Solve for \\( x \\): \\( x - 7 = 10 \\).",
    image: null,
    options: ["\\( 3 \\)", "\\( 13 \\)", "\\( 17 \\)", "\\( 27 \\)"],
    correctIndex: 2,
    hint: "Add 7 to both sides of the equation.",
    explanation: [
      "\\( x - 7 = 10 \\)",
      "\\( x = 10 + 7 \\)",
      "\\( x = 17 \\)."
    ]
  },
  {
    question: "Simplify the fraction \\( \\frac{24}{36} \\) to its lowest terms.",
    image: null,
    options: ["\\( \\frac{1}{2} \\)", "\\( \\frac{2}{3} \\)", "\\( \\frac{3}{4} \\)", "\\( \\frac{4}{6} \\)"],
    correctIndex: 1,
    hint: "Divide both numerator and denominator by their HCF, which is 12.",
    explanation: [
      "\\( 24 \\div 12 = 2 \\)",
      "\\( 36 \\div 12 = 3 \\)",
      "The lowest terms fraction is \\( \\frac{2}{3} \\)."
    ]
  },
  {
    question: "Evaluate: \\( 8 + 4 \\times 2 \\)",
    image: null,
    options: ["\\( 14 \\)", "\\( 16 \\)", "\\( 20 \\)", "\\( 24 \\)"],
    correctIndex: 1,
    hint: "Use BODMAS/PEMDAS. Multiplication comes before addition.",
    explanation: [
      "First, do the multiplication: \\( 4 \\times 2 = 8 \\).",
      "Next, do the addition: \\( 8 + 8 = 16 \\)."
    ]
  },
  {
    question: "Convert \\( 3\\frac{2}{5} \\) to an improper fraction.",
    image: null,
    options: ["\\( \\frac{17}{5} \\)", "\\( \\frac{13}{5} \\)", "\\( \\frac{15}{5} \\)", "\\( \\frac{19}{5} \\)"],
    correctIndex: 0,
    hint: "Multiply the whole number by the denominator, then add the numerator.",
    explanation: [
      "\\( 3 \\times 5 = 15 \\)",
      "\\( 15 + 2 = 17 \\)",
      "The improper fraction is \\( \\frac{17}{5} \\)."
    ]
  },
  {
    question: "Convert 5 kilometers to meters.",
    image: null,
    options: ["\\( 50 \\text{ m} \\)", "\\( 500 \\text{ m} \\)", "\\( 5000 \\text{ m} \\)", "\\( 50000 \\text{ m} \\)"],
    correctIndex: 2,
    hint: "1 kilometer = 1000 meters.",
    explanation: [
      "Since 1 km = 1000 m, multiply by 1000.",
      "\\( 5 \\times 1000 = 5000 \\text{ meters} \\)."
    ]
  },
  {
    question: "If John is 12 years old and his sister is 4 years younger, his sister is ____ years old.",
    image: null,
    options: ["\\( 4 \\)", "\\( 8 \\)", "\\( 12 \\)", "\\( 16 \\)"],
    correctIndex: 1,
    hint: "Subtract 4 from John's age.",
    explanation: [
      "John's age = 12.",
      "Sister's age = \\( 12 - 4 = 8 \\)."
    ]
  },
  {
    question: "Divide 144 by 4.",
    image: null,
    options: ["\\( 32 \\)", "\\( 34 \\)", "\\( 36 \\)", "\\( 38 \\)"],
    correctIndex: 2,
    hint: "Break it down: half of 144 is 72, and half of 72 is what?",
    explanation: [
      "\\( 144 \\div 2 = 72 \\)",
      "\\( 72 \\div 2 = 36 \\)",
      "Therefore, \\( 144 \\div 4 = 36 \\)."
    ]
  },
  {
    question: "Simplify the ratio 18:24 to its lowest form.",
    image: null,
    options: ["\\( 2:3 \\)", "\\( 3:4 \\)", "\\( 4:5 \\)", "\\( 6:8 \\)"],
    correctIndex: 1,
    hint: "Divide both sides of the ratio by their HCF (6).",
    explanation: [
      "Divide 18 by 6 to get 3.",
      "Divide 24 by 6 to get 4.",
      "The simplified ratio is 3:4."
    ]
  },

  // ==========================================
  // THEORY SECTION CONVERTED TO OBJECTIVE
  // ==========================================
  {
    question: "Convert \\( 1001_2 \\) to base 10.",
    image: null,
    options: ["\\( 7 \\)", "\\( 8 \\)", "\\( 9 \\)", "\\( 10 \\)"],
    correctIndex: 2,
    hint: "Multiply each digit by powers of 2: \\( 2^3, 2^2, 2^1, 2^0 \\).",
    explanation: [
      "\\( 1001_2 = (1 \\times 2^3) + (0 \\times 2^2) + (0 \\times 2^1) + (1 \\times 2^0) \\).",
      "\\( 8 + 0 + 0 + 1 = 9 \\)."
    ]
  },
  {
    question: "Convert \\( 1011_2 \\) to base 10.",
    image: null,
    options: ["\\( 9 \\)", "\\( 10 \\)", "\\( 11 \\)", "\\( 12 \\)"],
    correctIndex: 2,
    hint: "Sum the values of the active bits (1s) at positions 8, 2, and 1.",
    explanation: [
      "\\( 1011_2 = (1 \\times 8) + (0 \\times 4) + (1 \\times 2) + (1 \\times 1) \\).",
      "\\( 8 + 2 + 1 = 11 \\)."
    ]
  },
  {
    question: "Convert \\( 1110_2 \\) to base 10.",
    image: null,
    options: ["\\( 12 \\)", "\\( 13 \\)", "\\( 14 \\)", "\\( 15 \\)"],
    correctIndex: 2,
    hint: "Sum the values of the active bits (1s) at positions 8, 4, and 2.",
    explanation: [
      "\\( 1110_2 = (1 \\times 8) + (1 \\times 4) + (1 \\times 2) + (0 \\times 1) \\).",
      "\\( 8 + 4 + 2 = 14 \\)."
    ]
  },
  {
    question: "Solve for \\( x \\): \\( x - 7 = 19 \\)",
    image: null,
    options: ["\\( 12 \\)", "\\( 24 \\)", "\\( 26 \\)", "\\( 28 \\)"],
    correctIndex: 2,
    hint: "Add 7 to both sides of the equation.",
    explanation: [
      "\\( x - 7 = 19 \\)",
      "\\( x = 19 + 7 \\)",
      "\\( x = 26 \\)."
    ]
  },
  {
    question: "Solve for \\( x \\): \\( 2x + 6 = 24 \\)",
    image: null,
    options: ["\\( 6 \\)", "\\( 8 \\)", "\\( 9 \\)", "\\( 12 \\)"],
    correctIndex: 2,
    hint: "Subtract 6 from both sides, then divide by 2.",
    explanation: [
      "\\( 2x + 6 = 24 \\)",
      "\\( 2x = 24 - 6 = 18 \\)",
      "\\( x = 18 \\div 2 = 9 \\)."
    ]
  },
  {
    question: "Evaluate: \\( 3\\frac{3}{4} + 1\\frac{2}{5} \\)",
    image: null,
    options: ["\\( 4\\frac{1}{20} \\)", "\\( 4\\frac{3}{20} \\)", "\\( 5\\frac{1}{20} \\)", "\\( 5\\frac{3}{20} \\)"],
    correctIndex: 3,
    hint: "Convert to improper fractions or add the whole numbers and fractions separately finding a common denominator (20).",
    explanation: [
      "Add whole numbers: \\( 3 + 1 = 4 \\).",
      "Add fractions: \\( \\frac{3}{4} + \\frac{2}{5} \\). LCM is 20.",
      "\\( \\frac{15}{20} + \\frac{8}{20} = \\frac{23}{20} \\).",
      "\\( \\frac{23}{20} = 1\\frac{3}{20} \\).",
      "Total: \\( 4 + 1\\frac{3}{20} = 5\\frac{3}{20} \\)."
    ]
  },
  {
    question: "Convert \\( 5\\frac{1}{7} \\) to an improper fraction.",
    image: null,
    options: ["\\( \\frac{35}{7} \\)", "\\( \\frac{36}{7} \\)", "\\( \\frac{12}{7} \\)", "\\( \\frac{6}{7} \\)"],
    correctIndex: 1,
    hint: "Multiply 5 by 7 and add 1.",
    explanation: [
      "Multiply whole number by denominator: \\( 5 \\times 7 = 35 \\).",
      "Add numerator: \\( 35 + 1 = 36 \\).",
      "Place over denominator: \\( \\frac{36}{7} \\)."
    ]
  },
  {
    question: "Add 25% of 50 to 40% of 80.",
    image: null,
    options: ["\\( 42.5 \\)", "\\( 44.5 \\)", "\\( 46.5 \\)", "\\( 48.5 \\)"],
    correctIndex: 1,
    hint: "Calculate 25% of 50 and 40% of 80 separately, then add the results together.",
    explanation: [
      "25% of 50 = \\( \\frac{1}{4} \\times 50 = 12.5 \\).",
      "40% of 80 = \\( 0.4 \\times 80 = 32 \\).",
      "Add them together: \\( 12.5 + 32 = 44.5 \\)."
    ]
  },
  {
    question: "Evaluate: \\( 5 + 8 \\times 3 - 21 \\div 7 \\)",
    image: null,
    options: ["\\( 18 \\)", "\\( 24 \\)", "\\( 26 \\)", "\\( 36 \\)"],
    correctIndex: 2,
    hint: "Use BODMAS. Do the multiplication and division first.",
    explanation: [
      "Multiplication: \\( 8 \\times 3 = 24 \\).",
      "Division: \\( 21 \\div 7 = 3 \\).",
      "Substitute back: \\( 5 + 24 - 3 \\).",
      "\\( 29 - 3 = 26 \\)."
    ]
  },
  {
    question: "Evaluate: \\( \\sqrt{0.0625} + \\sqrt{1.25} \\)",
    image: null,
    options: ["\\( 0.25 + \\sqrt{1.25} \\)", "\\( 1.5 \\)", "\\( 1.25 \\)", "\\( 1.45 \\)"],
    correctIndex: 0,
    hint: "Evaluate \\( \\sqrt{0.0625} \\). Since \\( \\sqrt{1.25} \\) is not a perfect rational square, leave it in surd/decimal form.",
    explanation: [
      "\\( \\sqrt{0.0625} = 0.25 \\) because \\( 0.25 \\times 0.25 = 0.0625 \\).",
      "\\( \\sqrt{1.25} \\) does not simplify to a neat decimal (it is approx 1.118).",
      "Thus, the exact simplified form is \\( 0.25 + \\sqrt{1.25} \\). (Note: If \\( 1.25 \\) was a typo for \\( 1.44 \\), the answer would be \\( 1.45 \\))."
    ]
  },
  {
    question: "Evaluate: \\( \\sqrt{2\\frac{7}{9}} \\)",
    image: null,
    options: ["\\( 1\\frac{1}{3} \\)", "\\( 1\\frac{2}{3} \\)", "\\( 2\\frac{1}{3} \\)", "\\( 2\\frac{2}{3} \\)"],
    correctIndex: 1,
    hint: "Convert the mixed fraction to an improper fraction first, then square root the top and bottom.",
    explanation: [
      "Convert to improper fraction: \\( 2\\frac{7}{9} = \\frac{(2 \\times 9) + 7}{9} = \\frac{25}{9} \\).",
      "Take the square root of numerator and denominator: \\( \\frac{\\sqrt{25}}{\\sqrt{9}} = \\frac{5}{3} \\).",
      "Convert back to a mixed fraction: \\( \\frac{5}{3} = 1\\frac{2}{3} \\)."
    ]
  },
  {
    question: "Evaluate: \\( 10^2 + (36 - \\sqrt{81}) \\)",
    image: null,
    options: ["\\( 117 \\)", "\\( 127 \\)", "\\( 137 \\)", "\\( 147 \\)"],
    correctIndex: 1,
    hint: "Calculate the square root inside the bracket first, resolve the bracket, then add to \\( 10^2 \\).",
    explanation: [
      "\\( 10^2 = 100 \\).",
      "\\( \\sqrt{81} = 9 \\).",
      "Bracket: \\( 36 - 9 = 27 \\).",
      "Add them together: \\( 100 + 27 = 127 \\)."
    ]
  }
];

let currentQuestionIndex = 0;
let answers = new Array(quizData.length).fill(null);
let timeLeft = 60 * 60;

let correctCount = 0;
let wrongCount = 0;

const elQuestionText = document.getElementById('question-text');
const elQuestionImage = document.getElementById('question-image');
const elOptionsContainer = document.getElementById('options-container');
const elQNumDisplay = document.getElementById('q-number-display');
const elCurrentQText = document.getElementById('current-q-text');
const elTotalQText = document.getElementById('total-q-text');
const elBtnPrev = document.getElementById('btn-prev');
const elBtnNext = document.getElementById('btn-next');
const elSlider = document.getElementById('q-slider');
const elInput = document.getElementById('q-input');
const elHintContainer = document.getElementById('hint-container');
const elHintText = document.getElementById('hint-text');
const elHintContent = document.getElementById('hint-content');
const elHintIcon = document.getElementById('hint-icon');
const elTimer = document.getElementById('timer-display');
const elCorrectCount = document.getElementById('correct-count');
const elWrongCount = document.getElementById('wrong-count');
const elUnansweredDots = document.getElementById('unanswered-dots');

function init() {
  const total = quizData.length;
  elTotalQText.innerText = total;
  elSlider.max = total;
  elInput.max = total;
  
  loadQuestion();
  startTimer();
  
  elSlider.addEventListener('input', (e) => jumpToQuestion(e.target.value - 1));
  elInput.addEventListener('change', (e) => {
    let val = parseInt(e.target.value);
    if (val >= 1 && val <= total) jumpToQuestion(val - 1);
    else e.target.value = currentQuestionIndex + 1;
  });
}

function renderUnansweredDots() {
  elUnansweredDots.innerHTML = '';
  let hasUnanswered = false;
  
  answers.forEach((ans, index) => {
    if (ans === null) {
      hasUnanswered = true;
      const dot = document.createElement('div');
      dot.className = `nav-dot ${index === currentQuestionIndex ? 'active' : ''}`;
      dot.id = `nav-dot-${index}`;
      dot.onclick = () => jumpToQuestion(index);
      elUnansweredDots.appendChild(dot);
    }
  });
  
  if (!hasUnanswered) {
    elUnansweredDots.style.display = 'none';
  } else {
    elUnansweredDots.style.display = 'flex';
  }
}

function loadQuestion() {
  const qData = quizData[currentQuestionIndex];
  
  elQNumDisplay.innerText = currentQuestionIndex + 1;
  elCurrentQText.innerText = currentQuestionIndex + 1;
  elSlider.value = currentQuestionIndex + 1;
  elInput.value = currentQuestionIndex + 1;
  
  elQuestionText.innerHTML = qData.question;
  
  if (qData.image) {
    elQuestionImage.src = qData.image;
    elQuestionImage.classList.remove('hidden');
  } else {
    elQuestionImage.src = "";
    elQuestionImage.classList.add('hidden');
  }
  
  elHintContent.classList.add('hidden');
  elHintIcon.innerText = 'expand_more';
  elHintText.innerHTML = qData.hint;
  
  if (answers[currentQuestionIndex] !== null) {
    elHintContainer.style.display = 'none';
  } else {
    elHintContainer.style.display = 'block';
  }
  
  // Refresh the dots to ensure the active state moves correctly
  renderUnansweredDots();
  
  elOptionsContainer.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  
  qData.options.forEach((optText, index) => {
    const isAnswered = answers[currentQuestionIndex] !== null;
    const isSelected = answers[currentQuestionIndex] === index;
    const isCorrect = index === qData.correctIndex;
    
    let cardClass = "option-card";
    if (isAnswered) {
      cardClass += " disabled";
      if (isCorrect) cardClass += " correct";
      if (isSelected && !isCorrect) cardClass += " incorrect";
    }
    
    let feedbackIcon = isCorrect ? "check" : "close";
    let feedbackTitle = isCorrect ? "Right answer" : "Not quite";
    
    let feedbackDesc = "";
    if (isCorrect) {
      feedbackDesc = qData.explanation.map(step => `<div class="math-step">${step}</div>`).join('');
    } else {
      if (qData.wrongFeedback && qData.wrongFeedback[index]) {
        feedbackDesc = `<div class="math-step">${qData.wrongFeedback[index]}</div>`;
      } else {
        feedbackDesc = `<div class="math-step">This option is incorrect. See the right answer for the full working.</div>`;
      }
    }
    
    const cardHtml = `
                    <div class="${cardClass}" onclick="selectOption(${index})" id="opt-card-${index}">
                        <div class="option-content">
                            <span class="option-letter">${letters[index]}.</span>
                            <span class="option-text">${optText}</span>
                        </div>
                        
                        <div class="feedback-box" id="feedback-${index}">
                            <div class="feedback-title">
                                <span class="material-symbols-outlined">${feedbackIcon}</span>
                                ${feedbackTitle}
                            </div>
                            <div class="feedback-desc">
                                ${feedbackDesc}
                            </div>
                        </div>
                    </div>
                `;
    elOptionsContainer.insertAdjacentHTML('beforeend', cardHtml);
  });
  
  elBtnPrev.disabled = currentQuestionIndex === 0;
  elBtnNext.innerText = currentQuestionIndex === quizData.length - 1 ? "Finish" : "Next";
  
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function selectOption(selectedIndex) {
  if (answers[currentQuestionIndex] !== null) return;
  
  const qData = quizData[currentQuestionIndex];
  answers[currentQuestionIndex] = selectedIndex;
  
  const isSelectedCorrect = selectedIndex === qData.correctIndex;
  
  if (isSelectedCorrect) {
    correctCount++;
    elCorrectCount.innerText = correctCount;
  } else {
    wrongCount++;
    elWrongCount.innerText = wrongCount;
  }
  
  elHintContainer.style.display = 'none';
  
  // Animate the specific dot popping out, then re-render
  const activeDot = document.getElementById(`nav-dot-${currentQuestionIndex}`);
  if (activeDot) {
    activeDot.classList.add('pop-out');
    setTimeout(() => {
      renderUnansweredDots();
    }, 300); // Matches CSS transition duration
  } else {
    renderUnansweredDots();
  }
  
  const options = document.querySelectorAll('.option-card');
  options.forEach((opt, idx) => {
    opt.classList.add('disabled');
    
    if (idx === qData.correctIndex) {
      opt.classList.add('correct');
    }
    
    if (idx === selectedIndex && idx !== qData.correctIndex) {
      opt.classList.add('incorrect');
    }
  });
  
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

function changeQuestion(direction) {
  let newIndex = currentQuestionIndex + direction;
  if (newIndex >= 0 && newIndex < quizData.length) {
    currentQuestionIndex = newIndex;
    loadQuestion();
  } else if (newIndex >= quizData.length) {
    alert("Quiz Completed! Check your results.");
  }
}

function jumpToQuestion(index) {
  currentQuestionIndex = index;
  loadQuestion();
}

function toggleHint() {
  const isHidden = elHintContent.classList.contains('hidden');
  if (isHidden) {
    elHintContent.classList.remove('hidden');
    elHintIcon.innerText = 'expand_less';
    if (window.MathJax) MathJax.typesetPromise();
  } else {
    elHintContent.classList.add('hidden');
    elHintIcon.innerText = 'expand_more';
  }
}

function startTimer() {
  const timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      elTimer.innerText = "00:00";
      alert("Time is up!");
      return;
    }
    
    timeLeft--;
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    
    elTimer.innerText = `${m}:${s}`;
  }, 1000);
}

window.onload = init;