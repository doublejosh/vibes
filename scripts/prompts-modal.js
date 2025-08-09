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
    },

    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore background scrolling
    },

    render() {
        if (!this.prompts.length) {
            this.promptsList.innerHTML = '<div class="prompt-item">Loading prompts...</div>';
            return;
        }

        const promptsHTML = this.prompts.map(prompt => `
            <div class="prompt-item">
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
