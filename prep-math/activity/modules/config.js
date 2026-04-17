// config.js - Application configuration and constants
export const MODES = {
  fractions: {
    label: 'Fraction',
    placeholder: 'e.g. 3/4',
    hint: 'Type as numerator/denominator — e.g. 3/4',
    modalQ: 'What fraction does the shape show?',
    unit: '',
  },
  percents: {
    label: 'Percent',
    placeholder: 'e.g. 75%',
    hint: 'Type the percentage — e.g. 75 or 75%',
    modalQ: 'What percentage does the shape show?',
    unit: '%',
  },
  degrees: {
    label: 'Degrees',
    placeholder: 'e.g. 270°',
    hint: 'Type the angle in degrees — e.g. 270 or 270°',
    modalQ: 'How many degrees does the shaded sector represent?',
    unit: '°',
  },
  decimals: {
    label: 'Decimal',
    placeholder: 'e.g. 0.75',
    hint: 'Type as a decimal — e.g. 0.75',
    modalQ: 'What decimal does the shape show?',
    unit: '',
  },
  time: {
    label: 'Time',
    placeholder: 'e.g. 45',
    hint: 'Type minutes (e.g. 45)',
    modalQ: 'How many minutes does the shaded part represent?',
    unit: 'min',
  },
  'random-total': {
    label: 'Random Total',
    placeholder: 'e.g. 15',
    hint: 'Type the number of shaded parts',
    modalQ: 'How many parts are shaded?',
    unit: '',
  },
  'different-parts': {
    label: 'Different Parts',
    placeholder: 'e.g. 3/4',
    hint: 'Type the combined fraction',
    modalQ: 'What is the combined fraction of all shaded parts?',
    unit: '',
  },
  compare: {
    label: 'Compare',
    placeholder: '<, >, or =',
    hint: 'Type <, >, or =',
    modalQ: 'Which is greater? Left or right?',
    unit: '',
  },
  mixed: {
    label: 'Answer',
    placeholder: 'Type your answer',
    hint: 'Answer in the format shown',
    modalQ: 'What value does the shape show?',
    unit: '',
  },
  add: {
    label: 'Sum',
    placeholder: 'e.g. 5/6',
    hint: 'Slide to move sectors — watch them transfer!',
    modalQ: 'Slide: sectors move from left to right',
    unit: '',
  },
  subtract: {
    label: 'Difference',
    placeholder: 'e.g. 1/4',
    hint: 'Slide to remove sectors — watch them disappear!',
    modalQ: 'Slide: sectors are removed from right',
    unit: '',
  },
  multiply: {
    label: 'Product',
    placeholder: 'e.g. 3/8',
    hint: 'Multiply the fractions — e.g. 3/8',
    modalQ: 'What is the product of the shaded fractions?',
    unit: '',
  },
  divide: {
    label: 'Quotient',
    placeholder: 'e.g. 2/3',
    hint: 'Divide left by right — e.g. 2/3',
    modalQ: 'Left divided by right — what is the quotient?',
    unit: '',
  },
};

export const DISABLE_PARTS_MODES = ['random-total', 'different-parts', 'compare', 'mixed', 'add', 'subtract', 'multiply', 'divide'];
export const MIXED_DENOMINATORS = [2, 3, 4, 5, 6, 8, 10, 12];
export const ALL_MODES = ['fractions', 'percents', 'degrees', 'decimals', 'time', 'random-total', 'different-parts', 'compare', 'add', 'subtract', 'multiply', 'divide'];

export const MUTED_COLORS = [
  '#7b9cae', '#8fbc94', '#d9b48b', '#c9a0c9', '#8fcbcb',
  '#e3b58a', '#b7a9a9', '#94c9b4', '#c9ae8a', '#8faec9',
];

export const PASTEL_COLORS = [
  '#a8c9e5', '#b8e0b8', '#f5d6b3', '#e0b8e0', '#b8e0e0',
  '#f5c6b3', '#d4c4c4', '#b8e0cc', '#e0ccb8', '#b8cce0',
];

export const DIFFERENT_PARTS_COLORS = [
  '#8fb0c9', '#a8c9a3', '#e0b88a', '#d4a0d4', '#a0d4d4',
];