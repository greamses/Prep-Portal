import { initUI } from '/blogs/js/ui-controller.js';

const params = new URLSearchParams(window.location.search);
const subject = params.get('subject') || 'animals';

const dataMap = {
  plants: '/blogs/science/biology/plants/auto/data.js',
  animals: '/blogs/science/biology/animal/auto/data.js',
  'animal-copy': '/blogs/science/biology/animal copy/auto/data.js',
};

const subjectData = await import(dataMap[subject] ?? dataMap.animals);

const loaderLabel = document.getElementById('loader-label');
if (loaderLabel) loaderLabel.textContent = subjectData.SUBJECT_CONFIG.name;

initUI(subjectData.SUBJECT_CONFIG, subjectData);
