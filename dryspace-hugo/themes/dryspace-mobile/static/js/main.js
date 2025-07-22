// Dryspace Mobile-First JavaScript
// Optimized for performance and user experience

document.addEventListener('DOMContentLoaded', function() {
    
    // Sticky Navigation on Scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Form Validation
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            
            if (!form.checkValidity()) {
                event.stopPropagation();
            } else {
                // Handle form submission
                handleFormSubmit(form);
            }
            
            form.classList.add('was-validated');
        }, false);
    });
    
    // Phone Number Formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
            } else if (value.length >= 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            e.target.value = value;
        });
    });
    
    // Postal Code Formatting
    const postalInputs = document.querySelectorAll('input[placeholder*="Postal Code"]');
    postalInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (value.length > 3) {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6);
            }
            e.target.value = value;
        });
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 100; // Account for sticky header
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Problem Cards Interaction
    const problemCards = document.querySelectorAll('.problem-card');
    problemCards.forEach(card => {
        card.addEventListener('click', function() {
            const link = this.querySelector('a');
            if (link) {
                link.click();
            }
        });
    });
    
    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Form Submission Handler
    function handleFormSubmit(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.classList.add('btn-loading');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Submitting...';
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Show success message
            submitButton.classList.remove('btn-loading');
            submitButton.classList.add('btn-success');
            submitButton.innerHTML = '<i class="fas fa-check me-2"></i>Success! We\'ll call you shortly.';
            
            // Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Lead',
                    'event_label': 'Free Assessment Form'
                });
            }
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                form.classList.remove('was-validated');
                submitButton.classList.remove('btn-success');
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 3000);
        }, 1500);
    }
    
    // Mobile Menu Close on Click
    const navLinks = document.querySelectorAll('.navbar-nav a');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
    
    // Service Area Hover Effects
    const serviceAreas = document.querySelectorAll('.col-md-3.col-6 .border');
    serviceAreas.forEach(area => {
        area.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--primary)';
        });
        
        area.addEventListener('mouseleave', function() {
            this.style.borderColor = '#dee2e6';
        });
    });
    
    // Track Phone Clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Phone',
                    'event_label': 'Call Click - ' + this.textContent
                });
            }
        });
    });
    
    // Performance: Debounce Scroll Events
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function() {
            // Any expensive scroll operations here
        }, 150);
    });
    
    // Initialize Bootstrap Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Animate.css Scroll Animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const viewportHeight = window.innerHeight;
            
            // Check if element is in viewport
            if (elementTop < viewportHeight * 0.9 && elementBottom > 0) {
                if (!element.classList.contains('animated')) {
                    element.classList.add('animated');
                    
                    // Add the animation class
                    const animationClass = element.dataset.animation || 'animate__fadeInUp';
                    element.classList.add('animate__animated', animationClass);
                }
            }
        });
    };
    
    // Run on scroll and initial load
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    
    // Add hover animations to cards
    const cards = document.querySelectorAll('.problem-card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('animate__animated', 'animate__pulse');
        });
        
        card.addEventListener('animationend', function() {
            this.classList.remove('animate__animated', 'animate__pulse');
        });
    });
    
    // Animate CTAs on hover
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-warning');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.classList.add('animate__animated', 'animate__heartBeat');
        });
        
        btn.addEventListener('animationend', function() {
            this.classList.remove('animate__animated', 'animate__heartBeat');
        });
    });
    
    // Number Counter Animation
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.animate-number');
        
        numbers.forEach(number => {
            const elementTop = number.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;
            
            if (elementTop < viewportHeight * 0.9 && !number.classList.contains('counted')) {
                number.classList.add('counted');
                const target = parseInt(number.dataset.target);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    number.textContent = Math.floor(current).toLocaleString();
                }, 16);
            }
        });
    };
    
    window.addEventListener('scroll', animateNumbers);
    animateNumbers();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registered');
        }).catch(err => {
            console.log('ServiceWorker registration failed');
        });
    });
}