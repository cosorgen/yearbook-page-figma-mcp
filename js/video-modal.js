/**
 * Video Modal Module
 * Provides lightbox functionality for video content with accessibility support
 */

class VideoModal {
  constructor() {
    this.modal = document.getElementById('video-modal');
    this.backdrop = this.modal?.querySelector('.video-modal__backdrop');
    this.closeButton = this.modal?.querySelector('.video-modal__close');
    this.video = this.modal?.querySelector('.video-modal__video');
    this.title = this.modal?.querySelector('.video-modal__title');
    this.isOpen = false;
    this.previousFocus = null;

    this.init();
  }

  init() {
    if (!this.modal) {
      console.warn('Video modal not found');
      return;
    }

    // Add event listeners for project card buttons
    this.setupProjectCardListeners();

    // Add modal event listeners
    this.setupModalListeners();
  }

  setupProjectCardListeners() {
    // Find all project card buttons with video data
    const videoButtons = document.querySelectorAll('[data-video]');

    videoButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const videoId = button.getAttribute('data-video');
        const title =
          button.querySelector('.project-card__title')?.textContent || 'Video';
        this.openModal(videoId, title);
      });
    });
  }

  setupModalListeners() {
    // Close button
    this.closeButton?.addEventListener('click', () => {
      this.closeModal();
    });

    // Backdrop click
    this.backdrop?.addEventListener('click', () => {
      this.closeModal();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (this.isOpen) {
        if (e.key === 'Escape') {
          this.closeModal();
        } else if (e.key === 'Tab') {
          this.handleTabNavigation(e);
        }
      }
    });

    // Prevent clicks on modal container from closing modal
    this.modal
      ?.querySelector('.video-modal__container')
      ?.addEventListener('click', (e) => {
        e.stopPropagation();
      });
  }

  openModal(videoId, title) {
    if (!this.modal || !this.video) return;

    // Store current focus to restore later
    this.previousFocus = document.activeElement;

    // Set video source based on videoId
    this.setVideoSource(videoId);

    // Set title
    if (this.title) {
      this.title.textContent = title;
    }

    // Show modal
    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus management
    setTimeout(() => {
      this.closeButton?.focus();
    }, 100);

    // Announce to screen readers
    this.announceModalOpen(title);
  }

  closeModal() {
    if (!this.modal || !this.video) return;

    // Pause and reset video
    this.video.pause();
    this.video.currentTime = 0;

    // Hide modal
    this.modal.setAttribute('aria-hidden', 'true');
    this.isOpen = false;

    // Restore body scroll
    document.body.style.overflow = '';

    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
      this.previousFocus = null;
    }

    // Announce to screen readers
    this.announceModalClose();
  }

  setVideoSource(videoId) {
    if (!this.video) return;

    // Map video IDs to file paths
    const videoSources = {
      'parties-edge': 'videos/parties-in-edge.mp4',
    };

    const videoSrc = videoSources[videoId];
    if (videoSrc) {
      // Update all source elements
      const sources = this.video.querySelectorAll('source');
      sources.forEach((source) => {
        source.src = videoSrc;
      });

      // Update video src as fallback
      this.video.src = videoSrc;

      // Load the video
      this.video.load();
    }
  }

  handleTabNavigation(e) {
    if (!this.modal || !this.isOpen) return;

    // Get all focusable elements within modal
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Trap focus within modal
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }

  announceModalOpen(title) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${title} video modal opened. Press Escape to close.`;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  announceModalClose() {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Video modal closed.';

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  // Public method to open modal programmatically
  open(videoId, title) {
    this.openModal(videoId, title);
  }

  // Public method to close modal programmatically
  close() {
    this.closeModal();
  }

  // Public method to check if modal is open
  get isModalOpen() {
    return this.isOpen;
  }
}

// Initialize video modal when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new VideoModal();
  });
} else {
  new VideoModal();
}

// Export for potential use by other modules
export default VideoModal;
