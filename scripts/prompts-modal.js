// Prompts modal functionality
const PromptsModal = {
    modal: null,
    promptsList: null,
    prompts: [],

    init() {
        this.modal = document.getElementById('prompts-modal');
        this.promptsList = document.getElementById('prompts-list');
        
        // Ensure modal starts closed
        this.modal.classList.add('hidden');
        
        // Set up event listeners
        const promptsBtn = document.getElementById('prompts-btn');
        const closeBtn = document.getElementById('close-modal');
        
        if (promptsBtn) {
            promptsBtn.addEventListener('click', () => this.open());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.close();
            }
        });
        
        // Load prompts data
        this.loadPrompts();
        
        // Expose globally for access from other scripts
        window.PromptsModal = this;
    },

    async loadPrompts() {
        try {
            const response = await fetch('PROMPTS.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.prompts = data.prompts;
        } catch (error) {
            console.error('Error loading prompts:', error);
            this.prompts = [{
                id: 'error',
                prompt: 'Failed to load prompts data',
                results: ['Could not fetch PROMPTS.json', 'Check if file exists', 'Check console for errors']
            }];
        }
    },

    open() {
        this.render();
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Reset scroll position to top when opening normally
        setTimeout(() => {
            if (this.promptsList) {
                this.promptsList.scrollTop = 0;
            }
        }, 50);
    },

    openAndScrollTo(promptId) {
        console.log('🎯 Opening prompts modal and scrolling to prompt:', promptId);
        this.render();
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Wait for render to complete, then scroll to prompt
        if (promptId) {
            // Reset scroll position first to ensure consistent behavior
            setTimeout(() => {
                if (this.promptsList) {
                    this.promptsList.scrollTop = 0;
                }
                // Then scroll to the target prompt
                setTimeout(() => {
                    this.scrollToPrompt(promptId);
                }, 50);
            }, 50);
        }
    },

    scrollToPrompt(promptId) {
        const promptElement = document.querySelector(`[data-prompt-id="${promptId}"]`);
        if (promptElement && this.promptsList) {
            console.log('📍 Scrolling to prompt element:', promptId);
            
            // Get the element's position relative to the container
            const elementOffsetTop = promptElement.offsetTop;
            const containerHeight = this.promptsList.clientHeight;
            const elementHeight = promptElement.offsetHeight;
            
            // Calculate scroll position to center the element in view
            const scrollTop = Math.max(0, elementOffsetTop - (containerHeight / 2) + (elementHeight / 2));
            
            console.log('📊 Scroll calculation:', {
                elementOffsetTop,
                containerHeight,
                elementHeight,
                calculatedScrollTop: scrollTop
            });
            
            // Scroll to the calculated position
            this.promptsList.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
            
            // Highlight the prompt briefly
            promptElement.style.background = 'rgba(102, 126, 234, 0.2)';
            promptElement.style.transition = 'background 0.3s ease';
            setTimeout(() => {
                promptElement.style.background = '';
                setTimeout(() => {
                    promptElement.style.transition = '';
                }, 300);
            }, 2000);
        } else {
            console.log('❌ Prompt element not found:', promptId);
        }
    },

    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore background scrolling
    },

    render() {
        if (!this.prompts.length) {
            this.promptsList.innerHTML = '<div class="modal-prompt-item">Loading prompts...</div>';
            return;
        }

        const promptsHTML = this.prompts.map(prompt => `
            <div class="modal-prompt-item" data-prompt-id="${prompt.id}">
                <div class="prompt-header">
                    <span class="prompt-id">#${prompt.id}</span>
                </div>
                <div class="prompt-text">"${prompt.prompt}"</div>
                <div class="prompt-results">
                    <h4>Results</h4>
                    <ul>
                        ${prompt.results.map(result => `<li>${result}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        this.promptsList.innerHTML = promptsHTML;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    PromptsModal.init();
});
