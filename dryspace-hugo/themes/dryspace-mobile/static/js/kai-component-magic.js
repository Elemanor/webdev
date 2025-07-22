/**
 * Kai's Component Magic System
 * Makes DaisyUI components irresistibly interactive
 */

class ComponentMagic {
  constructor() {
    this.initializeComponents();
    this.setupThemeToggle();
    this.enhanceCards();
    this.createInteractiveStats();
    this.setupProgressiveReveals();
    this.initializeToasts();
  }

  initializeComponents() {
    // Add component cascade to all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const components = section.querySelectorAll('.card, .stat, .btn, .badge');
      if (components.length > 0) {
        section.classList.add('component-cascade');
      }
    });

    // Setup intersection observer for reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.animateComponentsInSection(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.component-cascade').forEach(section => {
      observer.observe(section);
    });
  }

  animateComponentsInSection(section) {
    const stats = section.querySelectorAll('.stat-value');
    stats.forEach(stat => {
      if (!stat.classList.contains('animated')) {
        this.animateValue(stat);
        stat.classList.add('animated');
      }
    });
  }

  animateValue(element) {
    const value = element.textContent;
    const isNumber = /^\d+/.test(value);
    
    if (isNumber) {
      const number = parseInt(value.match(/\d+/)[0]);
      const suffix = value.replace(/^\d+/, '');
      let current = 0;
      const increment = number / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
          current = number;
          clearInterval(timer);
          element.classList.add('stat-value-animated');
        }
        element.textContent = Math.floor(current) + suffix;
      }, 30);
    }
  }

  setupThemeToggle() {
    // Create theme toggle if it doesn't exist
    const header = document.querySelector('nav') || document.querySelector('header');
    if (header && !document.querySelector('.theme-toggle')) {
      const themeToggle = this.createThemeToggle();
      header.appendChild(themeToggle);
    }
  }

  createThemeToggle() {
    const toggle = document.createElement('label');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = `
      <input type="checkbox" class="theme-controller" value="waterproofDark" />
      <svg class="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
      </svg>
      <svg class="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
      </svg>
    `;

    // Handle theme switching
    toggle.querySelector('input').addEventListener('change', (e) => {
      const theme = e.target.checked ? 'waterproofDark' : 'waterproof';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.showThemeToast(theme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'waterproof';
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggle.querySelector('input').checked = savedTheme === 'waterproofDark';

    return toggle;
  }

  showThemeToast(theme) {
    const toast = document.createElement('div');
    toast.className = 'toast-kai toast-top toast-end';
    toast.innerHTML = `
      <div class="alert alert-info">
        <span>${theme === 'waterproofDark' ? '🌙 Dark mode activated' : '☀️ Light mode activated'}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  enhanceCards() {
    // Add interactive classes to all cards
    document.querySelectorAll('.card').forEach((card, index) => {
      card.classList.add('card-interactive');
      
      // Add floating animation to featured cards
      if (card.closest('.hero-section') || index < 3) {
        card.classList.add('card-float');
        card.style.animationDelay = `${index * 0.5}s`;
      }

      // Add click feedback
      card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
          card.style.transform = '';
        }, 200);
      });
    });
  }

  createInteractiveStats() {
    // Convert number displays to DaisyUI stats
    const statContainers = document.querySelectorAll('.counter').forEach(counter => {
      const parent = counter.parentElement;
      if (!parent.classList.contains('stat')) {
        const statHtml = `
          <div class="stat-interactive">
            <div class="stat-figure text-primary">
              <i class="fas fa-chart-line text-3xl"></i>
            </div>
            <div class="stat-title">${parent.textContent.replace(counter.textContent, '').trim()}</div>
            <div class="stat-value">${counter.dataset.target || counter.textContent}</div>
            <div class="stat-desc">↗︎ Verified & Growing</div>
          </div>
        `;
        
        const statElement = document.createElement('div');
        statElement.className = 'stats shadow';
        statElement.innerHTML = statHtml;
        
        parent.replaceWith(statElement);
      }
    });
  }

  setupProgressiveReveals() {
    // Create a loading skeleton for images
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-shimmer';
        skeleton.style.width = img.width + 'px';
        skeleton.style.height = img.height + 'px';
        
        img.style.display = 'none';
        img.parentNode.insertBefore(skeleton, img);
        
        img.onload = () => {
          skeleton.remove();
          img.style.display = '';
          img.classList.add('animate__animated', 'animate__fadeIn');
        };
      }
    });
  }

  initializeToasts() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast')) {
      const toastContainer = document.createElement('div');
      toastContainer.className = 'toast toast-top toast-end';
      document.body.appendChild(toastContainer);
    }
  }
}

// Interactive Button Enhancement
class ButtonMagic {
  constructor() {
    this.enhanceButtons();
    this.createRippleEffect();
  }

  enhanceButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.classList.add('btn-kai');
      
      // Add loading state on click for primary buttons
      if (btn.classList.contains('btn-primary')) {
        btn.addEventListener('click', (e) => {
          if (btn.tagName === 'A') return; // Skip for links
          
          btn.classList.add('loading');
          setTimeout(() => {
            btn.classList.remove('loading');
          }, 2000);
        });
      }
    });
  }

  createRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
}

// Tab Enhancement
class TabMagic {
  constructor() {
    this.enhanceTabs();
  }

  enhanceTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
      container.classList.add('tabs-kai');
      const tabs = container.querySelectorAll('.tab');
      
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          // Update sliding indicator
          const width = tab.offsetWidth;
          const left = tab.offsetLeft;
          
          container.style.setProperty('--tab-width', width + 'px');
          container.style.setProperty('--tab-left', left + 'px');
          
          // Update active state
          tabs.forEach(t => t.classList.remove('tab-active'));
          tab.classList.add('tab-active');
        });
      });
      
      // Initialize first tab
      if (tabs[0]) {
        tabs[0].click();
      }
    });
  }
}

// Alert System
class AlertMagic {
  static show(message, type = 'info') {
    const alertHtml = `
      <div class="alert alert-${type} alert-slide-in shadow-lg">
        <div>
          <span>${message}</span>
        </div>
        <div class="flex-none">
          <button class="btn btn-sm btn-ghost">✕</button>
        </div>
      </div>
    `;
    
    const container = document.querySelector('.toast') || document.body;
    const alertElement = document.createElement('div');
    alertElement.innerHTML = alertHtml;
    container.appendChild(alertElement.firstElementChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      alertElement.remove();
    }, 5000);
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ComponentMagic();
  new ButtonMagic();
  new TabMagic();
  
  // Show welcome message
  setTimeout(() => {
    AlertMagic.show('👋 Welcome! Explore our waterproofing solutions below', 'success');
  }, 1000);
});

// Expose AlertMagic globally for use in forms
window.AlertMagic = AlertMagic;