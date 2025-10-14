/**
 * Theme Toggle Module
 * Provides light/dark/high-contrast theme switching with localStorage persistence
 */

class ThemeToggle {
  constructor() {
    this.themes = ['system', 'light', 'dark', 'high-contrast'];
    this.currentTheme = this.getStoredTheme() || 'system';
    this.button = document.getElementById('theme-toggle');
    this.icon = document.querySelector('.theme-toggle__icon');
    this.label = document.querySelector('.theme-toggle__label');

    this.init();
  }

  init() {
    if (!this.button) {
      console.warn('Theme toggle button not found');
      return;
    }

    // Apply initial theme
    this.applyTheme(this.currentTheme);
    this.updateButton();

    // Add event listener
    this.button.addEventListener('click', () => {
      this.cycleTheme();
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          if (this.currentTheme === 'system') {
            this.applyTheme('system');
          }
        });

      window
        .matchMedia('(prefers-contrast: more)')
        .addEventListener('change', () => {
          if (this.currentTheme === 'system') {
            this.applyTheme('system');
          }
        });
    }

    // Add keyboard support
    this.button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.cycleTheme();
      }
    });
  }

  getStoredTheme() {
    try {
      return localStorage.getItem('yearbook-theme');
    } catch (error) {
      console.warn('localStorage not available:', error);
      return null;
    }
  }

  storeTheme(theme) {
    try {
      localStorage.setItem('yearbook-theme', theme);
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }

  getSystemTheme() {
    if (!window.matchMedia) return 'light';

    if (window.matchMedia('(prefers-contrast: more)').matches) {
      return 'high-contrast';
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  applyTheme(theme) {
    const root = document.documentElement;

    // Remove existing theme attributes
    root.removeAttribute('data-theme');

    if (theme === 'system') {
      const systemTheme = this.getSystemTheme();
      if (systemTheme !== 'light') {
        root.setAttribute('data-theme', systemTheme);
      }
    } else if (theme !== 'light') {
      root.setAttribute('data-theme', theme);
    }

    // Update meta theme-color
    this.updateThemeColor(theme === 'system' ? this.getSystemTheme() : theme);
  }

  updateThemeColor(resolvedTheme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        light: '#e9e6e1',
        dark: '#0f1115',
        'high-contrast': '#000000',
      };
      metaThemeColor.setAttribute(
        'content',
        colors[resolvedTheme] || colors.light
      );
    }
  }

  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.currentTheme = this.themes[nextIndex];

    this.applyTheme(this.currentTheme);
    this.storeTheme(this.currentTheme);
    this.updateButton();

    // Announce theme change to screen readers
    this.announceThemeChange();
  }

  updateButton() {
    if (!this.button || !this.label) return;

    const labels = {
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      'high-contrast': 'High Contrast',
    };

    const icons = {
      system: '🔄',
      light: '☀️',
      dark: '🌙',
      'high-contrast': '⚫',
    };

    this.label.textContent = labels[this.currentTheme];

    // Update aria-label for better accessibility
    this.button.setAttribute(
      'aria-label',
      `Current theme: ${labels[this.currentTheme]}. Click to cycle themes.`
    );

    // Update icon if we have one
    if (this.icon) {
      this.icon.textContent = icons[this.currentTheme];
    }
  }

  announceThemeChange() {
    // Create a temporary element to announce theme changes to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';

    const labels = {
      system: 'System theme activated',
      light: 'Light theme activated',
      dark: 'Dark theme activated',
      'high-contrast': 'High contrast theme activated',
    };

    announcement.textContent = labels[this.currentTheme];
    document.body.appendChild(announcement);

    // Remove the announcement after a short delay
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Public method to set theme programmatically
  setTheme(theme) {
    if (this.themes.includes(theme)) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.storeTheme(theme);
      this.updateButton();
    }
  }
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
  });
} else {
  new ThemeToggle();
}

// Export for potential use by other modules
export default ThemeToggle;
