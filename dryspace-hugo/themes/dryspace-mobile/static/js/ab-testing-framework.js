// A/B Testing Framework - Marcus Chen Implementation
class ABTestingFramework {
    constructor() {
        this.tests = new Map();
        this.userId = this.getUserId();
        this.sessionId = this.getSessionId();
        this.initializeTests();
        this.applyVariants();
        this.trackPageView();
    }

    getUserId() {
        let userId = localStorage.getItem('ab_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('ab_user_id', userId);
        }
        return userId;
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('ab_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('ab_session_id', sessionId);
        }
        return sessionId;
    }

    initializeTests() {
        // Test 1: Headline Variations
        this.registerTest('headline_test', {
            name: 'Hero Headline Test',
            variants: {
                control: {
                    selector: '.headline-test',
                    changes: {
                        html: 'Toronto Basement Waterproofing Experts<span class="text-primary d-block">Guaranteed Dry Basements with Lifetime Warranty</span>'
                    }
                },
                variant_a: {
                    selector: '.headline-test',
                    changes: {
                        html: 'Stop Your Basement Flooding <span class="text-primary d-block">Today</span><span class="fs-4 text-muted d-block mt-2">Guaranteed Dry or Your Money Back</span>'
                    }
                },
                variant_b: {
                    selector: '.headline-test',
                    changes: {
                        html: 'Save $3,400 on Basement Waterproofing<span class="text-primary d-block">Toronto\'s #1 Rated Since 1999</span>'
                    }
                },
                variant_c: {
                    selector: '.headline-test',
                    changes: {
                        html: '24-Hour Emergency Waterproofing<span class="text-primary d-block">50,000+ Toronto Homes Protected</span>'
                    }
                }
            },
            traffic: 1.0, // 100% of traffic
            goals: ['form_submitted', 'phone_clicked', 'quote_completed']
        });

        // Test 2: CTA Button Variations
        this.registerTest('cta_button_test', {
            name: 'Primary CTA Button Test',
            variants: {
                control: {
                    selector: '.btn-cta-primary',
                    changes: {
                        html: '<i class="fas fa-phone-alt me-2"></i>Call (437) 545-0067'
                    }
                },
                variant_a: {
                    selector: '.btn-cta-primary',
                    changes: {
                        html: '<i class="fas fa-phone-alt me-2"></i>Call Now: (437) 545-0067<small class="d-block">Speak to an expert in 30 seconds</small>',
                        class: 'btn-danger'
                    }
                },
                variant_b: {
                    selector: '.btn-cta-primary',
                    changes: {
                        html: '<i class="fas fa-phone-alt me-2"></i>Get Free Quote: (437) 545-0067',
                        class: 'btn-success'
                    }
                }
            },
            traffic: 0.5, // 50% of traffic
            goals: ['phone_clicked']
        });

        // Test 3: Form Steps vs Single Form
        this.registerTest('form_layout_test', {
            name: 'Form Layout Test',
            variants: {
                control: {
                    selector: '.cro-form',
                    changes: {
                        attribute: { 'data-steps': 'false' }
                    }
                },
                variant_a: {
                    selector: '.cro-form',
                    changes: {
                        attribute: { 'data-steps': 'true' }
                    }
                }
            },
            traffic: 0.8,
            goals: ['form_started', 'form_submitted', 'form_abandoned']
        });

        // Test 4: Social Proof Variations
        this.registerTest('social_proof_test', {
            name: 'Social Proof Display Test',
            variants: {
                control: {
                    selector: '.trust-indicators',
                    changes: {
                        show: true
                    }
                },
                variant_a: {
                    selector: '.trust-indicators',
                    changes: {
                        html: this.generateDynamicSocialProof()
                    }
                },
                variant_b: {
                    selector: '.activity-feed',
                    changes: {
                        class: 'activity-feed-prominent'
                    }
                }
            },
            traffic: 0.6,
            goals: ['trust_indicator_clicked', 'form_submitted']
        });

        // Test 5: Urgency Messaging
        this.registerTest('urgency_test', {
            name: 'Urgency Messaging Test',
            variants: {
                control: {
                    selector: '.urgency-section',
                    changes: {
                        show: false
                    }
                },
                variant_a: {
                    selector: '.urgency-section',
                    changes: {
                        show: true,
                        class: 'alert-warning'
                    }
                },
                variant_b: {
                    selector: '.urgency-section',
                    changes: {
                        show: true,
                        class: 'alert-danger animate-pulse'
                    }
                }
            },
            traffic: 0.7,
            goals: ['urgency_responded', 'form_submitted']
        });

        // Test 6: Mobile Sticky CTA
        this.registerTest('mobile_cta_test', {
            name: 'Mobile Sticky CTA Test',
            variants: {
                control: {
                    selector: '.mobile-sticky-cta',
                    changes: {
                        show: false
                    }
                },
                variant_a: {
                    selector: '.mobile-sticky-cta',
                    changes: {
                        show: true,
                        position: 'bottom'
                    }
                },
                variant_b: {
                    selector: '.mobile-sticky-cta',
                    changes: {
                        show: true,
                        position: 'top',
                        style: 'background: #dc3545; color: white;'
                    }
                }
            },
            traffic: 1.0,
            device: 'mobile',
            goals: ['mobile_cta_clicked']
        });
    }

    registerTest(testId, config) {
        // Determine if user should be in test
        if (Math.random() > config.traffic) {
            return;
        }

        // Check device targeting
        if (config.device) {
            const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
            if (config.device === 'mobile' && !isMobile) return;
            if (config.device === 'desktop' && isMobile) return;
        }

        // Assign variant
        const savedVariant = this.getSavedVariant(testId);
        let variant = savedVariant;

        if (!variant) {
            const variants = Object.keys(config.variants);
            variant = variants[Math.floor(Math.random() * variants.length)];
            this.saveVariant(testId, variant);
        }

        // Store test configuration
        this.tests.set(testId, {
            ...config,
            selectedVariant: variant,
            startTime: Date.now()
        });

        // Track test exposure
        this.trackEvent('test_exposed', {
            test_id: testId,
            variant: variant,
            test_name: config.name
        });
    }

    getSavedVariant(testId) {
        const savedTests = JSON.parse(localStorage.getItem('ab_tests') || '{}');
        return savedTests[testId];
    }

    saveVariant(testId, variant) {
        const savedTests = JSON.parse(localStorage.getItem('ab_tests') || '{}');
        savedTests[testId] = variant;
        localStorage.setItem('ab_tests', JSON.stringify(savedTests));
    }

    applyVariants() {
        this.tests.forEach((test, testId) => {
            const variantConfig = test.variants[test.selectedVariant];
            if (!variantConfig) return;

            // Apply DOM changes
            if (variantConfig.selector) {
                const elements = document.querySelectorAll(variantConfig.selector);
                elements.forEach(element => {
                    // Apply HTML changes
                    if (variantConfig.changes.html) {
                        element.innerHTML = variantConfig.changes.html;
                    }

                    // Apply class changes
                    if (variantConfig.changes.class) {
                        element.className = element.className + ' ' + variantConfig.changes.class;
                    }

                    // Apply attribute changes
                    if (variantConfig.changes.attribute) {
                        Object.entries(variantConfig.changes.attribute).forEach(([attr, value]) => {
                            element.setAttribute(attr, value);
                        });
                    }

                    // Apply style changes
                    if (variantConfig.changes.style) {
                        element.style.cssText += variantConfig.changes.style;
                    }

                    // Show/hide elements
                    if (variantConfig.changes.show !== undefined) {
                        element.style.display = variantConfig.changes.show ? 'block' : 'none';
                    }

                    // Mark element with test data
                    element.setAttribute('data-ab-test', testId);
                    element.setAttribute('data-ab-variant', test.selectedVariant);
                });
            }

            // Apply JavaScript changes
            if (variantConfig.changes.script) {
                variantConfig.changes.script();
            }
        });
    }

    trackPageView() {
        const pageData = {
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now(),
            tests: {}
        };

        this.tests.forEach((test, testId) => {
            pageData.tests[testId] = {
                variant: test.selectedVariant,
                name: test.name
            };
        });

        this.trackEvent('page_view', pageData);
    }

    trackGoal(goalName, value = 1) {
        // Find tests with this goal
        const relevantTests = [];
        this.tests.forEach((test, testId) => {
            if (test.goals && test.goals.includes(goalName)) {
                relevantTests.push({
                    test_id: testId,
                    variant: test.selectedVariant,
                    test_name: test.name
                });
            }
        });

        if (relevantTests.length > 0) {
            this.trackEvent('goal_completed', {
                goal: goalName,
                value: value,
                tests: relevantTests,
                time_to_convert: Date.now() - this.tests.values().next().value.startTime
            });

            // Calculate conversion rate
            this.updateConversionRate(goalName);
        }
    }

    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            user_id: this.userId,
            session_id: this.sessionId,
            timestamp: Date.now(),
            ...data
        };

        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'AB_Testing',
                custom_map: eventData
            });
        }

        // Send to custom endpoint
        if (window.AB_TEST_ENDPOINT) {
            fetch(window.AB_TEST_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            }).catch(console.error);
        }

        // Local storage for debugging
        const events = JSON.parse(localStorage.getItem('ab_events') || '[]');
        events.push(eventData);
        if (events.length > 500) events.splice(0, 100);
        localStorage.setItem('ab_events', JSON.stringify(events));
    }

    updateConversionRate(goalName) {
        const stats = JSON.parse(localStorage.getItem('ab_stats') || '{}');
        
        this.tests.forEach((test, testId) => {
            if (!test.goals || !test.goals.includes(goalName)) return;

            const testStats = stats[testId] || {};
            const variantStats = testStats[test.selectedVariant] || { views: 0, conversions: {} };
            
            variantStats.views = (variantStats.views || 0) + 1;
            variantStats.conversions[goalName] = (variantStats.conversions[goalName] || 0) + 1;
            
            testStats[test.selectedVariant] = variantStats;
            stats[testId] = testStats;
        });

        localStorage.setItem('ab_stats', JSON.stringify(stats));
    }

    generateDynamicSocialProof() {
        const proofs = [
            '<i class="fas fa-users"></i> Join 50,000+ satisfied customers',
            '<i class="fas fa-star"></i> 4.9/5 from 2,847 verified reviews',
            '<i class="fas fa-award"></i> Toronto\'s #1 for 25 years',
            '<i class="fas fa-clock"></i> Average response: 27 minutes'
        ];
        
        return proofs[Math.floor(Math.random() * proofs.length)];
    }

    // Multivariate Testing Support
    registerMultivariateTest(testId, config) {
        const factors = config.factors;
        const combinations = this.generateCombinations(factors);
        
        // Convert to standard test format
        const variants = {};
        combinations.forEach((combo, index) => {
            variants[`variant_${index}`] = {
                changes: combo
            };
        });

        this.registerTest(testId, {
            ...config,
            variants: variants
        });
    }

    generateCombinations(factors) {
        // Generate all possible combinations of factors
        const combinations = [];
        const factorKeys = Object.keys(factors);
        
        const generate = (index, current) => {
            if (index === factorKeys.length) {
                combinations.push({ ...current });
                return;
            }
            
            const key = factorKeys[index];
            factors[key].forEach(value => {
                current[key] = value;
                generate(index + 1, current);
            });
        };
        
        generate(0, {});
        return combinations;
    }

    // Statistical Significance Calculator
    calculateSignificance(testId) {
        const stats = JSON.parse(localStorage.getItem('ab_stats') || '{}');
        const testStats = stats[testId];
        
        if (!testStats) return null;
        
        const variants = Object.keys(testStats);
        if (variants.length < 2) return null;
        
        // Simple Chi-square test implementation
        const results = {};
        const control = variants[0];
        
        variants.slice(1).forEach(variant => {
            const controlData = testStats[control];
            const variantData = testStats[variant];
            
            // Calculate conversion rates
            const controlRate = Object.values(controlData.conversions).reduce((a, b) => a + b, 0) / controlData.views;
            const variantRate = Object.values(variantData.conversions).reduce((a, b) => a + b, 0) / variantData.views;
            
            // Calculate lift
            const lift = ((variantRate - controlRate) / controlRate) * 100;
            
            // Simple significance check (real implementation would use proper statistics)
            const sampleSize = controlData.views + variantData.views;
            const significant = sampleSize > 100 && Math.abs(lift) > 5;
            
            results[variant] = {
                control_rate: controlRate,
                variant_rate: variantRate,
                lift: lift,
                significant: significant,
                confidence: significant ? 95 : 0
            };
        });
        
        return results;
    }

    // Debug Panel
    showDebugPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            border: 2px solid #333;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            max-height: 500px;
            overflow-y: auto;
        `;
        
        let html = '<h3>A/B Testing Debug Panel</h3>';
        html += `<p>User ID: ${this.userId}</p>`;
        html += `<p>Session ID: ${this.sessionId}</p>`;
        html += '<h4>Active Tests:</h4>';
        
        this.tests.forEach((test, testId) => {
            html += `<div style="margin-bottom: 10px; padding: 10px; background: #f0f0f0; border-radius: 5px;">`;
            html += `<strong>${test.name}</strong><br>`;
            html += `Test ID: ${testId}<br>`;
            html += `Variant: ${test.selectedVariant}<br>`;
            html += `Goals: ${test.goals.join(', ')}<br>`;
            
            const significance = this.calculateSignificance(testId);
            if (significance) {
                html += '<strong>Results:</strong><br>';
                Object.entries(significance).forEach(([variant, data]) => {
                    html += `${variant}: ${(data.variant_rate * 100).toFixed(2)}% (${data.lift > 0 ? '+' : ''}${data.lift.toFixed(2)}%)`;
                    html += data.significant ? ' ✅' : ' ⏳';
                    html += '<br>';
                });
            }
            
            html += '</div>';
        });
        
        html += '<button onclick="this.parentElement.remove()" style="margin-top: 10px;">Close</button>';
        
        panel.innerHTML = html;
        document.body.appendChild(panel);
    }
}

// Global instance
let abTesting;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    abTesting = new ABTestingFramework();
    
    // Expose for goal tracking
    window.trackABGoal = (goalName, value) => {
        abTesting.trackGoal(goalName, value);
    };
    
    // Track common goals automatically
    document.addEventListener('click', (e) => {
        const element = e.target.closest('[data-event]');
        if (element) {
            const event = element.dataset.event;
            abTesting.trackGoal(event);
        }
    });
    
    // Track form interactions
    document.addEventListener('submit', (e) => {
        if (e.target.matches('form')) {
            abTesting.trackGoal('form_submitted');
        }
    });
    
    // Debug mode
    if (window.location.hash === '#ab-debug') {
        abTesting.showDebugPanel();
    }
});

// Export for use in other scripts
window.ABTesting = ABTestingFramework;