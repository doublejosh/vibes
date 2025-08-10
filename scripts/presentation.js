// Main presentation application
const PresentationApp = {
    currentSlide: 1,
    totalSlides: 20,
    slides: [],
    styleSheet: null,
    
    async init() {
        try {
            this.createDynamicStyleSheet();
            await this.loadSlides();
            this.setupEventListeners();
            this.showSlide(1);
            this.updateProgress();
            
            // Initialize prompt suggestions
            await PromptSuggestions.init();
        } catch (error) {
            console.error('Failed to initialize presentation:', error);
            this.showError('Failed to load presentation content.');
        }
    },
    
    createDynamicStyleSheet() {
        // Create a dedicated stylesheet for slide-specific styles
        this.styleSheet = document.createElement('style');
        this.styleSheet.id = 'slide-dynamic-styles';
        document.head.appendChild(this.styleSheet);
    },
    
    async loadSlides() {
        try {
            const response = await fetch('content/slides.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.slides = data.slides;
            this.totalSlides = data.presentation.totalSlides;
            
            // Update page title
            document.title = data.presentation.title;
        } catch (error) {
            console.error('Error loading slides:', error);
            throw error;
        }
    },
    
    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'Escape':
                    // Exit fullscreen if in fullscreen mode
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
                case 'f':
                case 'F':
                    // Toggle fullscreen
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
        
        // Touch/swipe support for mobile
        let startX = null;
        let startY = null;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Only trigger if horizontal swipe is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            startX = null;
            startY = null;
        });
    },
    
    showSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        const slide = this.slides.find(s => s.id === slideNumber);
        if (!slide) {
            console.error(`Slide ${slideNumber} not found`);
            return;
        }
        
        this.currentSlide = slideNumber;
        this.renderSlide(slide);
        this.updateNavigation();
        this.updateProgress();
        
        // Update prompt suggestions for the new slide
        if (typeof PromptSuggestions !== 'undefined' && PromptSuggestions.updateSuggestions) {
            PromptSuggestions.updateSuggestions(slideNumber);
        }
    },
    
    renderSlide(slide) {
        const container = document.getElementById('current-slide');
        let slideClass = 'slide';
        
        // Add specific classes based on slide type
        switch(slide.type) {
            case 'title':
                slideClass += ' title-slide';
                break;
            case 'end':
                slideClass += ' end-slide';
                break;
            default:
                slideClass += ' content-slide';
        }
        
        // Apply custom styles if they exist
        this.applySlideStyles(slide);
        
        let html = `<div class="${slideClass}" id="slide-${slide.id}" data-slide-id="${slide.id}">`;
        
        // Don't wrap content in slide-content div for first and last slides
        const useContentWrapper = slide.id !== 1 && slide.id !== 20;
        
        if (useContentWrapper) {
            html += `<div class="slide-content">`;
        }
        
        if (slide.title) {
            const titleTag = slide.type === 'title' ? 'h1' : 'h2';
            html += `<${titleTag}>${slide.title}</${titleTag}>`;
        }
        
        if (slide.subtitle) {
            html += `<div class="subtitle">${slide.subtitle}</div>`;
        }
        
        if (slide.content) {
            html += `<div class="content">${slide.content}</div>`;
        }
        
        if (useContentWrapper) {
            html += '</div>'; // Close slide-content
        }
        html += '</div>'; // Close slide
        
        console.log('Generated HTML:', html); // Debug log
        container.innerHTML = html;
        console.log('Container after setting innerHTML:', container.innerHTML); // Debug log
        
        // Add floating animation info if custom animations exist
        this.updateAnimationInfo(slide);
        
        // Apply transition effects
        this.applySlideTransition(slide);
    },
    
    updateAnimationInfo(slide) {
        // Remove existing animation info
        const existingInfo = document.getElementById('floating-animation-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        // Add new animation info if slide has custom animations
        if (slide.customCSS) {
            const animationNames = this.extractAnimationNames(slide.customCSS);
            if (animationNames.length > 0) {
                const animationDiv = document.createElement('div');
                animationDiv.id = 'floating-animation-info';
                animationDiv.className = 'floating-animation-info';
                animationDiv.textContent = animationNames.join(', ');
                document.body.appendChild(animationDiv);
            }
        }
    },
    
    updateNavigation() {
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        const counter = document.getElementById('slide-counter');
        
        prevBtn.disabled = this.currentSlide <= 1;
        nextBtn.disabled = this.currentSlide >= this.totalSlides;
        counter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    },
    
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const percentage = (this.currentSlide / this.totalSlides) * 100;
        progressFill.style.width = `${percentage}%`;
    },
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.showSlide(this.currentSlide + 1);
        }
    },
    
    prevSlide() {
        if (this.currentSlide > 1) {
            this.showSlide(this.currentSlide - 1);
        }
    },
    
    goToSlide(slideNumber) {
        this.showSlide(slideNumber);
    },
    
    applySlideStyles(slide) {
        if (!slide.styles || !this.styleSheet) return;
        
        // Clear previous slide styles
        this.styleSheet.textContent = '';
        
        // Convert styles object to CSS
        let cssRules = '';
        const slideSelector = `#slide-${slide.id}`;
        
        // Build CSS rule from styles object
        let styleDeclarations = '';
        for (const [property, value] of Object.entries(slide.styles)) {
            // Convert camelCase to kebab-case
            const cssProperty = property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            styleDeclarations += `  ${cssProperty}: ${value};\n`;
        }
        
        if (styleDeclarations) {
            cssRules += `${slideSelector} {\n${styleDeclarations}}\n`;
        }
        
        // Add any custom CSS classes if defined
        if (slide.customCSS) {
            cssRules += `\n${slide.customCSS}\n`;
        }
        
        // Apply the styles
        this.styleSheet.textContent = cssRules;
        
        // Apply progressive styles (styles that accumulate)
        this.applyProgressiveStyles(slide);
    },
    
    applyProgressiveStyles(slide) {
        // Progressive styles that build up over time
        const body = document.body;
        
        // Add slide-specific body class
        body.className = body.className.replace(/slide-\d+/g, '');
        body.classList.add(`slide-${slide.id}`);
        
        // Apply theme evolution based on slide progression
        const progressPercentage = (slide.id / this.totalSlides) * 100;
        
        if (progressPercentage < 25) {
            body.classList.add('theme-intro');
            body.classList.remove('theme-development', 'theme-climax', 'theme-conclusion');
        } else if (progressPercentage < 50) {
            body.classList.add('theme-development');
            body.classList.remove('theme-intro', 'theme-climax', 'theme-conclusion');
        } else if (progressPercentage < 75) {
            body.classList.add('theme-climax');
            body.classList.remove('theme-intro', 'theme-development', 'theme-conclusion');
        } else {
            body.classList.add('theme-conclusion');
            body.classList.remove('theme-intro', 'theme-development', 'theme-climax');
        }
    },
    
    applySlideTransition(slide) {
        const slideElement = document.querySelector(`#slide-${slide.id}`);
        if (!slideElement) return;
        
        // Add entrance animation
        slideElement.style.opacity = '0';
        slideElement.style.transform = 'translateX(50px)';
        
        // Trigger animation
        requestAnimationFrame(() => {
            slideElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            slideElement.style.opacity = '1';
            slideElement.style.transform = 'translateX(0)';
        });
    },
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    },
    
    extractAnimationNames(customCSS) {
        if (!customCSS) return [];
        
        // Extract @keyframes names using regex
        const keyframesRegex = /@keyframes\s+([a-zA-Z][a-zA-Z0-9_-]*)/g;
        const animationNames = [];
        let match;
        
        while ((match = keyframesRegex.exec(customCSS)) !== null) {
            animationNames.push(match[1]);
        }
        
        return animationNames;
    },
    
    showError(message) {
        const container = document.getElementById('current-slide');
        container.innerHTML = `
            <div class="slide error-slide">
                <h2>Error</h2>
                <p>${message}</p>
                <p>Please check the console for more details.</p>
            </div>
        `;
    }
};

// Prompt suggestions functionality
const PromptSuggestions = {
    prompts: [],
    shownPrompts: new Set(),
    currentSlideKeywords: [],
    
    async init() {
        try {
            await this.loadPrompts();
            this.setupClickHandlers();
            this.updateSuggestions(1); // Initialize with first slide
        } catch (error) {
            console.error('Failed to initialize prompt suggestions:', error);
        }
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
            throw error;
        }
    },
    
    setupClickHandlers() {
        document.getElementById('prompt-suggestion-1').addEventListener('click', () => {
            this.onPromptClick(1);
        });
        
        document.getElementById('prompt-suggestion-2').addEventListener('click', () => {
            this.onPromptClick(2);
        });
    },
    
    onPromptClick(promptIndex) {
        // Open the prompts modal when a suggestion is clicked
        const promptsModal = document.getElementById('prompts-modal');
        if (promptsModal) {
            promptsModal.classList.remove('hidden');
        }
    },
    
    updateSuggestions(slideNumber) {
        // Get slide-specific keywords or use random prompts
        const suggestions = this.getRelevantPrompts(slideNumber);
        
        const prompt1 = document.getElementById('prompt-suggestion-1');
        const prompt2 = document.getElementById('prompt-suggestion-2');
        
        if (suggestions.length >= 1) {
            prompt1.querySelector('.prompt-text').textContent = suggestions[0].prompt;
            prompt1.dataset.promptId = suggestions[0].id;
        }
        
        if (suggestions.length >= 2) {
            prompt2.querySelector('.prompt-text').textContent = suggestions[1].prompt;
            prompt2.dataset.promptId = suggestions[1].id;
        }
    },
    
    getRelevantPrompts(slideNumber) {
        const slideKeywords = this.getSlideKeywords(slideNumber);
        let relevantPrompts = [];
        
        // First, try to find prompts with relevant keywords
        if (slideKeywords.length > 0) {
            relevantPrompts = this.prompts.filter(prompt => 
                slideKeywords.some(keyword => 
                    prompt.prompt.toLowerCase().includes(keyword.toLowerCase())
                ) && !this.shownPrompts.has(prompt.id)
            );
        }
        
        // If no relevant prompts found, get random unshown prompts
        if (relevantPrompts.length < 2) {
            const unshownPrompts = this.prompts.filter(prompt => 
                !this.shownPrompts.has(prompt.id)
            );
            
            // Add random prompts to fill the gap
            while (relevantPrompts.length < 2 && unshownPrompts.length > 0) {
                const randomIndex = Math.floor(Math.random() * unshownPrompts.length);
                const randomPrompt = unshownPrompts.splice(randomIndex, 1)[0];
                
                if (!relevantPrompts.find(p => p.id === randomPrompt.id)) {
                    relevantPrompts.push(randomPrompt);
                }
            }
        }
        
        // Mark these prompts as shown
        relevantPrompts.forEach(prompt => this.shownPrompts.add(prompt.id));
        
        // Reset shown prompts if we've shown them all
        if (this.shownPrompts.size >= this.prompts.length) {
            this.shownPrompts.clear();
        }
        
        return relevantPrompts.slice(0, 2);
    },
    
    getSlideKeywords(slideNumber) {
        // Define keywords for different slides
        const slideKeywordMap = {
            1: ['project', 'setup', 'html', 'index'],
            2: ['prompts', 'track', 'file'],
            3: ['content', 'slides', 'json'],
            4: ['navigation', 'buttons', 'interface'],
            5: ['styling', 'css', 'design'],
            6: ['responsive', 'mobile', 'layout'],
            7: ['animations', 'effects', 'transitions'],
            8: ['background', 'gradients', 'visual'],
            9: ['typography', 'fonts', 'text'],
            10: ['images', 'media', 'assets'],
            11: ['interactive', 'javascript', 'functionality'],
            12: ['modal', 'popup', 'overlay'],
            13: ['performance', 'optimization', 'loading'],
            14: ['accessibility', 'a11y', 'usability'],
            15: ['testing', 'debugging', 'validation'],
            16: ['deployment', 'hosting', 'production'],
            17: ['documentation', 'readme', 'comments'],
            18: ['version', 'git', 'control'],
            19: ['refactor', 'improve', 'cleanup'],
            20: ['conclusion', 'summary', 'final']
        };
        
        return slideKeywordMap[slideNumber] || [];
    }
};
