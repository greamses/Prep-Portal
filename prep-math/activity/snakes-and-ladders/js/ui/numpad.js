export class NumpadManager {
    constructor(options = {}) {
        this.onInput = options.onInput || (() => {});
        this.onSubmit = options.onSubmit || (() => {});
        this.onClear = options.onClear || (() => {});
        
        this.numpad = null;
        this.dragState = { 
            isDragging: false, 
            startX: 0, 
            startY: 0 
        };
        this.isVisible = false;
        this.isInitialized = false;
    }
    
    /**
     * Create and inject the numpad into the DOM
     */
    initialize() {
        if (this.isInitialized) return;
        
        // Check if numpad already exists
        let existingNumpad = document.getElementById('snakes-numpad');
        
        if (!existingNumpad) {
            existingNumpad = this.createNumpadElement();
            document.body.appendChild(existingNumpad);
        }
        
        this.numpad = existingNumpad;
        this.setupEventListeners();
        this.setupDragFunctionality();
        
        this.isInitialized = true;
    }
    
    /**
     * Create the numpad HTML structure
     */
    createNumpadElement() {
        const numpad = document.createElement('div');
        numpad.id = 'snakes-numpad';
        numpad.className = 'snakes-numpad';
        numpad.innerHTML = `
            <div class="np-header">
                <span class="np-drag-icon">⋮⋮</span>
                <span>NUMPAD</span>
                <span class="np-close" style="cursor: pointer; opacity: 0.7;">✕</span>
            </div>
            <div class="np-grid">
                <button data-key="1">1</button>
                <button data-key="2">2</button>
                <button data-key="3">3</button>
                <button data-key="4">4</button>
                <button data-key="5">5</button>
                <button data-key="6">6</button>
                <button data-key="7">7</button>
                <button data-key="8">8</button>
                <button data-key="9">9</button>
                <button data-key="C" class="np-util">C</button>
                <button data-key="0">0</button>
                <button data-key="OK" class="np-ok">OK</button>
            </div>
            <div class="np-footer">
                <span class="np-hint">← Backspace to delete</span>
            </div>
        `;
        
        return numpad;
    }
    
    /**
     * Set up event listeners for numpad buttons
     */
    setupEventListeners() {
        // Button clicks
        this.numpad.addEventListener('pointerdown', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const key = button.dataset.key;
            this.handleKeyPress(key);
            
            // Add visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
        
        // Close button
        const closeBtn = this.numpad.querySelector('.np-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hide();
            });
        }
        
        // Prevent accidental drag when clicking buttons
        this.numpad.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
    
    /**
     * Handle key press from numpad
     */
    handleKeyPress(key) {
        switch (key) {
            case 'C':
                this.onClear();
                break;
            case 'OK':
                this.onSubmit();
                break;
            default:
                this.onInput(key);
                break;
        }
    }
    
    /**
     * Set up drag functionality for the numpad header
     */
    setupDragFunctionality() {
        const header = this.numpad.querySelector('.np-header');
        if (!header) return;
        
        // Make header indicate draggable
        header.style.cursor = 'grab';
        
        const onPointerDown = (e) => {
            // Don't start drag if clicking close button
            if (e.target.classList.contains('np-close')) return;
            
            this.dragState.isDragging = true;
            header.style.cursor = 'grabbing';
            
            const rect = this.numpad.getBoundingClientRect();
            this.dragState.startX = e.clientX - rect.left;
            this.dragState.startY = e.clientY - rect.top;
            
            // Set initial position if not already positioned
            if (!this.numpad.style.left) {
                this.numpad.style.left = rect.left + 'px';
                this.numpad.style.top = rect.top + 'px';
            }
            
            this.numpad.style.right = 'auto';
            this.numpad.style.bottom = 'auto';
            
            e.preventDefault();
        };
        
        const onPointerMove = (e) => {
            if (!this.dragState.isDragging) return;
            
            const x = e.clientX - this.dragState.startX;
            const y = e.clientY - this.dragState.startY;
            
            // Constrain to viewport
            const maxX = window.innerWidth - this.numpad.offsetWidth;
            const maxY = window.innerHeight - this.numpad.offsetHeight;
            
            this.numpad.style.left = Math.max(0, Math.min(maxX, x)) + 'px';
            this.numpad.style.top = Math.max(0, Math.min(maxY, y)) + 'px';
            
            e.preventDefault();
        };
        
        const onPointerUp = () => {
            if (this.dragState.isDragging) {
                this.dragState.isDragging = false;
                header.style.cursor = 'grab';
            }
        };
        
        header.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        
        // Store cleanup function
        this.cleanupDrag = () => {
            header.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }
    
    /**
     * Show the numpad
     */
    show(position = null) {
        if (!this.isInitialized) {
            this.initialize();
        }
        
        this.numpad.classList.add('show');
        this.isVisible = true;
        
        // Set default position if not already positioned
        if (position) {
            this.setPosition(position.x, position.y);
        } else if (!this.numpad.style.left) {
            // Default position: bottom right with some offset
            this.setPosition(
                window.innerWidth - this.numpad.offsetWidth - 20,
                window.innerHeight - this.numpad.offsetHeight - 20
            );
        }
        
        // Animate in
        this.numpad.style.animation = 'numpadSlideIn 0.3s ease-out';
    }
    
    /**
     * Hide the numpad
     */
    hide() {
        if (!this.numpad) return;
        
        this.numpad.style.animation = 'numpadSlideOut 0.2s ease-in';
        
        setTimeout(() => {
            this.numpad.classList.remove('show');
            this.isVisible = false;
            this.numpad.style.animation = '';
        }, 200);
    }
    
    /**
     * Toggle numpad visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Set numpad position
     */
    setPosition(x, y) {
        if (!this.numpad) return;
        
        const maxX = window.innerWidth - this.numpad.offsetWidth;
        const maxY = window.innerHeight - this.numpad.offsetHeight;
        
        this.numpad.style.left = Math.max(0, Math.min(maxX, x)) + 'px';
        this.numpad.style.top = Math.max(0, Math.min(maxY, y)) + 'px';
        this.numpad.style.right = 'auto';
        this.numpad.style.bottom = 'auto';
    }
    
    /**
     * Reset numpad to default position
     */
    resetPosition() {
        if (!this.numpad) return;
        
        this.numpad.style.left = '';
        this.numpad.style.top = '';
        this.numpad.style.right = '20px';
        this.numpad.style.bottom = '20px';
    }
    
    /**
     * Set callbacks dynamically
     */
    setCallbacks({ onInput, onSubmit, onClear }) {
        if (onInput) this.onInput = onInput;
        if (onSubmit) this.onSubmit = onSubmit;
        if (onClear) this.onClear = onClear;
    }
    
    /**
     * Programmatically trigger a key press
     */
    pressKey(key) {
        this.handleKeyPress(key);
        
        // Visual feedback
        const button = this.numpad?.querySelector(`[data-key="${key}"]`);
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        }
    }
    
    /**
     * Enable or disable specific buttons
     */
    setButtonState(key, enabled) {
        const button = this.numpad?.querySelector(`[data-key="${key}"]`);
        if (button) {
            button.disabled = !enabled;
            button.style.opacity = enabled ? '1' : '0.5';
        }
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        if (this.cleanupDrag) {
            this.cleanupDrag();
        }
        
        if (this.numpad && this.numpad.parentNode) {
            this.numpad.parentNode.removeChild(this.numpad);
        }
        
        this.isInitialized = false;
        this.numpad = null;
    }
}

// Add required CSS animations if not already present
const style = document.createElement('style');
style.textContent = `
    @keyframes numpadSlideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes numpadSlideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    .snakes-numpad {
        position: fixed;
        z-index: 10000;
        background: rgba(30, 30, 40, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
        display: none;
        user-select: none;
        -webkit-user-select: none;
        min-width: 200px;
    }
    
    .snakes-numpad.show {
        display: block;
    }
    
    .np-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 4px 16px 4px;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'Unbounded', sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: grab;
        user-select: none;
    }
    
    .np-header:active {
        cursor: grabbing;
    }
    
    .np-drag-icon {
        font-size: 16px;
        opacity: 0.6;
    }
    
    .np-close {
        transition: opacity 0.2s;
    }
    
    .np-close:hover {
        opacity: 1 !important;
    }
    
    .np-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
    
    .np-grid button {
        width: 60px;
        height: 60px;
        border-radius: 16px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-family: 'Unbounded', sans-serif;
        font-size: 24px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
        box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .np-grid button:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
        box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
    }
    
    .np-grid button:active {
        transform: translateY(2px);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
    }
    
    .np-grid button.np-util {
        background: rgba(255, 100, 100, 0.2);
        color: #ff6b6b;
        font-size: 18px;
    }
    
    .np-grid button.np-util:hover {
        background: rgba(255, 100, 100, 0.3);
    }
    
    .np-grid button.np-ok {
        background: linear-gradient(135deg, #00a550, #008040);
        color: white;
        grid-column: span 1;
    }
    
    .np-grid button.np-ok:hover {
        background: linear-gradient(135deg, #00b860, #009050);
    }
    
    .np-grid button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2) !important;
    }
    
    .np-footer {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
    }
    
    .np-hint {
        color: rgba(255, 255, 255, 0.5);
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
    }
    
    /* Mobile optimization */
    @media (max-width: 768px) {
        .snakes-numpad {
            padding: 12px;
            min-width: 180px;
        }
        
        .np-grid button {
            width: 50px;
            height: 50px;
            font-size: 20px;
            border-radius: 12px;
        }
    }
`;

// Add styles if not already present
if (!document.querySelector('#numpad-styles')) {
    style.id = 'numpad-styles';
    document.head.appendChild(style);
}

// Export a singleton instance for convenience
export const numpadManager = new NumpadManager();