/**
 * Site-wide Animation Control System
 * Dr. Amara Johnson-Liu's Accessibility Implementation
 * 
 * Provides universal animation pause/play controls that respect:
 * - User preferences (prefers-reduced-motion)
 * - Manual pause/play toggle
 * - Persistent state across page loads
 */

(function() {
    'use strict';

    // Animation Control Manager
    class AnimationControlManager {
        constructor() {
            this.isPaused = false;
            this.controls = [];
            this.storageKey = 'dryspace-animations-paused';
            this.init();
        }

        init() {
            // Check user preferences
            this.checkUserPreferences();
            
            // Load saved state
            this.loadState();
            
            // Create global control button
            this.createGlobalControl();
            
            // Apply initial state
            this.applyState();
            
            // Listen for preference changes
            this.listenForPreferenceChanges();
            
            // Register all animation controls
            this.registerExistingControls();
        }

        checkUserPreferences() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (prefersReducedMotion.matches) {
                this.isPaused = true;
            }
        }

        loadState() {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState !== null) {
                this.isPaused = savedState === 'true';
            }
        }

        saveState() {
            localStorage.setItem(this.storageKey, this.isPaused.toString());
        }

        createGlobalControl() {
            // Check if control already exists
            if (document.getElementById('global-animation-control')) {
                return;
            }

            // Create control button
            const control = document.createElement('div');
            control.id = 'global-animation-control';
            control.className = 'animation-control-global';
            control.innerHTML = `
                <button type="button" 
                        class="btn-animation-toggle-global"
                        aria-pressed="${this.isPaused}"
                        aria-label="${this.isPaused ? 'Play all animations' : 'Pause all animations'}">
                    <span class="icon-pause" ${this.isPaused ? 'style="display:none;"' : ''}>
                        <i class="fas fa-pause" aria-hidden="true"></i>
                    </span>
                    <span class="icon-play" ${!this.isPaused ? 'style="display:none;"' : ''}>
                        <i class="fas fa-play" aria-hidden="true"></i>
                    </span>
                    <span class="label-text">Animations</span>
                </button>
            `;

            document.body.appendChild(control);

            // Add click handler
            const button = control.querySelector('button');
            button.addEventListener('click', () => this.toggleAnimations());

            // Add to controls array
            this.controls.push(button);
        }

        toggleAnimations() {
            this.isPaused = !this.isPaused;
            this.saveState();
            this.applyState();
            this.updateControls();
            this.announceChange();
        }

        applyState() {
            if (this.isPaused) {
                document.body.classList.add('animations-paused');
                // Pause CSS animations
                this.pauseCSSAnimations();
                // Pause JavaScript animations
                this.pauseJSAnimations();
            } else {
                document.body.classList.remove('animations-paused');
                // Resume CSS animations
                this.resumeCSSAnimations();
                // Resume JavaScript animations
                this.resumeJSAnimations();
            }
        }

        pauseCSSAnimations() {
            // Create or update style element
            let styleEl = document.getElementById('animation-pause-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'animation-pause-styles';
                document.head.appendChild(styleEl);
            }

            styleEl.textContent = `
                .animations-paused *,
                .animations-paused *::before,
                .animations-paused *::after {
                    animation-play-state: paused !important;
                    transition: none !important;
                }
                
                .animations-paused .animate__animated {
                    animation: none !important;
                }
                
                .animations-paused .icon-pulse,
                .animations-paused .icon-bounce,
                .animations-paused .icon-shake,
                .animations-paused .icon-float,
                .animations-paused .icon-dance,
                .animations-paused .icon-glow,
                .animations-paused .icon-spin-custom,
                .animations-paused .icon-color-shift {
                    animation: none !important;
                }
            `;
        }

        resumeCSSAnimations() {
            const styleEl = document.getElementById('animation-pause-styles');
            if (styleEl) {
                styleEl.textContent = '';
            }
        }

        pauseJSAnimations() {
            // Pause ScrollEngagement if exists
            if (window.scrollEngagement) {
                window.scrollEngagement.pause();
            }

            // Pause IconChoreographer if exists
            if (window.iconChoreographer) {
                window.iconChoreographer.pauseAll();
            }

            // Pause any setInterval/setTimeout based animations
            this.pauseTimers();

            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('animationsPaused'));
        }

        resumeJSAnimations() {
            // Resume ScrollEngagement if exists
            if (window.scrollEngagement) {
                window.scrollEngagement.resume();
            }

            // Resume IconChoreographer if exists
            if (window.iconChoreographer) {
                window.iconChoreographer.resumeAll();
            }

            // Resume timers
            this.resumeTimers();

            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('animationsResumed'));
        }

        pauseTimers() {
            // Store original functions
            if (!window._originalSetInterval) {
                window._originalSetInterval = window.setInterval;
                window._originalSetTimeout = window.setTimeout;
                window._activeTimers = new Set();

                // Override setInterval
                window.setInterval = function(fn, delay, ...args) {
                    if (window.animationControlManager && window.animationControlManager.isPaused) {
                        return null;
                    }
                    const id = window._originalSetInterval(fn, delay, ...args);
                    window._activeTimers.add(id);
                    return id;
                };

                // Override setTimeout  
                window.setTimeout = function(fn, delay, ...args) {
                    if (window.animationControlManager && window.animationControlManager.isPaused) {
                        return null;
                    }
                    return window._originalSetTimeout(fn, delay, ...args);
                };
            }
        }

        resumeTimers() {
            // Restore original functions if overridden
            if (window._originalSetInterval) {
                window.setInterval = window._originalSetInterval;
                window.setTimeout = window._originalSetTimeout;
            }
        }

        updateControls() {
            this.controls.forEach(control => {
                const pauseIcon = control.querySelector('.icon-pause');
                const playIcon = control.querySelector('.icon-play');
                
                control.setAttribute('aria-pressed', this.isPaused);
                control.setAttribute('aria-label', 
                    this.isPaused ? 'Play all animations' : 'Pause all animations'
                );

                if (pauseIcon && playIcon) {
                    pauseIcon.style.display = this.isPaused ? 'none' : 'inline';
                    playIcon.style.display = this.isPaused ? 'inline' : 'none';
                }
            });
        }

        registerExistingControls() {
            // Find all existing animation toggle buttons
            const existingControls = document.querySelectorAll('.btn-animation-toggle');
            existingControls.forEach(control => {
                if (!this.controls.includes(control)) {
                    this.controls.push(control);
                    control.addEventListener('click', () => this.toggleAnimations());
                }
            });
        }

        announceChange() {
            // Create announcement for screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'visually-hidden';
            announcement.textContent = this.isPaused ? 
                'All animations have been paused' : 
                'All animations have been resumed';
            
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        }

        listenForPreferenceChanges() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            prefersReducedMotion.addEventListener('change', (e) => {
                if (e.matches) {
                    this.isPaused = true;
                    this.saveState();
                    this.applyState();
                    this.updateControls();
                }
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimationControls);
    } else {
        initAnimationControls();
    }

    function initAnimationControls() {
        // Create global instance
        window.animationControlManager = new AnimationControlManager();

        // Make it available to other scripts
        window.pauseAllAnimations = () => {
            if (window.animationControlManager && !window.animationControlManager.isPaused) {
                window.animationControlManager.toggleAnimations();
            }
        };

        window.resumeAllAnimations = () => {
            if (window.animationControlManager && window.animationControlManager.isPaused) {
                window.animationControlManager.toggleAnimations();
            }
        };
    }

})();