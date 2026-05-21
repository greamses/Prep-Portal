import { dom } from './dom-elements.js';
import { TOPICS } from './constants.js';
import { state, updateState } from './state.js';
import { generateNewProblem } from './geogebra-controller.js';

export function populateDropdown() {
  const { dropdownList, selectedText, dropdownContainer, statTopic } = dom;
  if (!dropdownList) return;
  
  dropdownList.innerHTML = '';
  
  TOPICS.forEach(topic => {
    const div = document.createElement('div');
    div.className = 'gp-dropdown-item';
    div.textContent = topic;
    div.addEventListener('click', () => {
      const topicType = topic.split(' ')[0]; // Get "Linear", "Quadratics", etc.
      
      if (selectedText) selectedText.textContent = topic;
      if (statTopic) statTopic.textContent = topicType;
      
      // Store the current topic type in state
      updateState('currentTopic', topicType);
      
      dropdownContainer.classList.remove('open');
      
      // If modal is open, generate a new problem with the selected topic
      if (dom.modalOverlay?.classList.contains('active')) {
        generateNewProblem();
      }
    });
    dropdownList.appendChild(div);
  });
}

export function initDropdownEvents() {
  const { dropdownHeader, dropdownContainer } = dom;
  
  if (dropdownHeader) {
    dropdownHeader.addEventListener('click', e => {
      e.stopPropagation();
      if (dropdownContainer) dropdownContainer.classList.toggle('open');
    });
  }
  
  document.addEventListener('click', e => {
    if (dropdownContainer && !dropdownContainer.contains(e.target)) {
      dropdownContainer.classList.remove('open');
    }
  });
}

// Initialize the default topic
export function setDefaultTopic() {
  const { selectedText, statTopic } = dom;
  const defaultTopic = TOPICS[0]; // Linear Equations
  
  if (selectedText) selectedText.textContent = defaultTopic;
  if (statTopic) statTopic.textContent = defaultTopic.split(' ')[0];
  updateState('currentTopic', 'Linear');
}