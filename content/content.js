/**
 * GitHub PR AutoComplete Content Script
 * Main script that handles UI interactions and displays suggestions
 */
class AutoCompleteUI {
    constructor() {
        this.engine = new AutoCompleteEngine();
        this.suggestionBox = null;
        this.currentInput = null;
        this.selectedIndex = -1;
        this.isVisible = false;
        
        // Debounce settings
        this.debounceTimer = null;
        this.debounceDelay = 300;
        
        // Keyboard navigation
        this.keys = {
            ARROW_UP: 38,
            ARROW_DOWN: 40,
            ENTER: 13,
            ESCAPE: 27,
            TAB: 9
        };
    }

    /**
     * Initialize the auto-complete UI
     */
    async init() {
        console.log('GitHub PR AutoComplete: Starting UI initialization...');
        
        try {
            // Initialize the engine
            await this.engine.initialize();
            
            // Create the suggestion box
            this.createSuggestionBox();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('GitHub PR AutoComplete: UI initialized successfully');
            
            // Log stats for debugging
            console.log('Stats:', this.engine.getStats());
            
        } catch (error) {
            console.error('GitHub PR AutoComplete: UI initialization failed', error);
        }
    }

    /**
     * Create the suggestion dropdown box
     */
    createSuggestionBox() {
        this.suggestionBox = document.createElement('div');
        this.suggestionBox.className = 'github-pr-autocomplete-suggestions';
        this.suggestionBox.style.display = 'none';
        
        // Add to body so it can float above other elements
        document.body.appendChild(this.suggestionBox);
    }

    /**
     * Set up event listeners for input fields
     */
    setupEventListeners() {
        // Use event delegation to handle dynamically created textareas
        document.addEventListener('input', (e) => {
            if (this.engine.shouldActivateFor(e.target)) {
                this.handleInput(e);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.engine.shouldActivateFor(e.target)) {
                this.handleKeyDown(e);
            }
        });

        document.addEventListener('focus', (e) => {
            if (this.engine.shouldActivateFor(e.target)) {
                this.currentInput = e.target;
            }
        }, true);

        document.addEventListener('blur', (e) => {
            if (this.engine.shouldActivateFor(e.target)) {
                // Hide suggestions with a small delay to allow for clicks
                setTimeout(() => this.hideSuggestions(), 150);
            }
        }, true);

        // Hide suggestions when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!this.suggestionBox.contains(e.target) && 
                !this.engine.shouldActivateFor(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    /**
     * Handle input events
     * @param {Event} e - Input event
     */
    handleInput(e) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            this.updateSuggestions(e.target);
        }, this.debounceDelay);
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        if (!this.isVisible) return;

        switch (e.keyCode) {
            case this.keys.ARROW_UP:
                e.preventDefault();
                this.navigateUp();
                break;
                
            case this.keys.ARROW_DOWN:
                e.preventDefault();
                this.navigateDown();
                break;
                
            case this.keys.ENTER:
            case this.keys.TAB:
                if (this.selectedIndex >= 0) {
                    e.preventDefault();
                    this.applySuggestion();
                }
                break;
                
            case this.keys.ESCAPE:
                e.preventDefault();
                this.hideSuggestions();
                break;
        }
    }

    /**
     * Update suggestions based on current input
     * @param {Element} input - Input element
     */
    updateSuggestions(input) {
        if (!input || !this.engine.isInitialized) return;

        const value = input.value;
        const suggestions = this.engine.getSuggestions(value);

        if (suggestions.length > 0) {
            this.showSuggestions(suggestions, input);
        } else {
            this.hideSuggestions();
        }
    }

    /**
     * Show suggestions dropdown
     * @param {string[]} suggestions - Array of suggestions
     * @param {Element} input - Input element
     */
    showSuggestions(suggestions, input) {
        this.currentInput = input;
        this.selectedIndex = -1;
        
        // Clear existing content
        this.suggestionBox.innerHTML = '';
        
        // Create suggestion items
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'github-pr-autocomplete-item';
            item.textContent = suggestion;
            item.dataset.index = index;
            
            // Add click handler
            item.addEventListener('click', () => {
                this.selectedIndex = index;
                this.applySuggestion();
            });
            
            this.suggestionBox.appendChild(item);
        });
        
        // Position the suggestion box
        this.positionSuggestionBox(input);
        
        // Show the box
        this.suggestionBox.style.display = 'block';
        this.isVisible = true;
    }

    /**
     * Hide suggestions dropdown
     */
    hideSuggestions() {
        if (this.suggestionBox) {
            this.suggestionBox.style.display = 'none';
            this.isVisible = false;
            this.selectedIndex = -1;
            this.currentInput = null;
        }
    }

    /**
     * Position the suggestion box relative to the input
     * @param {Element} input - Input element
     */
    positionSuggestionBox(input) {
        const rect = input.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        this.suggestionBox.style.position = 'absolute';
        this.suggestionBox.style.left = (rect.left + scrollLeft) + 'px';
        this.suggestionBox.style.top = (rect.bottom + scrollTop + 2) + 'px';
        this.suggestionBox.style.minWidth = rect.width + 'px';
        this.suggestionBox.style.zIndex = '10000';
    }

    /**
     * Navigate up in suggestions
     */
    navigateUp() {
        const items = this.suggestionBox.querySelectorAll('.github-pr-autocomplete-item');
        
        if (this.selectedIndex > 0) {
            items[this.selectedIndex].classList.remove('selected');
            this.selectedIndex--;
        } else {
            this.selectedIndex = items.length - 1;
            if (items.length > 0) {
                items[0].classList.remove('selected');
            }
        }
        
        if (this.selectedIndex >= 0) {
            items[this.selectedIndex].classList.add('selected');
        }
    }

    /**
     * Navigate down in suggestions
     */
    navigateDown() {
        const items = this.suggestionBox.querySelectorAll('.github-pr-autocomplete-item');
        
        if (this.selectedIndex < items.length - 1) {
            if (this.selectedIndex >= 0) {
                items[this.selectedIndex].classList.remove('selected');
            }
            this.selectedIndex++;
        } else {
            if (this.selectedIndex >= 0) {
                items[this.selectedIndex].classList.remove('selected');
            }
            this.selectedIndex = 0;
        }
        
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].classList.add('selected');
        }
    }

    /**
     * Apply the selected suggestion
     */
    applySuggestion() {
        if (!this.currentInput || this.selectedIndex < 0) return;

        const items = this.suggestionBox.querySelectorAll('.github-pr-autocomplete-item');
        const selectedItem = items[this.selectedIndex];
        
        if (!selectedItem) return;

        const suggestion = selectedItem.textContent;
        const currentValue = this.currentInput.value;
        
        // Replace the current word with the suggestion
        const currentWord = this.engine.getCurrentWord(currentValue);
        const lastWordIndex = currentValue.lastIndexOf(currentWord);
        
        if (lastWordIndex >= 0) {
            const newValue = currentValue.substring(0, lastWordIndex) + suggestion + 
                           currentValue.substring(lastWordIndex + currentWord.length);
            
            this.currentInput.value = newValue;
            
            // Set cursor position after the inserted word
            const cursorPos = lastWordIndex + suggestion.length;
            this.currentInput.setSelectionRange(cursorPos, cursorPos);
            
            // Trigger input event to notify other listeners
            this.currentInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        this.hideSuggestions();
    }

    /**
     * Get current statistics (for debugging)
     */
    getStats() {
        return {
            ...this.engine.getStats(),
            isUIVisible: this.isVisible,
            currentInputActive: !!this.currentInput,
            selectedIndex: this.selectedIndex
        };
    }
}

// Initialize the auto-complete UI when the page loads
let autoCompleteUI;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAutoComplete);
} else {
    initializeAutoComplete();
}

function initializeAutoComplete() {
    // Additional wait for GitHub's dynamic content
    setTimeout(() => {
        autoCompleteUI = new AutoCompleteUI();
        autoCompleteUI.init();
        
        // Make it globally accessible for debugging
        window.githubPRAutoComplete = autoCompleteUI;
    }, 1500);
}

// Handle page navigation (GitHub uses PJAX)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        
        // Reinitialize if we're still on a PR page
        if (url.includes('/pull/')) {
            setTimeout(() => {
                if (autoCompleteUI) {
                    autoCompleteUI.engine.reset();
                    autoCompleteUI.init();
                }
            }, 2000);
        }
    }
}).observe(document, { subtree: true, childList: true });