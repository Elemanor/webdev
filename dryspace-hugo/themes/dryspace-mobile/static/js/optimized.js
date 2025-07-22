/**
 * Optimized JavaScript - Dr. Sophia Chen's Performance-First Approach
 * Only essential functionality, progressive enhancement
 */

(function() {
  'use strict';

  // Feature detection
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Lazy Loading for Images
   */
  function initLazyLoading() {
    if (!supportsIntersectionObserver) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Animate on Scroll (Progressive Enhancement)
   */
  function initScrollAnimations() {
    if (!supportsIntersectionObserver || prefersReducedMotion) return;

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  }

  /**
   * Form Validation (Accessibility Enhanced)
   */
  function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        // Clear previous errors
        form.querySelectorAll('.is-invalid').forEach(field => {
          field.classList.remove('is-invalid');
        });

        let isValid = true;
        const fields = form.querySelectorAll('[required]');

        fields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
            
            // Add ARIA attributes for screen readers
            field.setAttribute('aria-invalid', 'true');
            const errorId = field.id + '-error';
            field.setAttribute('aria-describedby', errorId);
            
            // Create or update error message
            let errorMsg = document.getElementById(errorId);
            if (!errorMsg) {
              errorMsg = document.createElement('div');
              errorMsg.id = errorId;
              errorMsg.className = 'invalid-feedback';
              errorMsg.setAttribute('role', 'alert');
              field.parentNode.appendChild(errorMsg);
            }
            errorMsg.textContent = `Please provide a valid ${field.getAttribute('placeholder') || 'value'}.`;
          } else {
            field.setAttribute('aria-invalid', 'false');
          }
        });

        if (isValid) {
          // Show success state
          form.classList.add('was-validated');
          
          // In production, submit form data
          console.log('Form submitted successfully');
          
          // Show success message
          showNotification('Thank you! We\'ll contact you within 30 minutes.', 'success');
        }
      });
    });
  }

  /**
   * Notification System
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
      <span>${message}</span>
      <button type="button" class="notification-close" aria-label="Close notification">&times;</button>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto dismiss after 5 seconds
    const autoDismiss = setTimeout(() => {
      dismissNotification(notification);
    }, 5000);

    // Manual dismiss
    notification.querySelector('.notification-close').addEventListener('click', () => {
      clearTimeout(autoDismiss);
      dismissNotification(notification);
    });
  }

  function dismissNotification(notification) {
    notification.classList.remove('show');
    notification.addEventListener('transitionend', () => {
      notification.remove();
    });
  }

  /**
   * Performance Monitoring
   */
  function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
          
          // Send to analytics if needed
          if (window.ga) {
            window.ga('send', 'event', 'Performance', 'LCP', Math.round(lastEntry.startTime));
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      // Monitor First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const delay = entry.processingStart - entry.startTime;
            console.log('FID:', delay);
            
            if (window.ga) {
              window.ga('send', 'event', 'Performance', 'FID', Math.round(delay));
            }
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID not supported
      }
    }
  }

  /**
   * Mobile Menu Toggle
   */
  function initMobileMenu() {
    const toggler = document.querySelector('.navbar-toggler');
    const navCollapse = document.querySelector('#navbarNav');
    
    if (toggler && navCollapse) {
      toggler.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navCollapse.classList.toggle('show');
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!toggler.contains(e.target) && !navCollapse.contains(e.target)) {
          toggler.setAttribute('aria-expanded', 'false');
          navCollapse.classList.remove('show');
        }
      });
    }
  }

  /**
   * Optimize Third-Party Scripts
   */
  function loadThirdPartyScripts() {
    // Load Google Analytics after interaction
    if (window.ga) {
      ['scroll', 'click', 'touchstart'].forEach(event => {
        window.addEventListener(event, function loadGA() {
          window.removeEventListener(event, loadGA);
          
          // Load Google Analytics
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.google-analytics.com/analytics.js';
          document.head.appendChild(script);
        }, { once: true, passive: true });
      });
    }
  }

  /**
   * Initialize Everything
   */
  function init() {
    // Critical functionality
    initMobileMenu();
    initFormValidation();
    
    // Progressive enhancements
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initLazyLoading();
        initScrollAnimations();
        loadThirdPartyScripts();
      });
    } else {
      initLazyLoading();
      initScrollAnimations();
      loadThirdPartyScripts();
    }
    
    // Performance monitoring
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initPerformanceMonitoring();
      });
    } else {
      setTimeout(initPerformanceMonitoring, 1);
    }
  }

  // Start the app
  init();

  // Expose API for other scripts
  window.DryspaceApp = {
    showNotification: showNotification,
    init: init
  };
})();

// Add notification styles
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 350px;
    padding: 16px 20px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translateX(400px);
    transition: transform 0.3s ease-out;
    z-index: 9999;
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification-success {
    border-left: 4px solid #28a745;
  }
  
  .notification-error {
    border-left: 4px solid #dc3545;
  }
  
  .notification-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    margin-left: 12px;
    padding: 0;
    color: #666;
  }
  
  @media (max-width: 768px) {
    .notification {
      left: 10px;
      right: 10px;
      max-width: none;
    }
  }
`;
document.head.appendChild(style);