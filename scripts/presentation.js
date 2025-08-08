// Main presentation application
const PresentationApp = {
    currentSlide: 1,
    totalSlides: 20,
    slides: [],
    
    async init() {
        try {
            await this.loadSlides();
            this.setupEventListeners();
            this.showSlide(1);
            this.updateProgress();
        } catch (error) {
            console.error('Failed to initialize presentation:', error);
            this.showError('Failed to load presentation content.');
        }
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
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
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
        
        let html = `<div class="${slideClass}">`;
        html += `<div class="slide-number">${slide.id} / ${this.totalSlides}</div>`;
        
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
        
        html += '</div>';
        
        container.innerHTML = html;
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
