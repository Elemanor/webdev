/**
 * Maya's Scroll Engagement System
 * Creates visual breadcrumbs that make scrolling irresistible
 */

class ScrollEngagement {
  constructor() {
    this.sections = [];
    this.currentSection = 0;
    this.scrollThreshold = 0.7;
    this.init();
  }

  init() {
    this.setupSections();
    this.createScrollRewards();
    this.setupIntersectionObservers();
    this.addSectionTeasers();
    this.initSmoothReveal();
    this.trackScrollVelocity();
  }

  setupSections() {
    this.sections = Array.from(document.querySelectorAll('section[id]'));
    this.sections.forEach((section, index) => {
      section.classList.add('momentum-section');
      section.dataset.sectionIndex = index;
    });
  }

  createScrollRewards() {
    const rewardContainer = document.createElement('div');
    rewardContainer.className = 'scroll-reward';
    
    this.sections.forEach((section, index) => {
      const milestone = document.createElement('div');
      milestone.className = 'milestone';
      milestone.dataset.section = index;
      milestone.onclick = () => this.scrollToSection(index);
      rewardContainer.appendChild(milestone);
    });
    
    document.body.appendChild(rewardContainer);
    
    // Show rewards after initial scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
          rewardContainer.classList.add('active');
        }
      }, 100);
    });
  }

  setupIntersectionObservers() {
    const observerOptions = {
      threshold: [0.1, 0.5, 0.9],
      rootMargin: '-10% 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.sectionIndex);
          
          // Update progress milestones
          if (entry.intersectionRatio > this.scrollThreshold) {
            this.markMilestoneComplete(index);
            this.revealNextTeaser(index);
          }
          
          // Add reveal animations
          entry.target.classList.add('revealed');
          this.animateChildElements(entry.target);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      observer.observe(section);
      section.classList.add('reveal-on-scroll');
    });
  }

  markMilestoneComplete(index) {
    const milestones = document.querySelectorAll('.milestone');
    if (milestones[index]) {
      milestones[index].classList.add('completed');
      
      // Celebrate milestone with micro-animation
      this.celebrateMilestone(index);
    }
  }

  celebrateMilestone(index) {
    const celebration = document.createElement('div');
    celebration.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl z-50';
    celebration.innerHTML = '✨';
    celebration.style.animation = 'zoom-in 0.5s ease-out forwards';
    
    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 1000);
  }

  addSectionTeasers() {
    this.sections.forEach((section, index) => {
      if (index < this.sections.length - 1) {
        const nextSection = this.sections[index + 1];
        const teaser = this.createTeaser(nextSection);
        section.appendChild(teaser);
        section.classList.add('section-teaser');
      }
    });
  }

  createTeaser(nextSection) {
    const teaser = document.createElement('div');
    teaser.className = 'next-section-preview opacity-0 transition-opacity duration-500';
    
    const teaserText = this.getTeaserText(nextSection.id);
    teaser.innerHTML = `
      <i class="fas fa-chevron-down mr-2 animate-bounce"></i>
      ${teaserText}
      <i class="fas fa-chevron-down ml-2 animate-bounce"></i>
    `;
    
    teaser.onclick = () => {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    return teaser;
  }

  getTeaserText(sectionId) {
    const teasers = {
      'pricing': '💰 See transparent pricing',
      'faq': '❓ Get answers instantly',
      'diagnostics': '🔍 Check your risk level',
      'resources': '📚 Free expert guides',
      'portfolio': '🏆 View success stories',
      'videos': '📹 Watch us in action',
      'media': '📺 As seen on TV'
    };
    
    return teasers[sectionId] || 'Discover more below';
  }

  revealNextTeaser(currentIndex) {
    const currentSection = this.sections[currentIndex];
    const teaser = currentSection.querySelector('.next-section-preview');
    
    if (teaser) {
      setTimeout(() => {
        teaser.classList.remove('opacity-0');
        teaser.classList.add('animate__animated', 'animate__fadeInUp');
      }, 500);
    }
  }

  animateChildElements(section) {
    const elements = section.querySelectorAll('[data-animation-child]');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate__animated', 'animate__fadeInUp');
      }, index * 100);
    });
  }

  scrollToSection(index) {
    if (this.sections[index]) {
      this.sections[index].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  initSmoothReveal() {
    // Add smooth reveal to all cards
    const cards = document.querySelectorAll('.card, .glass-card');
    cards.forEach(card => {
      card.classList.add('reveal-on-scroll');
    });
  }

  trackScrollVelocity() {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    
    window.addEventListener('scroll', () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      const timeDiff = currentTime - lastTime;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY);
      
      const velocity = scrollDiff / timeDiff * 1000;
      
      // Adjust animations based on scroll speed
      if (velocity > 1000) {
        document.body.classList.add('fast-scroll');
      } else {
        document.body.classList.remove('fast-scroll');
      }
      
      lastScrollY = currentScrollY;
      lastTime = currentTime;
    });
  }
}

// Visual Delight Interactions
class VisualDelight {
  constructor() {
    this.init();
  }

  init() {
    this.setupMagneticButtons();
    this.setupDepthCards();
    this.setupShineEffects();
    this.setupParallaxElements();
  }

  setupMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-gradient-primary, .btn-gradient-urgent');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  setupDepthCards() {
    const cards = document.querySelectorAll('.problem-card-enhanced');
    
    cards.forEach(card => {
      card.classList.add('depth-card');
      
      card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
      });
      
      card.addEventListener('mouseleave', () => {
        setTimeout(() => {
          card.style.zIndex = '';
        }, 300);
      });
    });
  }

  setupShineEffects() {
    const shineElements = document.querySelectorAll('.shine-effect');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('shine-active');
        }
      });
    });
    
    shineElements.forEach(el => observer.observe(el));
  }

  setupParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
}

// Trust Building Animations
class TrustBuilder {
  constructor() {
    this.init();
  }

  init() {
    this.animateCounters();
    this.setupTestimonialCarousel();
    this.createTrustPulse();
  }

  animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          this.countUp(entry.target);
          entry.target.classList.add('counted');
        }
      });
    });
    
    counters.forEach(counter => observer.observe(counter));
  }

  countUp(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        element.classList.add('animate__animated', 'animate__pulse');
      }
      
      if (element.dataset.target.includes('.')) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }

  setupTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    setInterval(() => {
      testimonials[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % testimonials.length;
      testimonials[currentIndex].classList.add('active');
    }, 5000);
  }

  createTrustPulse() {
    const trustBadges = document.querySelectorAll('.trust-badge, .trust-indicator');
    
    trustBadges.forEach((badge, index) => {
      badge.style.animationDelay = `${index * 0.2}s`;
    });
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ScrollEngagement();
  new VisualDelight();
  new TrustBuilder();
  
  // Add progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-indicator';
  progressBar.innerHTML = '<div class="progress-bar"></div>';
  document.body.appendChild(progressBar);
  
  // Update progress on scroll
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.querySelector('.progress-bar').style.width = scrolled + '%';
  });
});