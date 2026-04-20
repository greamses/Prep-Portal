import { PLAYER_COLORS } from '../config/constants.js';

export class ModalManager {
    constructor() {
        this.elements = {};
        this.callbacks = {};
    }
    
    initialize(elements) {
        this.elements = elements;
        this.setupDropdowns();
        this.setupTicker();
    }
    
    setupDropdowns() {
        // Initialize color dropdowns
        const p1Dropdown = document.getElementById('dd-p1-color');
        const p2Dropdown = document.getElementById('dd-p2-color');
        
        if (p1Dropdown) this.populateColorDropdown(p1Dropdown, '#0055ff');
        if (p2Dropdown) this.populateColorDropdown(p2Dropdown, '#ff2200');
        
        // Global click handler for dropdowns
        document.addEventListener('click', (e) => {
            const item = e.target.closest('.pp-dropdown-item');
            if (!item) return;
            
            const dd = item.closest('.pp-dropdown');
            if (!dd) return;
            
            const value = item.dataset.value;
            const headerSpan = dd.querySelector('.dd-selected');
            
            dd.querySelectorAll('.pp-dropdown-item').forEach(i => 
                i.classList.remove('selected'));
            item.classList.add('selected');
            
            this.handleDropdownSelection(dd.id, value, item, headerSpan);
            dd.classList.remove('open');
        }, true);
    }
    
    populateColorDropdown(dropdown, defaultValue) {
        const list = dropdown.querySelector('.pp-dropdown-list');
        list.innerHTML = '';
        
        PLAYER_COLORS.forEach(color => {
            const item = document.createElement('div');
            item.className = 'pp-dropdown-item' + 
                (color.value === defaultValue ? ' selected' : '');
            item.dataset.value = color.value;
            item.innerHTML = `
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 16px; height: 16px; 
                               border-radius: 50%; background: ${color.value}; 
                               border: 2px solid #1a1a1a;"></span>
                    ${color.name}
                </span>
            `;
            list.appendChild(item);
        });
        
        const selected = PLAYER_COLORS.find(c => c.value === defaultValue);
        dropdown.querySelector('.dd-selected').innerHTML = `
            <span style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 16px; height: 16px; 
                           border-radius: 50%; background: ${defaultValue}; 
                           border: 2px solid #1a1a1a;"></span>
                ${selected?.name || 'Blue'}
            </span>
        `;
    }
    
    handleDropdownSelection(id, value, item, headerSpan) {
        switch(id) {
            case 'dd-opponent':
                this.callbacks.onOpponentChange?.(value === 'cpu');
                headerSpan.textContent = item.textContent.trim();
                break;
            case 'dd-cpu-intel':
                this.callbacks.onIntelChange?.(value);
                headerSpan.textContent = item.textContent.trim();
                break;
            case 'dd-movement':
                this.callbacks.onMovementChange?.(value === 'auto');
                headerSpan.textContent = item.textContent.trim();
                break;
            case 'dd-p1-color':
            case 'dd-p2-color':
                const color = PLAYER_COLORS.find(c => c.value === value);
                if (color) {
                    headerSpan.innerHTML = `
                        <span style="display: flex; align-items: center; gap: 8px;">
                            <span style="display: inline-block; width: 16px; height: 16px; 
                                       border-radius: 50%; background: ${color.value}; 
                                       border: 2px solid #1a1a1a;"></span>
                            ${color.name}
                        </span>
                    `;
                    this.callbacks.onColorChange?.(id, value);
                }
                break;
            case 'dd-difficulty':
                headerSpan.textContent = item.textContent.trim();
                break;
        }
    }
    
    setupTicker() {
        const track = document.getElementById('ticker-track');
        if (track) {
            const words = ['Snakes', 'Ladders', 'Fractions', 'Prep Portal', 
                          'Drag Dice', 'Climb Up', 'Slide Down'];
            [...words, ...words].forEach(t => {
                const s = document.createElement('span');
                s.className = 'ticker-item';
                s.textContent = t;
                track.appendChild(s);
            });
        }
    }
    
    toggleDropdown(id) {
        const dd = document.getElementById(id);
        if (!dd) return;
        
        const isOpen = dd.classList.contains('open');
        document.querySelectorAll('.pp-dropdown.open').forEach(el => 
            el.classList.remove('open'));
        
        if (!isOpen) dd.classList.add('open');
    }
    
    showFractionPopup(questionHTML) {
        const popup = document.getElementById('fracPopup');
        const popupEq = document.getElementById('popupEq');
        if (popup && popupEq) {
            popupEq.innerHTML = questionHTML;
            popup.classList.add('show');
        }
    }
    
    hideFractionPopup() {
        document.getElementById('fracPopup')?.classList.remove('show');
    }
    
    showWinOverlay(winnerName, reason) {
        const overlay = document.getElementById('winOverlay');
        const nameEl = document.getElementById('winName');
        const subEl = document.getElementById('winSub');
        
        if (overlay && nameEl) {
            nameEl.textContent = `${winnerName} WINS!`;
            if (subEl) subEl.textContent = reason || "Reached square 64 first!";
            setTimeout(() => overlay.classList.add('show'), 800);
        }
    }
    
    updateHUD(playerName, color) {
        const turnHud = document.getElementById('turnHud');
        const modalTurn = document.getElementById('modal-turn');
        
        if (turnHud) {
            turnHud.textContent = `${playerName}'S TURN`;
            turnHud.style.background = color;
        }
        if (modalTurn) {
            modalTurn.textContent = `${playerName}'s Turn`;
        }
    }
    
    addLogMessage(msg, type = 'info') {
        const logOverlay = document.getElementById('logOverlay');
        if (!logOverlay) return;
        
        if (!logOverlay.classList.contains('active')) {
            logOverlay.classList.add('active');
        }
        
        const el = document.createElement('div');
        el.className = `snakes-log-entry ${type}`;
        el.textContent = msg;
        logOverlay.appendChild(el);
        logOverlay.scrollTop = logOverlay.scrollHeight;
    }
    
    clearLog() {
        const logOverlay = document.getElementById('logOverlay');
        if (logOverlay) {
            logOverlay.innerHTML = '';
            logOverlay.classList.remove('active');
        }
    }
}