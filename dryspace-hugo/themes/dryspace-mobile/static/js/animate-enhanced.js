/**
 * Advanced Animation System by Alex Chen
 * Creates addictive scroll experiences using psychological triggers
 */

// Animation Configuration
const AnimationConfig = {
    // Stagger delays create anticipation
    staggerBase: 50,
    
    // Viewport thresholds for different reveal timings
    thresholds: {
        hero: 0.1,      // Quick hero reveals
        early: 0.3,     // Tease content early
        standard: 0.5,  // Standard reveals
        delayed: 0.7,   // Build anticipation
        climax: 0.9     // Reward patient scrollers
    },
    
    // Animation intensity based on scroll speed
    scrollSpeedThreshold: 800,
    lastScrollTime: Date.now(),
    scrollSpeed: 0
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initAdvancedAnimations();
    initScrollVelocityTracking();
    initMagneticElements();
    initProgressiveReveals();
    initAnticipationBuilders();
});

/**
 * Core animation initialization with psychological hooks
 */
function initAdvancedAnimations() {
    // Create intersection observer with multiple thresholds
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation;
                const animationDelay = element.dataset.animationDelay || 0;
                const animationSpeed = element.dataset.animationSpeed || 'normal';
                
                // Add speed modifier based on scroll velocity
                if (AnimationConfig.scrollSpeed > AnimationConfig.scrollSpeedThreshold) {
                    element.style.animationDuration = '0.3s';
                } else if (animationSpeed === 'fast') {
                    element.style.animationDuration = '0.5s';
                } else if (animationSpeed === 'slow') {
                    element.style.animationDuration = '1.5s';
                }
                
                // Apply animation with delay
                setTimeout(() => {
                    element.classList.add('animate__animated', animationType);
                    
                    // Trigger child animations for cascade effect
                    triggerChildAnimations(element);
                }, animationDelay);
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9]
    });
    
    // Observe all animatable elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Track scroll velocity for dynamic animations
 */
function initScrollVelocityTracking() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const currentTime = Date.now();
        const timeDiff = currentTime - AnimationConfig.lastScrollTime;
        const scrollDiff = Math.abs(currentScrollY - lastScrollY);
        
        AnimationConfig.scrollSpeed = scrollDiff / timeDiff * 1000;
        AnimationConfig.lastScrollTime = currentTime;
        lastScrollY = currentScrollY;
        
        // Add speed-based body classes
        document.body.classList.toggle('fast-scroll', AnimationConfig.scrollSpeed > AnimationConfig.scrollSpeedThreshold);
    });
}

/**
 * Magnetic elements that "pull" user attention
 */
function initMagneticElements() {
    document.querySelectorAll('.magnetic-hover').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Progressive reveal system - each section hints at the next
 */
function initProgressiveReveals() {
    // Add preview hints to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index < sections.length - 1) {
            const nextSection = sections[index + 1];
            const previewHint = createPreviewHint(nextSection);
            section.appendChild(previewHint);
        }
    });
}

/**
 * Create visual hints about upcoming content
 */
function createPreviewHint(nextSection) {
    const hint = document.createElement('div');
    hint.className = 'preview-hint animate__animated animate__pulse animate__infinite';
    hint.innerHTML = `
        <div class="preview-hint-content">
            <i class="fas fa-chevron-down"></i>
            <span class="preview-text">${getPreviewText(nextSection)}</span>
        </div>
    `;
    
    // Make hint clickable for smooth scroll
    hint.addEventListener('click', () => {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    return hint;
}

/**
 * Generate preview text based on section content
 */
function getPreviewText(section) {
    const sectionId = section.id;
    const previewTexts = {
        'pricing': 'See transparent pricing',
        'faq': 'Get your questions answered',
        'diagnostics': 'Check your basement risk',
        'resources': 'Free guides & tips',
        'portfolio': 'View success stories',
        'videos': 'Watch us in action',
        'media': 'As seen on TV'
    };
    
    return previewTexts[sectionId] || 'Discover more below';
}

/**
 * Trigger staggered animations on child elements
 */
function triggerChildAnimations(parent) {
    const children = parent.querySelectorAll('.animate-child');
    children.forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate__animated', 'animate__fadeInUp');
        }, index * AnimationConfig.staggerBase);
    });
}

/**
 * Build anticipation with sequential reveals
 */
function initAnticipationBuilders() {
    // Problem cards - reveal solutions one by one
    const problemCards = document.querySelectorAll('.problem-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger reveal with increasing drama
                setTimeout(() => {
                    entry.target.classList.add('reveal-solution');
                    
                    // Add number counter animation
                    const counter = entry.target.querySelector('.solution-counter');
                    if (counter) {
                        animateCounter(counter);
                    }
                }, index * 200);
            }
        });
    }, { threshold: 0.5 });
    
    problemCards.forEach(card => observer.observe(card));
}

/**
 * Animate number counters for impact
 */
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            element.classList.add('animate__animated', 'animate__pulse');
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

/**
 * Scroll progress indicator with milestone rewards
 */
function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.innerHTML = `
        <div class="progress-bar"></div>
        <div class="progress-milestones"></div>
    `;
    document.body.appendChild(progress);
    
    const progressBar = progress.querySelector('.progress-bar');
    const milestones = [25, 50, 75, 100];
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
        
        // Trigger milestone animations
        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !progress.classList.contains(`milestone-${milestone}`)) {
                progress.classList.add(`milestone-${milestone}`);
                triggerMilestoneReward(milestone);
            }
        });
    });
}

/**
 * Reward users for scrolling with micro-celebrations
 */
function triggerMilestoneReward(milestone) {
    const reward = document.createElement('div');
    reward.className = 'milestone-reward animate__animated animate__bounceIn';
    reward.innerHTML = `
        <i class="fas fa-star"></i>
        <span>${milestone}% Explored!</span>
    `;
    
    document.body.appendChild(reward);
    
    setTimeout(() => {
        reward.classList.add('animate__fadeOut');
        setTimeout(() => reward.remove(), 1000);
    }, 2000);
}

// Initialize scroll progress on load
document.addEventListener('DOMContentLoaded', initScrollProgress);

/**
 * Countdown Timer for Urgency
 */
function initCountdownTimer() {
    const countdowns = document.querySelectorAll('.countdown');
    
    countdowns.forEach(countdown => {
        const targetDate = new Date(countdown.dataset.date).getTime();
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                clearInterval(timer);
                countdown.innerHTML = 'EXPIRED';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdown.querySelector('.days').textContent = String(days).padStart(2, '0');
            countdown.querySelector('.hours').textContent = String(hours).padStart(2, '0');
            countdown.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
            countdown.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
            
            // Add urgency animations at milestones
            if (days === 0 && hours < 24) {
                countdown.classList.add('animate__animated', 'animate__flash', 'animate__infinite');
            }
        }, 1000);
    });
}

// Initialize countdown on load
document.addEventListener('DOMContentLoaded', initCountdownTimer);

/**
 * Exit intent animation - capture leaving visitors
 */
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !document.body.classList.contains('exit-shown')) {
        document.body.classList.add('exit-shown');
        
        const exitPopup = document.querySelector('.exit-intent-popup');
        if (exitPopup) {
            exitPopup.classList.add('animate__animated', 'animate__bounceInDown');
            exitPopup.style.display = 'block';
        }
    }
});

/**
 * Parallax scrolling for depth
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    document.querySelectorAll('.parallax-bg').forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Floating elements
    document.querySelectorAll('.float-element').forEach(element => {
        const speed = element.dataset.floatSpeed || 0.3;
        element.style.transform = `translateY(${Math.sin(scrolled * 0.001) * 50 * speed}px)`;
    });
});