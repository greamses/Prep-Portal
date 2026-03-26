import setupQuiz from '../../../question.js'

const quizData = [
  // ==========================================
  // OBJECTIVE QUESTIONS (1 - 30)
  // ==========================================
  {
    question: "Evaluate: \\( 96 \\div 8 \\times 3 + 18 \\div 3 \\times 4 \\)",
    image: null,
    options: ["\\( 48 \\)", "\\( 52 \\)", "\\( 56 \\)", "\\( 60 \\)"],
    correctIndex: 3,
    hint: "Use BODMAS/PEMDAS. Perform division first, then multiplication, and finally addition.",
    explanation: [
      "First, do the divisions: \\( 96 \\div 8 = 12 \\) and \\( 18 \\div 3 = 6 \\).",
      "Substitute them back: \\( 12 \\times 3 + 6 \\times 4 \\).",
      "Next, do the multiplications: \\( 12 \\times 3 = 36 \\) and \\( 6 \\times 4 = 24 \\).",
      "Finally, add the results: \\( 36 + 24 = 60 \\)."
    ]
  },
  {
    question: "A number is such that when multiplied by 7 and reduced by 9, the result is 68. Find the number.",
    image: null,
    options: ["\\( 9 \\)", "\\( 10 \\)", "\\( 11 \\)", "\\( 12 \\)"],
    correctIndex: 2,
    hint: "Set up an algebraic equation: \\( 7x - 9 = 68 \\).",
    explanation: [
      "Let the number be \\( x \\).",
      "Multiply by 7 and reduce by 9: \\( 7x - 9 = 68 \\).",
      "Add 9 to both sides: \\( 7x = 77 \\).",
      "Divide by 7: \\( x = 11 \\)."
    ]
  },
  {
    question: "Find the missing number: \\( 4, 6, 12, 14, 28, 30, \\dots \\)",
    image: null,
    options: ["\\( 52 \\)", "\\( 56 \\)", "\\( 60 \\)", "\\( 62 \\)"],
    correctIndex: 2,
    hint: "Look for alternating operations (+2, ×2) between adjacent numbers.",
    explanation: [
      "The pattern alternates between adding 2 and multiplying by 2.",
      "\\( 4 + 2 = 6 \\)",
      "\\( 6 \\times 2 = 12 \\)",
      "\\( 12 + 2 = 14 \\)",
      "\\( 14 \\times 2 = 28 \\)",
      "\\( 28 + 2 = 30 \\)",
      "The next step is multiplying by 2: \\( 30 \\times 2 = 60 \\)."
    ]
  },
  {
    question: "The sum of three consecutive even numbers is 72. Find the largest number.",
    image: null,
    options: ["\\( 22 \\)", "\\( 24 \\)", "\\( 26 \\)", "\\( 28 \\)"],
    correctIndex: 2,
    hint: "Let the three consecutive even numbers be \\( x \\), \\( x+2 \\), and \\( x+4 \\).",
    explanation: [
      "Let the numbers be \\( x \\), \\( x+2 \\), and \\( x+4 \\).",
      "\\( x + (x + 2) + (x + 4) = 72 \\)",
      "\\( 3x + 6 = 72 \\)",
      "\\( 3x = 66 \\implies x = 22 \\)",
      "The numbers are 22, 24, and 26. The largest is 26."
    ]
  },
  {
    question: "Find the value of: \\( \\frac{3}{4} \\times \\frac{8}{9} \\div \\frac{2}{3} \\)",
    image: null,
    options: ["\\( 1 \\)", "\\( \\frac{4}{3} \\)", "\\( \\frac{3}{2} \\)", "\\( 2 \\)"],
    correctIndex: 0,
    hint: "Evaluate multiplication first, then change division to multiplication by flipping the second fraction.",
    explanation: [
      "First evaluate \\( \\frac{3}{4} \\times \\frac{8}{9} \\):",
      "\\( \\frac{3 \\times 8}{4 \\times 9} = \\frac{24}{36} = \\frac{2}{3} \\)",
      "Now divide by \\( \\frac{2}{3} \\):",
      "\\( \\frac{2}{3} \\div \\frac{2}{3} = \\frac{2}{3} \\times \\frac{3}{2} = 1 \\)."
    ]
  },
  {
    question: "A trader makes 25% profit on an item sold for ₦2,500. Find the cost price.",
    image: null,
    options: ["₦1,800", "₦2,000", "₦2,200", "₦2,300"],
    correctIndex: 1,
    hint: "Selling Price (SP) = Cost Price (CP) + Profit. Since profit is 25%, SP = 125% of CP.",
    explanation: [
      "Selling Price = 125% of Cost Price",
      "\\( 2500 = 1.25 \\times \\text{CP} \\)",
      "\\( \\text{CP} = \\frac{2500}{1.25} \\)",
      "\\( \\text{CP} = 2000 \\)"
    ]
  },
  {
    question: "Find the HCF of 84 and 126.",
    image: null,
    options: ["\\( 14 \\)", "\\( 21 \\)", "\\( 28 \\)", "\\( 42 \\)"],
    correctIndex: 3,
    hint: "Find the prime factorization of both numbers and multiply the lowest powers of common primes.",
    explanation: [
      "Factors of 84: \\( 2^2 \\times 3 \\times 7 \\)",
      "Factors of 126: \\( 2 \\times 3^2 \\times 7 \\)",
      "Common factors are 2, 3, and 7.",
      "HCF = \\( 2^1 \\times 3^1 \\times 7^1 = 42 \\)."
    ]
  },
  {
    question: "Find the next number: \\( 2, 6, 7, 21, 22, 66, \\dots \\)",
    image: null,
    options: ["\\( 67 \\)", "\\( 68 \\)", "\\( 72 \\)", "\\( 132 \\)"],
    correctIndex: 0,
    hint: "The pattern alternates between multiplying by 3 and adding 1.",
    explanation: [
      "\\( 2 \\times 3 = 6 \\)",
      "\\( 6 + 1 = 7 \\)",
      "\\( 7 \\times 3 = 21 \\)",
      "\\( 21 + 1 = 22 \\)",
      "\\( 22 \\times 3 = 66 \\)",
      "The next step is adding 1: \\( 66 + 1 = 67 \\)."
    ]
  },
  {
    question: "A number leaves remainder 3 when divided by 5 and remainder 5 when divided by 7. Find the smallest such number.",
    image: null,
    options: ["\\( 23 \\)", "\\( 33 \\)", "\\( 38 \\)", "\\( 68 \\)"],
    correctIndex: 1,
    hint: "List out numbers that leave a remainder of 3 when divided by 5, and see which one leaves a remainder of 5 when divided by 7.",
    explanation: [
      "Numbers leaving remainder 3 when divided by 5: 8, 13, 18, 23, 28, 33, 38...",
      "Now check dividing by 7: \\( 33 \\div 7 = 4 \\text{ remainder } 5 \\).",
      "Therefore, 33 is the correct number."
    ]
  },
  {
    question: "The average of 8 numbers is 15. If one number is removed, the average becomes 14. Find the removed number.",
    image: null,
    options: ["\\( 20 \\)", "\\( 21 \\)", "\\( 22 \\)", "\\( 23 \\)"],
    correctIndex: 2,
    hint: "Calculate the total sum of the 8 numbers, then the total sum of the remaining 7 numbers. The difference is the removed number.",
    explanation: [
      "Sum of 8 numbers = \\( 8 \\times 15 = 120 \\)",
      "Sum of 7 numbers = \\( 7 \\times 14 = 98 \\)",
      "Removed number = \\( 120 - 98 = 22 \\)."
    ]
  },
  {
    question: "Find the missing number: \\( 1, 3, 9, 27, \\dots , 243 \\)",
    image: null,
    options: ["\\( 54 \\)", "\\( 72 \\)", "\\( 81 \\)", "\\( 108 \\)"],
    correctIndex: 2,
    hint: "This is a geometric progression. Look at what you need to multiply each term by to get the next.",
    explanation: [
      "Each number is multiplied by 3.",
      "\\( 27 \\times 3 = 81 \\).",
      "To check: \\( 81 \\times 3 = 243 \\), which matches."
    ]
  },
  {
    question: "Find the LCM of 12, 15, and 20.",
    image: null,
    options: ["\\( 40 \\)", "\\( 50 \\)", "\\( 60 \\)", "\\( 120 \\)"],
    correctIndex: 2,
    hint: "Find the smallest number that is a multiple of all three numbers.",
    explanation: [
      "Multiples of 20: 20, 40, 60, 80...",
      "Check 60: \\( 60 \\div 12 = 5 \\) and \\( 60 \\div 15 = 4 \\).",
      "60 is perfectly divisible by all three numbers. Therefore, the LCM is 60."
    ]
  },
  {
    question: "Find the value of: \\( (18 \\times 4) - (24 \\div 6 \\times 5) \\)",
    image: null,
    options: ["\\( 40 \\)", "\\( 48 \\)", "\\( 52 \\)", "\\( 60 \\)"],
    correctIndex: 2,
    hint: "Solve inside the parentheses first using standard order of operations (BODMAS).",
    explanation: [
      "First bracket: \\( 18 \\times 4 = 72 \\).",
      "Second bracket: \\( 24 \\div 6 \\times 5 \\). Division first: \\( 4 \\times 5 = 20 \\).",
      "Subtract the results: \\( 72 - 20 = 52 \\)."
    ]
  },
  {
    question: "A man spends \\( \\frac{1}{3} \\) of his money, then \\( \\frac{1}{4} \\) of the remainder. He has ₦900 left. Find the original amount.",
    image: null,
    options: ["₦1,400", "₦1,600", "₦1,800", "₦2,000"],
    correctIndex: 2,
    hint: "Find the fraction of money left over, and equate it to ₦900.",
    explanation: [
      "Let the original amount be \\( x \\).",
      "He spends \\( \\frac{1}{3}x \\), so remainder = \\( \\frac{2}{3}x \\).",
      "He then spends \\( \\frac{1}{4} \\) of the remainder = \\( \\frac{1}{4} \\times \\frac{2}{3}x = \\frac{1}{6}x \\).",
      "Total fraction spent = \\( \\frac{1}{3}x + \\frac{1}{6}x = \\frac{1}{2}x \\).",
      "Fraction left = \\( \\frac{1}{2}x = 900 \\).",
      "Original amount = \\( 900 \\times 2 = 1800 \\)."
    ]
  },
  {
    question: "Find the number of factors of 36.",
    image: null,
    options: ["\\( 6 \\)", "\\( 7 \\)", "\\( 8 \\)", "\\( 9 \\)"],
    correctIndex: 3,
    hint: "List out all the whole numbers that can divide 36 without leaving a remainder.",
    explanation: [
      "The factors of 36 are: 1, 2, 3, 4, 6, 9, 12, 18, and 36.",
      "Counting them, there are 9 factors in total."
    ]
  },
  {
    question: "Find the next number: \\( 5, 9, 17, 33, 65, \\dots \\)",
    image: null,
    options: ["\\( 97 \\)", "\\( 113 \\)", "\\( 129 \\)", "\\( 135 \\)"],
    correctIndex: 2,
    hint: "Find the difference between consecutive terms. You'll see a pattern in those differences.",
    explanation: [
      "Differences between terms: \\( 9-5=4 \\), \\( 17-9=8 \\), \\( 33-17=16 \\), \\( 65-33=32 \\).",
      "The differences are doubling (4, 8, 16, 32).",
      "The next difference is 64. So, \\( 65 + 64 = 129 \\)."
    ]
  },
  {
    question: "A square has a perimeter of 64 cm. Find its area.",
    image: null,
    options: ["\\( 128 \\text{ cm}^2 \\)", "\\( 196 \\text{ cm}^2 \\)", "\\( 256 \\text{ cm}^2 \\)", "\\( 512 \\text{ cm}^2 \\)"],
    correctIndex: 2,
    hint: "Perimeter = \\( 4 \\times \\text{side} \\). Find the side first, then calculate the area.",
    explanation: [
      "Perimeter of a square = \\( 4 \\times \\text{side} = 64 \\).",
      "Side = \\( \\frac{64}{4} = 16 \\text{ cm} \\).",
      "Area = \\( \\text{side}^2 = 16 \\times 16 = 256 \\text{ cm}^2 \\)."
    ]
  },
  {
    question: "Find the value of: \\( 7^2 - 3^2 + 2^3 \\)",
    image: null,
    options: ["\\( 44 \\)", "\\( 46 \\)", "\\( 48 \\)", "\\( 50 \\)"],
    correctIndex: 2,
    hint: "Evaluate the exponents first, then add and subtract.",
    explanation: [
      "Evaluate the powers: \\( 7^2 = 49 \\), \\( 3^2 = 9 \\), and \\( 2^3 = 8 \\).",
      "Substitute them back: \\( 49 - 9 + 8 \\).",
      "\\( 40 + 8 = 48 \\)."
    ]
  },
  {
    question: "The sum of two numbers is 56 and their difference is 8. Find the smaller number.",
    image: null,
    options: ["\\( 20 \\)", "\\( 22 \\)", "\\( 24 \\)", "\\( 26 \\)"],
    correctIndex: 2,
    hint: "Set up simultaneous equations: \\( x + y = 56 \\) and \\( x - y = 8 \\).",
    explanation: [
      "Let the numbers be \\( x \\) and \\( y \\).",
      "\\( x + y = 56 \\)",
      "\\( x - y = 8 \\)",
      "Add equations: \\( 2x = 64 \\implies x = 32 \\) (larger number).",
      "Subtract to find the smaller number: \\( 56 - 32 = 24 \\)."
    ]
  },
  {
    question: "Find the missing number: \\( 3, 5, 11, 21, 43, \\dots \\)",
    image: null,
    options: ["\\( 65 \\)", "\\( 75 \\)", "\\( 85 \\)", "\\( 87 \\)"],
    correctIndex: 2,
    hint: "Multiply by 2, then alternate between subtracting 1 and adding 1.",
    explanation: [
      "Pattern: \\( \\times 2 \\), then alternately \\(-1\\) or \\(+1\\).",
      "\\( 3 \\times 2 - 1 = 5 \\)",
      "\\( 5 \\times 2 + 1 = 11 \\)",
      "\\( 11 \\times 2 - 1 = 21 \\)",
      "\\( 21 \\times 2 + 1 = 43 \\)",
      "Next step: \\( 43 \\times 2 - 1 = 86 - 1 = 85 \\)."
    ]
  },
  {
    question: "Find 15% of 240.",
    image: null,
    options: ["\\( 32 \\)", "\\( 34 \\)", "\\( 36 \\)", "\\( 38 \\)"],
    correctIndex: 2,
    hint: "You can find 10% first, then 5% (which is half of 10%), and add them together.",
    explanation: [
      "10% of 240 = 24.",
      "5% of 240 = 12.",
      "15% = 10% + 5% = \\( 24 + 12 = 36 \\)."
    ]
  },
  {
    question: "A number is multiplied by itself and 9 is added to get 58. Find the number.",
    image: null,
    options: ["\\( 5 \\)", "\\( 6 \\)", "\\( 7 \\)", "\\( 8 \\)"],
    correctIndex: 2,
    hint: "Form the equation \\( x^2 + 9 = 58 \\) and solve for \\( x \\).",
    explanation: [
      "Let the number be \\( x \\).",
      "\\( x^2 + 9 = 58 \\).",
      "\\( x^2 = 58 - 9 = 49 \\).",
      "The square root of 49 is 7, so \\( x = 7 \\)."
    ]
  },
  {
    question: "Find the next number: \\( 8, 16, 24, 48, 72, \\dots \\)",
    image: null,
    options: ["\\( 96 \\)", "\\( 120 \\)", "\\( 144 \\)", "\\( 216 \\)"],
    correctIndex: 2,
    hint: "Look at the numbers in groups. Multiply a base number by 2 and then by 3.",
    explanation: [
      "The sequence forms groups: base, \\( \\times 2 \\), \\( \\times 3 \\).",
      "First group uses 8: \\( 8 \\times 2 = 16 \\), \\( 8 \\times 3 = 24 \\).",
      "Second group uses 24: \\( 24 \\times 2 = 48 \\), \\( 24 \\times 3 = 72 \\).",
      "The third group will use 72 as the base: \\( 72 \\times 2 = 144 \\)."
    ]
  },
  {
    question: "Find the value of: \\( \\frac{2}{5} + \\frac{3}{10} \\times \\frac{4}{3} \\)",
    image: null,
    options: ["\\( \\frac{3}{5} \\)", "\\( \\frac{4}{5} \\)", "\\( \\frac{9}{10} \\)", "\\( 1 \\)"],
    correctIndex: 1,
    hint: "Remember BODMAS/PEMDAS. Do the multiplication before the addition.",
    explanation: [
      "Multiply first: \\( \\frac{3}{10} \\times \\frac{4}{3} = \\frac{12}{30} = \\frac{2}{5} \\).",
      "Now add it to the first fraction: \\( \\frac{2}{5} + \\frac{2}{5} = \\frac{4}{5} \\)."
    ]
  },
  {
    question: "How many multiples of 4 are between 10 and 50?",
    image: null,
    options: ["\\( 8 \\)", "\\( 9 \\)", "\\( 10 \\)", "\\( 11 \\)"],
    correctIndex: 2,
    hint: "List them out or use the arithmetic progression formula where the first term is 12 and the last term is 48.",
    explanation: [
      "The first multiple of 4 after 10 is 12. The last multiple before 50 is 48.",
      "The sequence is 12, 16, 20... 48.",
      "Using the formula for the number of terms: \\( \\frac{\\text{Last} - \\text{First}}{\\text{Difference}} + 1 \\).",
      "\\( \\frac{48 - 12}{4} + 1 = \\frac{36}{4} + 1 = 9 + 1 = 10 \\)."
    ]
  },
  {
    question: "A boy is 12 years old. His father is 3 times his age. In how many years will the father be twice his age?",
    image: null,
    options: ["\\( 10 \\)", "\\( 12 \\)", "\\( 15 \\)", "\\( 18 \\)"],
    correctIndex: 1,
    hint: "Set up an equation where \\( x \\) is the number of years: \\( \\text{Father's age} + x = 2 \\times (\\text{Boy's age} + x) \\).",
    explanation: [
      "Boy's current age = 12. Father's current age = \\( 12 \\times 3 = 36 \\).",
      "Let the required years be \\( x \\).",
      "\\( 36 + x = 2(12 + x) \\)",
      "\\( 36 + x = 24 + 2x \\)",
      "Subtract \\( x \\) from both sides and 24 from both sides: \\( x = 12 \\)."
    ]
  },
  {
    question: "Find the missing number: \\( 2, 3, 5, 9, 17, \\dots \\)",
    image: null,
    options: ["\\( 25 \\)", "\\( 31 \\)", "\\( 33 \\)", "\\( 35 \\)"],
    correctIndex: 2,
    hint: "Find the difference between consecutive terms.",
    explanation: [
      "Differences between terms: \\( 3-2=1 \\), \\( 5-3=2 \\), \\( 9-5=4 \\), \\( 17-9=8 \\).",
      "The differences double each time (1, 2, 4, 8...).",
      "The next difference is 16. \\( 17 + 16 = 33 \\)."
    ]
  },
  {
    question: "Find the simple interest on ₦3,000 at 8% for 2 years.",
    image: null,
    options: ["₦400", "₦440", "₦480", "₦520"],
    correctIndex: 2,
    hint: "Use the formula: \\( SI = \\frac{P \\times R \\times T}{100} \\).",
    explanation: [
      "\\( SI = \\frac{3000 \\times 8 \\times 2}{100} \\)",
      "\\( SI = 30 \\times 8 \\times 2 \\)",
      "\\( SI = 480 \\)."
    ]
  },
  {
    question: "Find the area of a triangle whose base is 15 cm and height is 12 cm.",
    image: null,
    options: ["\\( 60 \\text{ cm}^2 \\)", "\\( 90 \\text{ cm}^2 \\)", "\\( 120 \\text{ cm}^2 \\)", "\\( 180 \\text{ cm}^2 \\)"],
    correctIndex: 1,
    hint: "Area of a triangle = \\( \\frac{1}{2} \\times \\text{base} \\times \\text{height} \\).",
    explanation: [
      "Area = \\( \\frac{1}{2} \\times 15 \\times 12 \\).",
      "Half of 12 is 6.",
      "\\( 15 \\times 6 = 90 \\text{ cm}^2 \\)."
    ]
  },
  {
    question: "How many prime numbers are between 10 and 30?",
    image: null,
    options: ["\\( 5 \\)", "\\( 6 \\)", "\\( 7 \\)", "\\( 8 \\)"],
    correctIndex: 1,
    hint: "List out the numbers that can only be divided by 1 and themselves.",
    explanation: [
      "The prime numbers between 10 and 30 are: 11, 13, 17, 19, 23, and 29.",
      "Counting them, there are exactly 6 prime numbers."
    ]
  },

  // ==========================================
  // SUBJECTIVE QUESTIONS CONVERTED TO OBJECTIVE
  // ==========================================
  {
    question: "Write 142 in Roman numerals.",
    image: null,
    options: ["CXLII", "CXLI", "CXXLII", "CXLIII"],
    correctIndex: 0,
    hint: "Break 142 into 100 + 40 + 2. Translate each part into Roman numerals.",
    explanation: [
      "100 in Roman numerals is C.",
      "40 in Roman numerals is XL.",
      "2 in Roman numerals is II.",
      "Combine them together to get CXLII."
    ]
  },
  {
    question: "Evaluate: \\( 12 \\times 7 + 6 \\div 2 \\)",
    image: null,
    options: ["\\( 45 \\)", "\\( 84 \\)", "\\( 87 \\)", "\\( 90 \\)"],
    correctIndex: 2,
    hint: "Use BODMAS: Multiply and divide before you add.",
    explanation: [
      "Multiply first: \\( 12 \\times 7 = 84 \\).",
      "Divide next: \\( 6 \\div 2 = 3 \\).",
      "Add the results: \\( 84 + 3 = 87 \\)."
    ]
  },
  {
    question: "To find the area of a rectangle, you must multiply the length by the ________.",
    image: null,
    options: ["Perimeter", "Width", "Volume", "Height"],
    correctIndex: 1,
    hint: "A rectangle is a 2D shape defined by how long and wide it is.",
    explanation: [
      "The formula for the area of a rectangle is \\( \\text{Area} = \\text{Length} \\times \\text{Width} \\) (or breadth)."
    ]
  },
  {
    question: "Find the LCM of 9 and 15.",
    image: null,
    options: ["\\( 3 \\)", "\\( 15 \\)", "\\( 45 \\)", "\\( 135 \\)"],
    correctIndex: 2,
    hint: "List the multiples of 15 and see which one is also divisible by 9.",
    explanation: [
      "Multiples of 15: 15, 30, 45, 60...",
      "Multiples of 9: 9, 18, 27, 36, 45...",
      "The lowest common multiple they share is 45."
    ]
  },
  {
    question: "What is the HCF of 8 and 12?",
    image: null,
    options: ["\\( 2 \\)", "\\( 4 \\)", "\\( 8 \\)", "\\( 24 \\)"],
    correctIndex: 1,
    hint: "What is the largest number that divides into both 8 and 12 without leaving a remainder?",
    explanation: [
      "Factors of 8: 1, 2, 4, 8.",
      "Factors of 12: 1, 2, 3, 4, 6, 12.",
      "The highest common factor shared by both lists is 4."
    ]
  },
  {
    question: "Evaluate: \\( 1236 \\div 6 \\)",
    image: null,
    options: ["\\( 26 \\)", "\\( 206 \\)", "\\( 216 \\)", "\\( 2006 \\)"],
    correctIndex: 1,
    hint: "Break the division into parts: \\( 1200 \\div 6 \\) and \\( 36 \\div 6 \\).",
    explanation: [
      "\\( 1200 \\div 6 = 200 \\).",
      "\\( 36 \\div 6 = 6 \\).",
      "\\( 200 + 6 = 206 \\). Ensure you include the zero placeholder!"
    ]
  },
  {
    question: "Evaluate: \\( 4.52 \\times 1000 \\)",
    image: null,
    options: ["\\( 45.2 \\)", "\\( 452 \\)", "\\( 4520 \\)", "\\( 45200 \\)"],
    correctIndex: 2,
    hint: "When multiplying by a multiple of 10, shift the decimal point to the right by the number of zeros.",
    explanation: [
      "There are 3 zeros in 1000.",
      "Move the decimal point 3 places to the right: 4.52 \\(\\rightarrow\\) 45.2 \\(\\rightarrow\\) 452 \\(\\rightarrow\\) 4520."
    ]
  },
  {
    question: "Evaluate: \\( 85.67 \\div 100 \\)",
    image: null,
    options: ["\\( 8.567 \\)", "\\( 0.8567 \\)", "\\( 0.08567 \\)", "\\( 8567 \\)"],
    correctIndex: 1,
    hint: "When dividing by a multiple of 10, move the decimal point to the left.",
    explanation: [
      "There are 2 zeros in 100.",
      "Move the decimal point 2 places to the left: 85.67 \\(\\rightarrow\\) 8.567 \\(\\rightarrow\\) 0.8567."
    ]
  },
  {
    question: "Round 7.84 to one decimal place.",
    image: null,
    options: ["\\( 7.8 \\)", "\\( 7.9 \\)", "\\( 8.0 \\)", "\\( 7.84 \\)"],
    correctIndex: 0,
    hint: "Look at the second decimal digit. If it is less than 5, round down.",
    explanation: [
      "The target is one decimal place (the tenths column, which is 8).",
      "Look at the digit to the right (the hundredths column, which is 4).",
      "Since 4 is less than 5, we keep the 8 as it is. The answer is 7.8."
    ]
  },
  {
    question: "Round 2.357 to two decimal places.",
    image: null,
    options: ["\\( 2.35 \\)", "\\( 2.36 \\)", "\\( 2.37 \\)", "\\( 2.40 \\)"],
    correctIndex: 1,
    hint: "Look at the third decimal digit. If it is 5 or more, round up.",
    explanation: [
      "The target is two decimal places (the hundredths column, which is 5).",
      "Look at the digit to the right (the thousandths column, which is 7).",
      "Since 7 is 5 or more, round up the 5 to a 6. The answer is 2.36."
    ]
  },

  // ==========================================
  // THEORY SECTION CONVERTED TO OBJECTIVE
  // ==========================================
  // ALGEBRA
  {
    question: "Expand: \\( 4(3x + 5) \\)",
    image: null,
    options: ["\\( 12x + 5 \\)", "\\( 7x + 9 \\)", "\\( 12x + 20 \\)", "\\( 12x^2 + 20 \\)"],
    correctIndex: 2,
    hint: "Distribute the 4 by multiplying it by every term inside the parentheses.",
    explanation: [
      "Multiply 4 by \\( 3x \\): \\( 4 \\times 3x = 12x \\).",
      "Multiply 4 by 5: \\( 4 \\times 5 = 20 \\).",
      "Combine the terms: \\( 12x + 20 \\)."
    ]
  },
  {
    question: "Expand: \\( 2(5y - 7) \\)",
    image: null,
    options: ["\\( 10y - 7 \\)", "\\( 10y - 14 \\)", "\\( 7y - 9 \\)", "\\( 10y + 14 \\)"],
    correctIndex: 1,
    hint: "Multiply the outside term by each term inside the bracket.",
    explanation: [
      "Multiply 2 by \\( 5y \\): \\( 2 \\times 5y = 10y \\).",
      "Multiply 2 by \\( -7 \\): \\( 2 \\times -7 = -14 \\).",
      "Combine the terms: \\( 10y - 14 \\)."
    ]
  },
  {
    question: "Evaluate: \\( 2x^2 - 5x + 4 \\) when \\( x = 3 \\)",
    image: null,
    options: ["\\( 4 \\)", "\\( 7 \\)", "\\( 10 \\)", "\\( 13 \\)"],
    correctIndex: 1,
    hint: "Substitute 3 in place of x and apply the order of operations (exponents first).",
    explanation: [
      "Substitute \\( x = 3 \\): \\( 2(3)^2 - 5(3) + 4 \\).",
      "Evaluate the exponent: \\( 3^2 = 9 \\).",
      "Multiply: \\( 2(9) - 15 + 4 = 18 - 15 + 4 \\).",
      "Add and subtract from left to right: \\( 3 + 4 = 7 \\)."
    ]
  },
  {
    question: "Evaluate: \\( 3a + 2b^2 \\) when \\( a = -2 \\) and \\( b = 3 \\)",
    image: null,
    options: ["\\( -12 \\)", "\\( 0 \\)", "\\( 12 \\)", "\\( 24 \\)"],
    correctIndex: 2,
    hint: "Substitute the given values into the expression, remember that \\( 3^2 = 9 \\).",
    explanation: [
      "Substitute \\( a = -2 \\) and \\( b = 3 \\): \\( 3(-2) + 2(3)^2 \\).",
      "Evaluate exponent: \\( 3^2 = 9 \\).",
      "Multiply: \\( -6 + 2(9) = -6 + 18 \\).",
      "Add: \\( -6 + 18 = 12 \\)."
    ]
  },
  {
    question: "Solve for \\( x \\): \\( 5x - 7 = 18 \\)",
    image: null,
    options: ["\\( 3 \\)", "\\( 4 \\)", "\\( 5 \\)", "\\( 6 \\)"],
    correctIndex: 2,
    hint: "Isolate x by first adding 7 to both sides, then dividing by 5.",
    explanation: [
      "Add 7 to both sides of the equation: \\( 5x = 18 + 7 \\).",
      "Simplify: \\( 5x = 25 \\).",
      "Divide by 5: \\( x = 5 \\)."
    ]
  },

  // WORD PROBLEMS
  {
    question: "The perimeter of a swimming pool is 64 m. If the ratio of the length to width is 5:3, what is the area of the pool?",
    image: null,
    options: ["\\( 240 \\text{ m}^2 \\)", "\\( 256 \\text{ m}^2 \\)", "\\( 320 \\text{ m}^2 \\)", "\\( 384 \\text{ m}^2 \\)"],
    correctIndex: 0,
    hint: "Let length = 5x and width = 3x. Use the perimeter formula to find x, then calculate the area.",
    explanation: [
      "Let length = \\( 5x \\) and width = \\( 3x \\).",
      "Perimeter = \\( 2(L + W) \\implies 2(5x + 3x) = 64 \\).",
      "\\( 2(8x) = 64 \\implies 16x = 64 \\implies x = 4 \\).",
      "Length = \\( 5(4) = 20 \\text{ m} \\), Width = \\( 3(4) = 12 \\text{ m} \\).",
      "Area = Length \\(\\times\\) Width = \\( 20 \\times 12 = 240 \\text{ m}^2 \\)."
    ]
  },
  {
    question: "The ages of two brothers are in the ratio 7:4. If the difference in their ages is 36 years, what is the sum of their ages?",
    image: null,
    options: ["\\( 108 \\)", "\\( 120 \\)", "\\( 132 \\)", "\\( 144 \\)"],
    correctIndex: 2,
    hint: "Set their ages as 7x and 4x. Use their difference to solve for x.",
    explanation: [
      "Let the ages be \\( 7x \\) and \\( 4x \\).",
      "Difference: \\( 7x - 4x = 36 \\implies 3x = 36 \\implies x = 12 \\).",
      "The ages are \\( 7(12) = 84 \\) and \\( 4(12) = 48 \\).",
      "Sum of their ages = \\( 84 + 48 = 132 \\). (Or sum = \\( 11x = 11 \\times 12 = 132 \\))."
    ]
  },
  {
    question: "The average of 7 numbers is 8. If the average of 6 of those numbers is 9, what is the 7th number?",
    image: null,
    options: ["\\( 2 \\)", "\\( 3 \\)", "\\( 4 \\)", "\\( 5 \\)"],
    correctIndex: 0,
    hint: "Find the total sum of the 7 numbers, and the total sum of the 6 numbers. The difference is the 7th number.",
    explanation: [
      "Total sum of the 7 numbers = \\( 7 \\times 8 = 56 \\).",
      "Total sum of the 6 numbers = \\( 6 \\times 9 = 54 \\).",
      "The 7th number is the difference between these sums: \\( 56 - 54 = 2 \\)."
    ]
  },

  // SEQUENCE
  {
    question: "Complete the sequence: \\( 6, 7, 14, 17, 68, \\dots \\)",
    image: null,
    options: ["\\( 71 \\)", "\\( 72 \\)", "\\( 73 \\)", "\\( 74 \\)"],
    correctIndex: 2,
    hint: "Look closely at alternating patterns involving addition and multiplication in increasing order.",
    explanation: [
      "Pattern: \\( +1 \\), \\( \\times 2 \\), \\( +3 \\), \\( \\times 4 \\).",
      "\\( 6 + 1 = 7 \\)",
      "\\( 7 \\times 2 = 14 \\)",
      "\\( 14 + 3 = 17 \\)",
      "\\( 17 \\times 4 = 68 \\)",
      "The next step should be adding 5: \\( 68 + 5 = 73 \\)."
    ]
  },
  {
    question: "What is the 74th number in the arithmetic sequence \\( 5, 7, 9, 11, \\dots \\)?",
    image: null,
    options: ["\\( 149 \\)", "\\( 151 \\)", "\\( 153 \\)", "\\( 155 \\)"],
    correctIndex: 1,
    hint: "Use the arithmetic sequence formula: \\( T_n = a + (n - 1)d \\).",
    explanation: [
      "First term (a) = 5. Common difference (d) = 2.",
      "Formula: \\( T_n = a + (n - 1)d \\)",
      "\\( T_{74} = 5 + (74 - 1)2 \\)",
      "\\( T_{74} = 5 + (73 \\times 2) \\)",
      "\\( T_{74} = 5 + 146 = 151 \\)."
    ]
  },
  {
    question: "Discover the algebraic pattern (nth term) for the sequence: \\( 4, 13, 22, 31, \\dots \\)",
    image: null,
    options: ["\\( 9n - 5 \\)", "\\( 4n + 9 \\)", "\\( 9n + 5 \\)", "\\( 5n - 1 \\)"],
    correctIndex: 0,
    hint: "Find the common difference. The formula is \\( dn + (a - d) \\).",
    explanation: [
      "First term (a) = 4. Common difference (d) = \\( 13 - 4 = 9 \\).",
      "Using the nth term formula: \\( T_n = a + (n - 1)d \\).",
      "\\( T_n = 4 + (n - 1)9 \\)",
      "Expand: \\( 4 + 9n - 9 \\)",
      "Simplify: \\( 9n - 5 \\)."
    ]
  },
  {
    question: "What is the sum of the first 300 positive integers?",
    image: null,
    options: ["\\( 45,000 \\)", "\\( 45,150 \\)", "\\( 45,300 \\)", "\\( 46,150 \\)"],
    correctIndex: 1,
    hint: "Use the sum formula for natural numbers: \\( S = \\frac{n(n + 1)}{2} \\).",
    explanation: [
      "The formula is \\( \\frac{n(n + 1)}{2} \\), where \\( n = 300 \\).",
      "\\( S = \\frac{300 \\times 301}{2} \\).",
      "\\( S = 150 \\times 301 \\).",
      "\\( 150 \\times 301 = 45150 \\)."
    ]
  }
];

setupQuiz(quizData, 3600)