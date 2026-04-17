// sliderController.js - Slider animation controller with sector movement
import { createFractionSVG } from './svgRenderer.js';
import { leastCommonMultiple } from './utils.js';

export class SliderController {
  constructor(wrapElement, settings, colorSet) {
    this.wrap = wrapElement;
    this.settings = settings;
    this.colorSet = colorSet;
    this.slider = null;
    this.sliderValue = 0;
    this.currentQ = null;
    this.mode = null;
    this.onValueChange = null;
    this.animationFrame = null;
  }
  
  initialize(q, mode) {
    this.currentQ = q;
    this.mode = mode;
    this.createSlider();
    this.updateVisualization(0);
  }
  
  createSlider() {
    const existingSlider = this.wrap.querySelector('.op-slider-container');
    if (existingSlider) existingSlider.remove();
    
    const container = document.createElement('div');
    container.className = 'op-slider-container';
    container.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 450px;
      background: white;
      padding: 16px 24px;
      border-radius: 40px;
      border: 2px solid var(--ink);
      box-shadow: var(--shadow-md);
      z-index: 50;
      display: flex;
      align-items: center;
      gap: 16px;
    `;
    
    const label = document.createElement('span');
    label.style.cssText = `
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      min-width: 70px;
    `;
    label.textContent = this.mode === 'add' ? 'Move →' : 'Remove ←';
    container.appendChild(label);
    
    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = '0';
    this.slider.max = '1';
    this.slider.step = '0.01';
    this.slider.value = '0';
    this.slider.style.cssText = `
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: var(--surface-3);
      -webkit-appearance: none;
      appearance: none;
      cursor: grab;
    `;
    
    this.slider.addEventListener('mousedown', () => {
      this.slider.style.cursor = 'grabbing';
    });
    
    this.slider.addEventListener('mouseup', () => {
      this.slider.style.cursor = 'grab';
    });
    
    this.valueDisplay = document.createElement('span');
    this.valueDisplay.style.cssText = `
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 700;
      color: var(--ink);
      min-width: 60px;
      text-align: right;
    `;
    this.valueDisplay.textContent = '0%';
    
    container.appendChild(this.slider);
    container.appendChild(this.valueDisplay);
    
    this.wrap.style.position = 'relative';
    this.wrap.appendChild(container);
    
    this.slider.addEventListener('input', (e) => {
      this.sliderValue = parseFloat(e.target.value);
      this.valueDisplay.textContent = Math.round(this.sliderValue * 100) + '%';
      
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      this.animationFrame = requestAnimationFrame(() => {
        this.updateVisualization(this.sliderValue);
        if (this.onValueChange) {
          this.onValueChange(this.sliderValue);
        }
      });
    });
  }
  
  updateVisualization(value) {
    const oldSvg = this.wrap.querySelector('svg');
    if (oldSvg) oldSvg.remove();
    
    const svg = createFractionSVG(
      this.settings.type,
      this.currentQ,
      this.mode,
      this.settings,
      this.colorSet,
      value
    );
    this.wrap.appendChild(svg);
  }
  
  getCurrentFraction() {
    if (!this.currentQ) return null;
    
    const lcm = leastCommonMultiple(this.currentQ.leftDenom, this.currentQ.rightDenom);
    const leftMultiplier = lcm / this.currentQ.leftDenom;
    const rightMultiplier = lcm / this.currentQ.rightDenom;
    
    const leftTotalParts = this.currentQ.leftActive * leftMultiplier;
    const rightTotalParts = this.currentQ.rightActive * rightMultiplier;
    
    let resultShaded;
    
    if (this.mode === 'add') {
      const transferred = Math.floor(this.sliderValue * rightTotalParts);
      resultShaded = this.currentQ.rightActive * rightMultiplier + transferred;
    } else {
      const removed = Math.floor(this.sliderValue * rightTotalParts);
      resultShaded = Math.max(0, this.currentQ.rightActive * rightMultiplier - removed);
    }
    
    return { numerator: resultShaded, denominator: lcm };
  }
  
  setValue(value) {
    if (this.slider) {
      this.slider.value = value;
      this.sliderValue = value;
      this.valueDisplay.textContent = Math.round(value * 100) + '%';
      this.updateVisualization(value);
    }
  }
  
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    const container = this.wrap.querySelector('.op-slider-container');
    if (container) container.remove();
    this.slider = null;
  }
}