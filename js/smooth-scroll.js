/**
 * Smooth Scroll Module
 * Provides enhanced smooth scrolling for in-page navigation with fallbacks
 */

class SmoothScroll {
  constructor() {
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    this.init();
  }

  init() {
    // Only enhance if CSS smooth scrolling isn't already working
    if (!this.supportsCSSSmooth()) {
      this.enhanceScrolling();
    }

    // Add enhanced focus management for skip links
    this.enhanceSkipLinks();
  }

  supportsCSSSmooth() {
    // Check if browser supports CSS scroll-behavior
    const testElement = document.createElement('div');
    testElement.style.scrollBehavior = 'smooth';
    return testElement.style.scrollBehavior === 'smooth';
  }

  enhanceScrolling() {
    // Add smooth scrolling to internal anchor links
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href === '#') return;

      const targetElement = document.querySelector(href);
      if (!targetElement) return;

      // Prevent default link behavior
      e.preventDefault();

      // Scroll to target with smooth animation (if motion not reduced)
      this.scrollToElement(targetElement);
    });
  }

  scrollToElement(element, offset = 0) {
    if (!element) return;

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    // Use native smooth scroll if available and motion not reduced
    if ('scrollTo' in window && !this.prefersReducedMotion.matches) {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      // Fallback to instant scroll
      window.scrollTo(0, offsetPosition);
    }

    // Manage focus for accessibility
    this.manageFocus(element);
  }

  manageFocus(element) {
    // Set focus to the target element for screen readers
    const originalTabIndex = element.getAttribute('tabindex');

    // Make element focusable if it isn't already
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '-1');
    }

    // Focus the element
    element.focus();

    // Restore original tabindex after focus
    element.addEventListener(
      'blur',
      () => {
        if (originalTabIndex === null) {
          element.removeAttribute('tabindex');
        } else {
          element.setAttribute('tabindex', originalTabIndex);
        }
      },
      { once: true }
    );
  }

  enhanceSkipLinks() {
    // Enhance skip to main content functionality
    const skipLinks = document.querySelectorAll('a[href="#main"], .skip-link');

    skipLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const mainContent = document.querySelector(
          '#main, main, [role="main"]'
        );
        if (mainContent) {
          this.scrollToElement(mainContent, 20); // Small offset for visibility
        }
      });
    });
  }

  // Public method to scroll to any element by selector
  scrollTo(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
      this.scrollToElement(element, offset);
    }
  }

  // Public method to add offset for sticky headers
  setScrollOffset(offset) {
    this.scrollOffset = offset;
  }
}

// Enhanced intersection observer for fade-in animations
class ScrollAnimations {
  constructor() {
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    this.init();
  }

  init() {
    // Only add animations if motion is not reduced
    if (this.prefersReducedMotion.matches) {
      return;
    }

    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    // Options for the intersection observer
    const options = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger when 10% from bottom of viewport
      threshold: 0.1,
    };

    // Create the observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateIn(entry.target);
          this.observer.unobserve(entry.target); // Only animate once
        }
      });
    }, options);

    // Observe elements that should animate in
    this.observeElements();
  }

  observeElements() {
    const elementsToAnimate = document.querySelectorAll(
      '.project-card, .signature-card, .profile-card'
    );

    elementsToAnimate.forEach((el, index) => {
      // Add initial hidden state
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease ${
        index * 0.1
      }s, transform 0.6s ease ${index * 0.1}s`;

      this.observer.observe(el);
    });
  }

  animateIn(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  // Clean up method
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize modules when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SmoothScroll();
    new ScrollAnimations();
  });
} else {
  new SmoothScroll();
  new ScrollAnimations();
}

// Export for potential use by other modules
export { SmoothScroll, ScrollAnimations };
