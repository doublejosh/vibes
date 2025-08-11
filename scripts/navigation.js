// Navigation functionality
const NavigationHandler = {
    init() {
        console.log('NavigationHandler.init() called');
        this.setupButtonListeners();
    },
    
    setupButtonListeners() {
        console.log('NavigationHandler.setupButtonListeners() called');
        
        // Add a delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Setting up button listeners with delay...');
            
            const prevBtn = document.getElementById('prev-slide');
            const nextBtn = document.getElementById('next-slide');
            const stylesToggle = document.getElementById('styles-toggle');
            const counter = document.getElementById('slide-counter');
            
            console.log('Button elements found:');
            console.log('- prevBtn:', prevBtn);
            console.log('- nextBtn:', nextBtn);
            console.log('- stylesToggle:', stylesToggle);
            console.log('- counter:', counter);
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    console.log('Previous button clicked');
                    PresentationApp.prevSlide();
                });
                console.log('Previous button listener attached');
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    console.log('Next button clicked');
                    PresentationApp.nextSlide();
                });
                console.log('Next button listener attached');
            }
            
            if (stylesToggle) {
                console.log('Adding click listener to styles toggle');
                stylesToggle.addEventListener('click', (e) => {
                    console.log('Styles toggle clicked! Event:', e);
                    e.preventDefault();
                    e.stopPropagation();
                    NavigationHandler.toggleCustomStyles();
                });
                // Set initial state to active
                stylesToggle.classList.add('active');
                stylesToggle.title = 'Custom styles: ON (click to toggle)';
                console.log('Styles toggle initialized as active');
            } else {
                console.error('Styles toggle button not found!');
            }
            
            // Add click handler to slide counter for slide selection
            if (counter) {
                counter.addEventListener('click', () => {
                    NavigationHandler.showSlideSelector();
                });
                counter.style.cursor = 'pointer';
                counter.title = 'Click to jump to a specific slide';
                console.log('Counter listener attached');
            }
        }, 100); // 100ms delay
    },
    
    toggleCustomStyles() {
        console.log('toggleCustomStyles called');
        const stylesToggle = document.getElementById('styles-toggle');
        console.log('Current classes:', stylesToggle.classList.toString());
        
        if (stylesToggle.classList.contains('active')) {
            console.log('Turning OFF custom styles');
            // Turn off custom styles
            stylesToggle.classList.remove('active');
            stylesToggle.classList.add('inactive');
            stylesToggle.title = 'Custom styles: OFF (click to toggle)';
            PresentationApp.toggleCustomStyles(false);
        } else {
            console.log('Turning ON custom styles');
            // Turn on custom styles
            stylesToggle.classList.remove('inactive');
            stylesToggle.classList.add('active');
            stylesToggle.title = 'Custom styles: ON (click to toggle)';
            PresentationApp.toggleCustomStyles(true);
        }
        console.log('New classes:', stylesToggle.classList.toString());
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
