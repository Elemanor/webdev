// Content Marketing 2025 JavaScript - Sophia Rodriguez Implementation

// Content Engagement Analytics
class ContentAnalytics {
    constructor() {
        this.sessionData = {
            startTime: Date.now(),
            contentViewed: [],
            toolsUsed: [],
            calculatorProgress: 0,
            engagementScore: 0
        };
        
        this.init();
    }

    init() {
        // Track content visibility
        this.setupIntersectionObserver();
        
        // Track engagement events
        this.trackEngagement();
        
        // Setup exit intent optimization
        this.setupExitIntent();
        
        // Initialize real-time personalization
        this.initializePersonalization();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: [0.25, 0.5, 0.75, 1.0]
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const contentId = entry.target.id || entry.target.className;
                    const viewData = {
                        element: contentId,
                        visibility: Math.round(entry.intersectionRatio * 100),
                        timestamp: Date.now()
                    };
                    
                    this.sessionData.contentViewed.push(viewData);
                    
                    // Update engagement score
                    this.updateEngagementScore(entry.intersectionRatio);
                    
                    // Trigger content recommendations
                    if (entry.intersectionRatio > 0.75) {
                        this.triggerRecommendations(contentId);
                    }
                }
            });
        }, options);

        // Observe key content sections
        document.querySelectorAll('.content-hub, .calculator-section, .personalized-content-section').forEach(section => {
            observer.observe(section);
        });
    }

    trackEngagement() {
        // Click tracking
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (target) {
                this.trackEvent('click', {
                    element: target.textContent || target.className,
                    href: target.href || '',
                    timestamp: Date.now()
                });
            }
        });

        // Form interaction tracking
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('focus', () => {
                this.trackEvent('form_interaction', {
                    field: field.name || field.id,
                    type: 'focus'
                });
            });
        });

        // Video engagement
        document.querySelectorAll('video, iframe').forEach(video => {
            video.addEventListener('play', () => {
                this.trackEvent('video_play', {
                    source: video.src
                });
            });
        });
    }

    updateEngagementScore(ratio) {
        this.sessionData.engagementScore += ratio * 10;
        
        // Trigger engagement milestones
        if (this.sessionData.engagementScore > 50 && !this.milestoneTriggered) {
            this.milestoneTriggered = true;
            this.showEngagementReward();
        }
    }

    showEngagementReward() {
        const reward = document.createElement('div');
        reward.className = 'engagement-reward position-fixed top-50 start-50 translate-middle';
        reward.innerHTML = `
            <div class="card shadow-lg" style="min-width: 300px; z-index: 9999;">
                <div class="card-body text-center">
                    <i class="fas fa-trophy text-warning fs-1 mb-3"></i>
                    <h5>You're a Waterproofing Expert!</h5>
                    <p>You've explored 50% of our content. Ready for a personalized consultation?</p>
                    <button class="btn btn-primary" onclick="this.closest('.engagement-reward').remove()">
                        Get Expert Advice
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reward);
        
        // Auto-remove after 10 seconds
        setTimeout(() => reward.remove(), 10000);
    }

    triggerRecommendations(contentId) {
        // Content-based recommendations
        const recommendations = {
            'content-hub': ['calculator', 'case-studies', 'faq'],
            'calculator-section': ['financing', 'testimonials', 'contact'],
            'faq-section': ['calculator', 'expert-consultation', 'guide']
        };

        const suggested = recommendations[contentId];
        if (suggested && !this.recommendationShown) {
            this.recommendationShown = true;
            this.showRecommendation(suggested[0]);
        }
    }

    showRecommendation(type) {
        const messages = {
            'calculator': {
                title: 'Ready to See Your Price?',
                text: 'Our calculator takes just 60 seconds',
                cta: 'Calculate Now',
                link: '#waterproofing-calculator'
            },
            'financing': {
                title: 'Affordable Payment Plans',
                text: 'Starting at just $89/month',
                cta: 'View Options',
                link: '#financing'
            },
            'expert-consultation': {
                title: 'Talk to an Expert',
                text: 'Free consultation available now',
                cta: 'Call Now',
                link: 'tel:4375450067'
            }
        };

        const rec = messages[type];
        if (!rec) return;

        const notification = document.createElement('div');
        notification.className = 'recommendation-notification position-fixed bottom-0 end-0 m-4';
        notification.innerHTML = `
            <div class="card shadow-lg" style="width: 320px; z-index: 1050;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="card-title mb-1">${rec.title}</h6>
                            <p class="card-text small text-muted">${rec.text}</p>
                        </div>
                        <button type="button" class="btn-close" onclick="this.closest('.recommendation-notification').remove()"></button>
                    </div>
                    <a href="${rec.link}" class="btn btn-primary btn-sm mt-2">${rec.cta}</a>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.querySelector('.card').style.animation = 'slideInUp 0.3s ease';
        });

        // Auto-remove after 8 seconds
        setTimeout(() => notification.remove(), 8000);
    }

    setupExitIntent() {
        let exitIntentTriggered = false;
        
        // Desktop exit intent
        document.addEventListener('mouseout', (e) => {
            if (e.clientY <= 0 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                this.showExitOffer();
            }
        });

        // Mobile exit intent (back button)
        window.addEventListener('popstate', () => {
            if (!exitIntentTriggered) {
                exitIntentTriggered = true;
                this.showExitOffer();
            }
        });
    }

    showExitOffer() {
        const timeOnSite = Math.floor((Date.now() - this.sessionData.startTime) / 1000);
        
        // Personalized exit offer based on behavior
        let offer = {
            title: "Wait! Don't Leave Empty-Handed",
            text: "Get our free basement waterproofing guide",
            cta: "Get Free Guide"
        };

        if (this.sessionData.calculatorProgress > 50) {
            offer = {
                title: "Complete Your Quote",
                text: "You're almost done! Finish in 30 seconds",
                cta: "Finish Quote"
            };
        } else if (timeOnSite > 300) {
            offer = {
                title: "You've Done Your Research",
                text: "Talk to an expert and get 10% off",
                cta: "Claim Discount"
            };
        }

        // Show exit modal
        const modal = `
            <div class="modal fade show" id="exitModal" style="display: block; background: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center p-5">
                            <i class="fas fa-gift text-primary fs-1 mb-3"></i>
                            <h4>${offer.title}</h4>
                            <p class="text-muted">${offer.text}</p>
                            <button class="btn btn-primary btn-lg">${offer.cta}</button>
                            <button class="btn btn-link text-muted" onclick="document.getElementById('exitModal').remove()">
                                No thanks, I'll continue browsing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modal);
    }

    trackEvent(eventName, data) {
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...data,
                engagement_score: this.sessionData.engagementScore
            });
        }

        // Store locally for personalization
        const events = JSON.parse(localStorage.getItem('userEvents') || '[]');
        events.push({
            event: eventName,
            data: data,
            timestamp: Date.now()
        });
        
        // Keep only last 50 events
        if (events.length > 50) {
            events.shift();
        }
        
        localStorage.setItem('userEvents', JSON.stringify(events));
    }

    initializePersonalization() {
        // Get user context
        const visits = parseInt(localStorage.getItem('visitCount') || '0');
        const lastVisit = localStorage.getItem('lastVisit');
        const interests = JSON.parse(localStorage.getItem('interests') || '[]');

        // Personalize CTAs
        if (visits > 3) {
            document.querySelectorAll('.btn-primary').forEach(btn => {
                if (btn.textContent.includes('Learn More')) {
                    btn.textContent = 'Continue Learning';
                }
            });
        }

        // Show returning visitor benefits
        if (lastVisit && (Date.now() - new Date(lastVisit).getTime()) > 86400000) {
            this.showReturningVisitorOffer();
        }
    }

    showReturningVisitorOffer() {
        const banner = document.createElement('div');
        banner.className = 'returning-visitor-banner bg-success text-white p-3 text-center';
        banner.innerHTML = `
            <div class="container">
                <i class="fas fa-user-check me-2"></i>
                Welcome back! As a returning visitor, enjoy <strong>priority scheduling</strong> on all services.
                <button class="btn btn-light btn-sm ms-3">Claim Benefit</button>
            </div>
        `;

        document.body.insertBefore(banner, document.body.firstChild);
    }
}

// Interactive Content Tools
class InteractiveTools {
    constructor() {
        this.initCalculatorEnhancements();
        this.initContentQuiz();
        this.initProgressTracking();
    }

    initCalculatorEnhancements() {
        // Add tooltips to calculator options
        const tooltips = {
            'water-leaking': 'Visible water entering your basement',
            'damp-walls': 'Moisture without visible water',
            'foundation-cracks': 'Visible cracks in walls or floor',
            'preventive': 'No current issues, planning ahead'
        };

        document.querySelectorAll('.problem-option').forEach(option => {
            const input = option.querySelector('input');
            if (input && tooltips[input.value]) {
                option.setAttribute('data-bs-toggle', 'tooltip');
                option.setAttribute('title', tooltips[input.value]);
            }
        });

        // Initialize Bootstrap tooltips
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
        }
    }

    initContentQuiz() {
        // Quick quiz for engagement
        const quizData = {
            question: "What's the #1 cause of basement water damage in Toronto?",
            options: [
                "Heavy rainfall",
                "Melting snow and spring thaw",
                "Broken pipes",
                "Poor grading"
            ],
            correct: 1,
            explanation: "Toronto's freeze-thaw cycle makes spring the most critical time for waterproofing."
        };

        // Add quiz after content hub
        const contentHub = document.querySelector('.content-hub');
        if (contentHub && !sessionStorage.getItem('quizShown')) {
            setTimeout(() => {
                this.showQuiz(quizData);
                sessionStorage.setItem('quizShown', 'true');
            }, 45000); // Show after 45 seconds
        }
    }

    showQuiz(data) {
        const quiz = document.createElement('div');
        quiz.className = 'content-quiz-popup position-fixed bottom-0 start-50 translate-middle-x mb-4';
        quiz.innerHTML = `
            <div class="card shadow-lg" style="width: 400px; z-index: 1040;">
                <div class="card-header bg-primary text-white">
                    <h6 class="mb-0">
                        <i class="fas fa-question-circle me-2"></i>Quick Question
                    </h6>
                </div>
                <div class="card-body">
                    <p class="mb-3">${data.question}</p>
                    <div class="quiz-options">
                        ${data.options.map((opt, idx) => `
                            <button class="btn btn-outline-primary btn-sm w-100 mb-2" 
                                    onclick="checkQuizAnswer(${idx}, ${data.correct})">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                    <div class="quiz-result d-none mt-3">
                        <p class="mb-2">${data.explanation}</p>
                        <button class="btn btn-primary btn-sm" onclick="this.closest('.content-quiz-popup').remove()">
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(quiz);
    }

    initProgressTracking() {
        // Track calculator progress
        const calculatorSteps = document.querySelectorAll('.calculator-step');
        if (calculatorSteps.length > 0) {
            const updateProgress = () => {
                const activeStep = document.querySelector('.calculator-step.active');
                if (activeStep) {
                    const stepNum = parseInt(activeStep.dataset.step);
                    const progress = (stepNum / calculatorSteps.length) * 100;
                    
                    // Update analytics
                    if (window.contentAnalytics) {
                        window.contentAnalytics.sessionData.calculatorProgress = progress;
                    }
                    
                    // Save progress
                    sessionStorage.setItem('calculatorProgress', progress);
                }
            };

            // Monitor step changes
            const observer = new MutationObserver(updateProgress);
            calculatorSteps.forEach(step => {
                observer.observe(step, { attributes: true, attributeFilter: ['class'] });
            });
        }
    }
}

// Global quiz answer checker
window.checkQuizAnswer = function(selected, correct) {
    const buttons = document.querySelectorAll('.quiz-options button');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correct) {
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-success');
        } else if (idx === selected && selected !== correct) {
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-danger');
        }
    });

    document.querySelector('.quiz-result').classList.remove('d-none');

    // Track quiz engagement
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_completed', {
            'correct': selected === correct
        });
    }
};

// Content Loading Optimization
class ContentOptimizer {
    constructor() {
        this.lazyLoadImages();
        this.preloadCriticalAssets();
        this.optimizeVideos();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalAssets() {
        // Preload next likely content
        const userStage = localStorage.getItem('userStage') || 'awareness';
        
        const preloadMap = {
            'awareness': ['/images/waterproofing-guide.jpg', '/css/calculator.css'],
            'consideration': ['/images/comparison-chart.jpg', '/js/testimonials.js'],
            'decision': ['/images/team-photos.jpg', '/js/booking.js']
        };

        const assets = preloadMap[userStage] || [];
        assets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = asset;
            document.head.appendChild(link);
        });
    }

    optimizeVideos() {
        // Lazy load video thumbnails
        document.querySelectorAll('.video-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const videoId = this.dataset.videoId;
                const container = this.closest('.video-item');
                
                // Replace thumbnail with video
                container.innerHTML = `
                    <div class="ratio ratio-16x9">
                        <iframe src="https://youtube.com/embed/${videoId}?autoplay=1" 
                                allowfullscreen></iframe>
                    </div>
                `;
            });
        });
    }
}

// Initialize all content marketing features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize analytics
    window.contentAnalytics = new ContentAnalytics();
    
    // Initialize interactive tools
    new InteractiveTools();
    
    // Initialize content optimization
    new ContentOptimizer();
    
    // Setup smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Performance monitoring
window.addEventListener('load', () => {
    // Track page load performance
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                'name': 'load',
                'value': loadTime,
                'event_category': 'Content Marketing'
            });
        }
    }
});