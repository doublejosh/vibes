// Documentation Modal Manager
const DocsModal = {
    init: function() {
        console.log('🔖 DocsModal: Initializing documentation modals...');
        this.bindEvents();
        console.log('✅ DocsModal: Documentation modals ready');
    },

    bindEvents: function() {
        // README button
        const readmeBtn = document.getElementById('readme-btn');
        if (readmeBtn) {
            readmeBtn.addEventListener('click', () => {
                console.log('📖 README button clicked');
                this.showReadmeModal();
            });
        }

        // POINTS button  
        const pointsBtn = document.getElementById('points-btn');
        if (pointsBtn) {
            pointsBtn.addEventListener('click', () => {
                console.log('📝 POINTS button clicked');
                this.showPointsModal();
            });
        }

        // Close buttons for new modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn') && e.target.dataset.modal) {
                console.log(`🔴 Closing modal: ${e.target.dataset.modal}`);
                this.hideModal(e.target.dataset.modal);
            }
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                console.log('🔴 Clicked outside modal, closing...');
                this.hideModal(e.target.id);
            }
        });
    },

    showReadmeModal: function() {
        console.log('📖 Loading README content...');
        const modal = document.getElementById('readme-modal');
        const content = document.getElementById('readme-content');
        
        if (!modal || !content) {
            console.error('❌ README modal elements not found');
            return;
        }

        // Show loading state
        content.innerHTML = '<p>Loading README...</p>';
        modal.classList.remove('hidden');

        // Fetch README content
        fetch('README.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(markdownText => {
                console.log('✅ README loaded successfully');
                content.innerHTML = this.convertMarkdownToHTML(markdownText);
            })
            .catch(error => {
                console.error('❌ Error loading README:', error);
                content.innerHTML = `
                    <p style="color: #e74c3c;">Error loading README.md</p>
                    <p style="color: #7f8c8d; font-size: 12px;">Check the console for details.</p>
                `;
            });
    },

    showPointsModal: function() {
        console.log('📝 Loading POINTS content...');
        const modal = document.getElementById('points-modal');
        const content = document.getElementById('points-content');
        
        if (!modal || !content) {
            console.error('❌ POINTS modal elements not found');
            return;
        }

        // Show loading state
        content.innerHTML = '<p>Loading POINTS...</p>';
        modal.classList.remove('hidden');

        // Fetch POINTS content
        fetch('POINTS.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(markdownText => {
                console.log('✅ POINTS loaded successfully');
                content.innerHTML = this.convertMarkdownToHTML(markdownText);
            })
            .catch(error => {
                console.error('❌ Error loading POINTS:', error);
                content.innerHTML = `
                    <p style="color: #e74c3c;">Error loading POINTS.md</p>
                    <p style="color: #7f8c8d; font-size: 12px;">Check the console for details.</p>
                `;
            });
    },

    hideModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            console.log(`🔴 Modal hidden: ${modalId}`);
        }
    },

    hideAllModals: function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                console.log(`🔴 Modal hidden via ESC: ${modal.id}`);
            }
        });
    },

    convertMarkdownToHTML: function(markdown) {
        // Simple markdown converter for basic elements
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold and italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Convert numbered lists with parentheses (1), 2), etc.) and regular bullet lists to list items
        html = html.replace(/^\d+\)\s+(.*$)/gim, '<li class="main-point">$1</li>');
        html = html.replace(/^\d+\.\s+(.*$)/gim, '<li class="main-point">$1</li>');
        html = html.replace(/^-\s+(.*$)/gim, '<li class="sub-point">$1</li>');
        
        // Group consecutive list items into proper ul tags
        // First handle main points
        html = html.replace(/(<li class="main-point">.*?<\/li>)(\s*<li class="sub-point">.*?<\/li>)*\s*/gs, function(match) {
            // Split into main point and sub points
            const mainPointMatch = match.match(/<li class="main-point">(.*?)<\/li>/);
            const subPointsMatches = match.match(/<li class="sub-point">(.*?)<\/li>/g) || [];
            
            if (subPointsMatches.length > 0) {
                // Main point with sub points
                const mainPoint = mainPointMatch ? mainPointMatch[1] : '';
                const subPoints = subPointsMatches.map(sub => 
                    sub.replace(/<li class="sub-point">(.*?)<\/li>/, '<li>$1</li>')
                ).join('');
                
                return `<li class="main-point">${mainPoint}<ul>${subPoints}</ul></li>`;
            } else {
                // Just main point
                return match.replace(/class="main-point"/, '');
            }
        });
        
        // Wrap remaining main points in ul
        html = html.replace(/(<li(?:\s+class="main-point")?>.*?<\/li>)/gs, '<ul>$1</ul>');
        
        // Clean up class attributes
        html = html.replace(/\s*class="main-point"/g, '');
        html = html.replace(/\s*class="sub-point"/g, '');
        
        // Clean up multiple consecutive ul tags
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        // Clean up empty content and extra whitespace
        html = html.replace(/\n\s*\n/g, '\n');
        html = html.replace(/^\s+|\s+$/gm, '');
        
        return html;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DocsModal.init());
} else {
    DocsModal.init();
}
