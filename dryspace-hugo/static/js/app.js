// Optimized application JavaScript following 2025 performance standards

// Task scheduler for INP optimization - chunks work into <50ms tasks
const taskQueue = [];
let isProcessing = false;

function scheduleTask(task) {
    taskQueue.push(task);
    if (!isProcessing) processQueue();
}

function processQueue() {
    if (taskQueue.length === 0) {
        isProcessing = false;
        return;
    }
    
    isProcessing = true;
    const startTime = performance.now();
    
    while (taskQueue.length > 0 && performance.now() - startTime < 50) {
        const task = taskQueue.shift();
        task();
    }
    
    if (taskQueue.length > 0) {
        requestIdleCallback(processQueue, { timeout: 100 });
    } else {
        isProcessing = false;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Remove loading class for CSS animations
    document.body.classList.remove('loading');
    
    // Initialize form handling
    scheduleTask(initForm);
    
    // Initialize header scroll effect
    scheduleTask(initHeaderScroll);
}

function initForm() {
    const form = document.querySelector('.quote-form');
    if (!form) return;
    
    const messageTextarea = form.querySelector('#message');
    const charCount = form.querySelector('.char-count');
    
    // Character counter with debouncing
    if (messageTextarea && charCount) {
        let timeout;
        messageTextarea.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                charCount.textContent = `${this.value.length}/500`;
            }, 50);
        });
    }
    
    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        scheduleTask(() => validateForm(form));
    });
    
    // Clear error on input
    form.addEventListener('input', function(e) {
        if (e.target.classList.contains('error')) {
            e.target.classList.remove('error');
            const errorEl = e.target.parentElement.querySelector('.error-message');
            if (errorEl) errorEl.textContent = '';
        }
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(err => err.textContent = '');
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    requiredFields.forEach(field => {
        const errorEl = field.parentElement.querySelector('.error-message');
        
        if (!field.value.trim()) {
            field.classList.add('error');
            if (errorEl) errorEl.textContent = 'This field is required';
            isValid = false;
        } else if (field.pattern && !new RegExp(field.pattern).test(field.value)) {
            field.classList.add('error');
            if (errorEl) errorEl.textContent = field.title || 'Invalid format';
            isValid = false;
        }
    });
    
    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value && !emailField.checkValidity()) {
        emailField.classList.add('error');
        const errorEl = emailField.parentElement.querySelector('.error-message');
        if (errorEl) errorEl.textContent = 'Please enter a valid email';
        isValid = false;
    }
    
    if (isValid) {
        // Replace form with success message
        const formContainer = form.parentElement;
        formContainer.innerHTML = `
            <div class="success-message">
                <h2>Thank you!</h2>
                <p>Your request has been received. We'll contact you within 2 hours.</p>
                <p>Need immediate assistance? Call us at <a href="tel:(437) 545-0067" class="phone-link">(437) 545-0067</a></p>
            </div>
        `;
        // Scroll to success message
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function initHeaderScroll() {
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    
    if (!header || !hero) return;
    
    // Use Intersection Observer for performance
    const observerOptions = {
        rootMargin: '-100px 0px 0px 0px'
    };
    
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }, observerOptions);
    
    headerObserver.observe(hero);
}