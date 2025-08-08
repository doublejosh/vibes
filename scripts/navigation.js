// Navigation functionality
const NavigationHandler = {
    init() {
        this.setupButtonListeners();
    },
    
    setupButtonListeners() {
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                PresentationApp.prevSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                PresentationApp.nextSlide();
            });
        }
        
        // Add click handler to slide counter for slide selection
        const counter = document.getElementById('slide-counter');
        if (counter) {
            counter.addEventListener('click', () => {
                this.showSlideSelector();
            });
            counter.style.cursor = 'pointer';
            counter.title = 'Click to jump to a specific slide';
        }
    },
    
    showSlideSelector() {
        const slideNumber = prompt(`Enter slide number (1-${PresentationApp.totalSlides}):`);
        if (slideNumber) {
            const num = parseInt(slideNumber, 10);
            if (num >= 1 && num <= PresentationApp.totalSlides) {
                PresentationApp.goToSlide(num);
            } else {
                alert(`Please enter a number between 1 and ${PresentationApp.totalSlides}`);
            }
        }
    }
};

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    NavigationHandler.init();
});
