// main.js - Life Sciences entry point
import * as lifeScienceData from './data.js';
import { initUI } from '../../../../js/ui-controller.js';

// Initialize the UI with Life Sciences data
initUI(lifeScienceData.SUBJECT_CONFIG, lifeScienceData);
