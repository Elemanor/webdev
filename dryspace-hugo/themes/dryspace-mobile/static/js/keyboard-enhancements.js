/**
 * Keyboard Navigation Enhancements
 * Dr. Amara Johnson-Liu's Implementation
 * 
 * Improves keyboard navigation throughout the site
 */

(function() {
    'use strict';

    // Keyboard Navigation Manager
    class KeyboardNavigationManager {
        constructor() {
            this.focusableElements = 'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
            this.currentFocus = null;
            this.init();
        }

        init() {
            // Add keyboard event listeners
            this.setupKeyboardListeners();
            
            // Enhance focus management
            this.enhanceFocusManagement();
            
            // Setup roving tabindex for groups
            this.setupRovingTabindex();
            
            // Add keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Enhance modal focus trapping
            this.enhanceModalFocus();
        }

        setupKeyboardListeners() {
            // Global keyboard navigation
            document.addEventListener('keydown', (e) => {
                // Skip navigation with '1' key
                if (e.key === '1' && !this.isTyping(e)) {
                    e.preventDefault();
                    this.skipToMain();
                }
                
                // Navigate to search with '/' key
                if (e.key === '/' && !this.isTyping(e)) {
                    e.preventDefault();
                    this.focusSearch();
                }
                
                // Close modals/dropdowns with Escape
                if (e.key === 'Escape') {
                    this.closeOpenElements();
                }
            });
        }

        isTyping(event) {
            const tagName = event.target.tagName.toLowerCase();
            return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
        }

        skipToMain() {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Announce to screen readers
                this.announce('Skipped to main content');
            }
        }

        focusSearch() {
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
            if (searchInput) {
                searchInput.focus();
                this.announce('Search field focused');
            }
        }

        closeOpenElements() {
            // Close dropdowns
            const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
            openDropdowns.forEach(dropdown => {
                const toggle = dropdown.previousElementSibling;
                if (toggle) {
                    toggle.click();
                }
            });
            
            // Close modals
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const closeBtn = modal.querySelector('[data-bs-dismiss="modal"]');
                if (closeBtn) {
                    closeBtn.click();
                }
            });
        }

        enhanceFocusManagement() {
            // Track focus for better management
            document.addEventListener('focusin', (e) => {
                this.currentFocus = e.target;
                
                // Ensure focus is visible
                if (!this.isElementInViewport(e.target)) {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            
            // Add focus indicators for mouse users
            let mouseClick = false;
            document.addEventListener('mousedown', () => mouseClick = true);
            document.addEventListener('keydown', () => mouseClick = false);
            
            document.addEventListener('focusin', (e) => {
                if (mouseClick) {
                    e.target.classList.add('focus-mouse');
                } else {
                    e.target.classList.remove('focus-mouse');
                }
            });
        }

        setupRovingTabindex() {
            // Find all navigation groups
            const navGroups = document.querySelectorAll('[role="navigation"] ul, .btn-group, .nav-tabs');
            
            navGroups.forEach(group => {
                const items = group.querySelectorAll('li, button, a');
                if (items.length === 0) return;
                
                // Set initial tabindex
                items.forEach((item, index) => {
                    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
                });
                
                // Handle arrow key navigation
                group.addEventListener('keydown', (e) => {
                    const currentItem = e.target.closest('li, button, a');
                    if (!currentItem) return;
                    
                    const itemsArray = Array.from(items);
                    const currentIndex = itemsArray.indexOf(currentItem);
                    let nextIndex = currentIndex;
                    
                    switch(e.key) {
                        case 'ArrowRight':
                        case 'ArrowDown':
                            e.preventDefault();
                            nextIndex = (currentIndex + 1) % items.length;
                            break;
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            e.preventDefault();
                            nextIndex = (currentIndex - 1 + items.length) % items.length;
                            break;
                        case 'Home':
                            e.preventDefault();
                            nextIndex = 0;
                            break;
                        case 'End':
                            e.preventDefault();
                            nextIndex = items.length - 1;
                            break;
                        default:
                            return;
                    }
                    
                    // Update tabindex and focus
                    items[currentIndex].setAttribute('tabindex', '-1');
                    items[nextIndex].setAttribute('tabindex', '0');
                    items[nextIndex].focus();
                });
            });
        }

        setupKeyboardShortcuts() {
            // Create shortcuts help
            const shortcuts = {
                '1': 'Skip to main content',
                '/': 'Focus search',
                'Escape': 'Close open menus/modals',
                '?': 'Show keyboard shortcuts',
                'Alt + C': 'Contact us',
                'Alt + H': 'Go to homepage'
            };
            
            // Show shortcuts with '?'
            document.addEventListener('keydown', (e) => {
                if (e.key === '?' && !this.isTyping(e)) {
                    e.preventDefault();
                    this.showKeyboardShortcuts(shortcuts);
                }
                
                // Alt + C for contact
                if (e.altKey && e.key === 'c') {
                    e.preventDefault();
                    window.location.href = '/contact/';
                }
                
                // Alt + H for home
                if (e.altKey && e.key === 'h') {
                    e.preventDefault();
                    window.location.href = '/';
                }
            });
        }

        showKeyboardShortcuts(shortcuts) {
            // Create shortcuts modal
            const modal = document.createElement('div');
            modal.className = 'keyboard-shortcuts-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-label', 'Keyboard shortcuts');
            modal.innerHTML = `
                <div class="shortcuts-content">
                    <h2>Keyboard Shortcuts</h2>
                    <button type="button" class="close-shortcuts" aria-label="Close shortcuts">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                    <dl>
                        ${Object.entries(shortcuts).map(([key, desc]) => `
                            <dt><kbd>${key}</kbd></dt>
                            <dd>${desc}</dd>
                        `).join('')}
                    </dl>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Focus management
            const closeBtn = modal.querySelector('.close-shortcuts');
            const previousFocus = document.activeElement;
            closeBtn.focus();
            
            // Close handlers
            const closeModal = () => {
                modal.remove();
                previousFocus.focus();
            };
            
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            // Trap focus
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeModal();
                }
                
                if (e.key === 'Tab') {
                    e.preventDefault();
                    closeBtn.focus();
                }
            });
        }

        enhanceModalFocus() {
            // Bootstrap modal focus trap enhancement
            document.addEventListener('shown.bs.modal', (e) => {
                const modal = e.target;
                const focusableContent = modal.querySelectorAll(this.focusableElements);
                const firstFocusable = focusableContent[0];
                const lastFocusable = focusableContent[focusableContent.length - 1];
                
                // Focus first element
                if (firstFocusable) {
                    firstFocusable.focus();
                }
                
                // Trap focus
                modal.addEventListener('keydown', (event) => {
                    if (event.key === 'Tab') {
                        if (event.shiftKey) {
                            if (document.activeElement === firstFocusable) {
                                event.preventDefault();
                                lastFocusable.focus();
                            }
                        } else {
                            if (document.activeElement === lastFocusable) {
                                event.preventDefault();
                                firstFocusable.focus();
                            }
                        }
                    }
                });
            });
        }

        isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        announce(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'visually-hidden';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKeyboardEnhancements);
    } else {
        initKeyboardEnhancements();
    }

    function initKeyboardEnhancements() {
        window.keyboardNavigationManager = new KeyboardNavigationManager();
    }

})();

// CSS for keyboard shortcuts modal
const style = document.createElement('style');
style.textContent = `
.keyboard-shortcuts-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.shortcuts-content {
    background: white;
    border-radius: 0.5rem;
    padding: 2rem;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
}

.shortcuts-content h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
}

.close-shortcuts {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
}

.close-shortcuts:hover,
.close-shortcuts:focus {
    background: rgba(0, 0, 0, 0.1);
}

.close-shortcuts:focus-visible {
    outline: 3px solid #0080ff;
    outline-offset: 2px;
}

.shortcuts-content dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem 1rem;
    margin: 0;
}

.shortcuts-content dt {
    text-align: right;
}

.shortcuts-content dd {
    margin: 0;
}

kbd {
    background: #f4f4f4;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    padding: 0.125rem 0.5rem;
    font-family: monospace;
    font-size: 0.875rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Focus styles for mouse vs keyboard */
.focus-mouse:focus-visible {
    outline: none !important;
}

@media (prefers-reduced-motion: reduce) {
    * {
        scroll-behavior: auto !important;
    }
}
`;
document.head.appendChild(style);