/**
 * Zara's Icon Choreography System
 * Orchestrating visual narratives through icons
 */

class IconChoreographer {
  constructor() {
    this.iconStories = new Map();
    this.scrollProgress = 0;
    this.init();
  }

  init() {
    this.setupIconReveals();
    this.createIconNarratives();
    this.initIconMorphing();
    this.setupProgressIcons();
    this.createIconTrails();
    this.initIconSymphony();
  }

  setupIconReveals() {
    const revealIcons = document.querySelectorAll('.icon-reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
            this.celebrateReveal(entry.target);
          }, index * 100);
        }
      });
    }, { threshold: 0.5 });

    revealIcons.forEach(icon => observer.observe(icon));
  }

  celebrateReveal(element) {
    element.classList.add('icon-burst', 'celebrate');
    setTimeout(() => {
      element.classList.remove('celebrate');
    }, 1000);
  }

  createIconNarratives() {
    // Water damage story progression
    const waterStory = [
      { icon: 'fa-tint', stage: 'Problem detected' },
      { icon: 'fa-exclamation-triangle', stage: 'Warning signs' },
      { icon: 'fa-phone-alt', stage: 'Call for help' },
      { icon: 'fa-tools', stage: 'Expert arrives' },
      { icon: 'fa-shield-alt', stage: 'Protection installed' },
      { icon: 'fa-check-circle', stage: 'Problem solved' }
    ];

    this.createStorySection('water-story', waterStory);
  }

  createStorySection(id, storyData) {
    const container = document.getElementById(id);
    if (!container) return;

    const storyHTML = storyData.map((item, index) => `
      <div class="icon-story-step" data-step="${index}">
        <div class="icon-story icon-reveal">
          <i class="fas ${item.icon} fa-2x"></i>
        </div>
        <p class="text-sm mt-2">${item.stage}</p>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="icon-symphony">
        ${storyHTML}
      </div>
    `;

    this.animateStory(container);
  }

  animateStory(container) {
    const steps = container.querySelectorAll('.icon-story-step');
    
    steps.forEach((step, index) => {
      step.addEventListener('mouseenter', () => {
        // Highlight current step
        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        
        // Create connection lines
        if (index < steps.length - 1) {
          this.drawConnection(step, steps[index + 1]);
        }
      });
    });
  }

  drawConnection(from, to) {
    const line = document.createElement('div');
    line.className = 'icon-connection';
    
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    
    line.style.cssText = `
      position: absolute;
      height: 2px;
      background: linear-gradient(90deg, #0080ff, #00b4d8);
      transform-origin: left center;
      animation: draw-line 0.5s ease-out forwards;
    `;
    
    from.appendChild(line);
    setTimeout(() => line.remove(), 2000);
  }

  initIconMorphing() {
    // Transform icons based on scroll
    window.addEventListener('scroll', () => {
      this.scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      
      // Morph protection levels
      const protectionIcon = document.querySelector('.protection-morph');
      if (protectionIcon) {
        if (this.scrollProgress < 0.3) {
          this.setIcon(protectionIcon, 'fa-home');
        } else if (this.scrollProgress < 0.6) {
          this.setIcon(protectionIcon, 'fa-shield-alt');
        } else {
          this.setIcon(protectionIcon, 'fa-trophy');
        }
      }
    });
  }

  setIcon(element, iconClass) {
    const icon = element.querySelector('i');
    if (icon && !icon.classList.contains(iconClass)) {
      icon.style.transform = 'scale(0) rotate(180deg)';
      setTimeout(() => {
        icon.className = `fas ${iconClass} fa-2x`;
        icon.style.transform = 'scale(1) rotate(0)';
      }, 300);
    }
  }

  setupProgressIcons() {
    // Create icon-based progress indicators
    const sections = document.querySelectorAll('section[id]');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'icon-progress-tracker';
    
    sections.forEach((section, index) => {
      const progressIcon = this.createProgressIcon(section.id, index);
      progressContainer.appendChild(progressIcon);
    });
    
    document.body.appendChild(progressContainer);
    this.updateProgressIcons();
  }

  createProgressIcon(sectionId, index) {
    const iconMap = {
      'hero': 'fa-home',
      'problems': 'fa-exclamation-circle',
      'solutions': 'fa-tools',
      'testimonials': 'fa-star',
      'contact': 'fa-phone'
    };

    const icon = document.createElement('div');
    icon.className = 'progress-icon';
    icon.innerHTML = `
      <i class="fas ${iconMap[sectionId] || 'fa-circle'} icon-story"></i>
    `;
    
    icon.addEventListener('click', () => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    });
    
    return icon;
  }

  updateProgressIcons() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(document.querySelectorAll('section[id]')).indexOf(entry.target);
          this.activateProgressIcon(index);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
  }

  activateProgressIcon(index) {
    const icons = document.querySelectorAll('.progress-icon');
    icons.forEach((icon, i) => {
      if (i <= index) {
        icon.classList.add('completed');
        icon.querySelector('i').classList.add('icon-glow');
      }
    });
  }

  createIconTrails() {
    // Add trail effects to moving icons
    document.addEventListener('mousemove', (e) => {
      const icons = document.querySelectorAll('.icon-trail');
      icons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
          Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
        );
        
        if (distance < 100) {
          icon.classList.add('active');
          setTimeout(() => icon.classList.remove('active'), 1000);
        }
      });
    });
  }

  initIconSymphony() {
    // Create synchronized icon animations
    const symphonyTriggers = document.querySelectorAll('[data-symphony]');
    
    symphonyTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const symphonyId = trigger.dataset.symphony;
        this.playSymphony(symphonyId);
      });
    });
  }

  playSymphony(id) {
    const sequences = {
      'waterproofing': [
        { icon: 'fa-water', color: '#3b82f6', delay: 0 },
        { icon: 'fa-arrow-right', color: '#60a5fa', delay: 200 },
        { icon: 'fa-shield-alt', color: '#10b981', delay: 400 },
        { icon: 'fa-check', color: '#22c55e', delay: 600 }
      ],
      'emergency': [
        { icon: 'fa-exclamation', color: '#ef4444', delay: 0 },
        { icon: 'fa-phone-alt', color: '#f59e0b', delay: 100 },
        { icon: 'fa-truck', color: '#3b82f6', delay: 200 },
        { icon: 'fa-wrench', color: '#10b981', delay: 300 }
      ]
    };

    const sequence = sequences[id];
    if (!sequence) return;

    const symphony = document.createElement('div');
    symphony.className = 'floating-symphony';
    
    sequence.forEach(item => {
      setTimeout(() => {
        const note = document.createElement('div');
        note.className = 'symphony-note';
        note.innerHTML = `<i class="fas ${item.icon}" style="color: ${item.color}"></i>`;
        symphony.appendChild(note);
        
        setTimeout(() => note.remove(), 2000);
      }, item.delay);
    });
    
    document.body.appendChild(symphony);
    setTimeout(() => symphony.remove(), 3000);
  }
}

// Icon Enhancement Classes
class IconEnhancements {
  constructor() {
    this.enhanceButtons();
    this.createIconBadges();
    this.setupIconTooltips();
  }

  enhanceButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
      const text = btn.textContent.toLowerCase();
      
      // Add contextual icons
      if (text.includes('call')) {
        this.addIcon(btn, 'fa-phone-alt', 'start', 'icon-shake');
      } else if (text.includes('quote')) {
        this.addIcon(btn, 'fa-file-invoice-dollar', 'start', 'icon-bounce');
      } else if (text.includes('emergency')) {
        this.addIcon(btn, 'fa-exclamation-triangle', 'start', 'icon-pulse');
      } else if (text.includes('view') || text.includes('see')) {
        this.addIcon(btn, 'fa-eye', 'end', 'icon-dance');
      }
    });
  }

  addIcon(element, iconClass, position = 'start', animationClass = '') {
    const icon = document.createElement('i');
    icon.className = `fas ${iconClass} ${animationClass}`;
    
    if (position === 'start') {
      element.insertBefore(icon, element.firstChild);
      element.insertBefore(document.createTextNode(' '), icon.nextSibling);
    } else {
      element.appendChild(document.createTextNode(' '));
      element.appendChild(icon);
    }
  }

  createIconBadges() {
    // Add notification badges to icons
    const badgeData = {
      '.emergency-icon': '!',
      '.discount-icon': '%',
      '.new-icon': 'NEW'
    };

    Object.entries(badgeData).forEach(([selector, badge]) => {
      document.querySelectorAll(selector).forEach(icon => {
        icon.classList.add('icon-badge');
        icon.dataset.badge = badge;
      });
    });
  }

  setupIconTooltips() {
    const tooltips = {
      'fa-shield-alt': 'Lifetime Protection',
      'fa-clock': '24/7 Service',
      'fa-dollar-sign': 'Best Price Guarantee',
      'fa-star': 'Top Rated',
      'fa-check-circle': 'Verified & Trusted'
    };

    Object.entries(tooltips).forEach(([iconClass, tooltip]) => {
      document.querySelectorAll(`.${iconClass}`).forEach(icon => {
        icon.setAttribute('title', tooltip);
        icon.classList.add('icon-story');
      });
    });
  }
}

// Icon Loading States
class IconLoaders {
  static show(element) {
    const loader = document.createElement('i');
    loader.className = 'fas fa-spinner icon-spin-custom';
    element.appendChild(loader);
    return loader;
  }

  static hide(loader) {
    loader.classList.replace('fa-spinner', 'fa-check');
    loader.classList.replace('icon-spin-custom', 'icon-bounce');
    setTimeout(() => loader.remove(), 1000);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new IconChoreographer();
  new IconEnhancements();
  
  // Add icon progress tracker styles
  const style = document.createElement('style');
  style.textContent = `
    .icon-progress-tracker {
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .progress-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .progress-icon:hover {
      transform: scale(1.2);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .progress-icon.completed {
      background: #0080ff;
      color: white;
    }
    
    .floating-symphony {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      gap: 20px;
      z-index: 10000;
      pointer-events: none;
    }
    
    .symphony-note {
      font-size: 2rem;
      animation: float-away 2s ease-out forwards;
    }
    
    @keyframes float-away {
      0% {
        opacity: 0;
        transform: translateY(20px) scale(0);
      }
      50% {
        opacity: 1;
        transform: translateY(-20px) scale(1.5);
      }
      100% {
        opacity: 0;
        transform: translateY(-100px) scale(0.5);
      }
    }
    
    @keyframes draw-line {
      from {
        width: 0;
      }
      to {
        width: 100px;
      }
    }
  `;
  document.head.appendChild(style);
});

// Export for global use
window.IconChoreographer = IconChoreographer;
window.IconLoaders = IconLoaders;