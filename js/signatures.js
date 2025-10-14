/**
 * Signatures functionality with Supabase integration
 */

// Supabase configuration
const SUPABASE_URL = 'https://nsekyszlngwopwraffow.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZWt5c3psbmd3b3B3cmFmZm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTE0MDQsImV4cCI6MjA3NDIyNzQwNH0.ZLn0PQN7xNkXUkLt4uqBXbmFmoto5lYso0lvQI-sN6c';

// Initialize Supabase client (will be loaded from CDN)
let supabase;

/**
 * Initialize Supabase client and load signatures
 */
async function initializeSignatures() {
  try {
    // Check if Supabase is available
    if (!window.supabase) {
      throw new Error('Supabase library not loaded');
    }

    // Initialize Supabase client
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    if (!supabase) {
      throw new Error('Failed to create Supabase client');
    }

    console.log('Supabase client created successfully');

    // Load existing signatures
    await loadSignatures();

    // Set up form submission
    setupSignatureForm();

    // Set up modal functionality
    setupSignatureModal();

    console.log('Signatures initialized successfully');
  } catch (error) {
    console.error('Failed to initialize signatures:', error);
    displayError(
      'Failed to load signatures. Please refresh the page and try again.'
    );
  }
}

/**
 * Load signatures from Supabase and display them
 */
async function loadSignatures() {
  try {
    const { data: signatures, error } = await supabase
      .from('signatures')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    displaySignatures(signatures);
  } catch (error) {
    console.error('Error loading signatures:', error);
    displayError('Could not load signatures.');
  }
}

/**
 * Display signatures in the container
 */
function displaySignatures(signatures) {
  const container = document.querySelector('.signatures-container');

  if (!signatures || signatures.length === 0) {
    container.innerHTML = `
      <div class="signatures-empty">
        <p>No signatures yet. Be the first to sign!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = signatures
    .map(
      (signature, index) => `
    <blockquote class="signature-card signature-card--${
      (index % 5) + 1
    }" data-signature-id="${signature.uuid}">
      <p class="signature-card__quote">"${escapeHtml(signature.message)}"</p>
      <cite class="signature-card__author">${escapeHtml(
        signature.display_name
      )}</cite>
      <time class="signature-card__date" datetime="${signature.created_at}">
        ${formatDate(signature.created_at)}
      </time>
    </blockquote>
  `
    )
    .join('');
}

/**
 * Set up signature form submission
 */
function setupSignatureForm() {
  const form = document.getElementById('signature-form');
  const submitButton = form?.querySelector('.signature-form__submit');
  const messageTextarea = document.getElementById('message');
  const charCounter = document.getElementById('char-counter');

  if (!form || !submitButton || !messageTextarea || !charCounter) {
    console.error('Form elements not found');
    return;
  }

  // Set up character counter
  messageTextarea.addEventListener('input', () => {
    const length = messageTextarea.value.length;
    charCounter.textContent = length;

    // Update styling based on character count
    if (length > 250) {
      charCounter.style.color = '#dc2626'; // Red warning
    } else if (length > 200) {
      charCounter.style.color = '#f59e0b'; // Yellow warning
    } else {
      charCounter.style.color = 'var(--color-text-muted)';
    }

    // Clear error messages when user starts typing
    clearMessages();
  });

  // Clear error messages when user starts typing in name field
  const nameInput = document.getElementById('display_name');
  nameInput.addEventListener('input', clearMessages);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const displayName = formData.get('display_name').trim();
    const message = formData.get('message').trim();

    // Validate form data
    if (!displayName || !message) {
      displayError('Please fill in both your name and message.');
      return;
    }

    if (message.length > 280) {
      displayError('Message must be 280 characters or less.');
      return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Signing...';

    try {
      await addSignature(displayName, message);

      // Reset form
      form.reset();

      // Show success message
      showSuccessMessage('Your signature has been added!');

      // Reload signatures
      await loadSignatures();

      // Close modal after success (if it's open)
      setTimeout(() => {
        const modal = document.getElementById('signature-modal');
        if (modal && modal.getAttribute('aria-hidden') === 'false') {
          closeSignatureModal();
        }
      }, 1500);
    } catch (error) {
      console.error('Error adding signature:', error);

      // Display specific error messages
      let errorMessage = 'Failed to add signature. Please try again.';

      if (error.message) {
        if (error.message.includes('already exists')) {
          errorMessage =
            'You have already signed with this exact name and message.';
        } else if (error.message.includes('connection')) {
          errorMessage =
            'Connection problem. Please check your internet and try again.';
        } else if (error.message.includes('permission')) {
          errorMessage =
            'Permission error. Please refresh the page and try again.';
        } else if (error.message.includes('Database error')) {
          errorMessage = error.message;
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      displayError(errorMessage);
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Sign Yearbook';
    }
  });
}

/**
 * Set up signature modal functionality
 */
function setupSignatureModal() {
  const signButton = document.getElementById('sign-button');
  const modal = document.getElementById('signature-modal');
  const closeButton = modal.querySelector('.signature-modal__close');
  const backdrop = modal.querySelector('.signature-modal__backdrop');
  const form = document.getElementById('signature-form');

  // Open modal when sign button is clicked
  signButton.addEventListener('click', () => {
    openSignatureModal();
  });

  // Close modal when close button is clicked
  closeButton.addEventListener('click', () => {
    closeSignatureModal();
  });

  // Close modal when backdrop is clicked
  backdrop.addEventListener('click', () => {
    closeSignatureModal();
  });

  // Close modal when Escape key is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeSignatureModal();
    }
  });
}

/**
 * Open the signature modal
 */
function openSignatureModal() {
  const modal = document.getElementById('signature-modal');
  const firstInput = document.getElementById('display_name');

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus the first input after animation completes
  setTimeout(() => {
    firstInput.focus();
  }, 200);
}

/**
 * Close the signature modal
 */
function closeSignatureModal() {
  const modal = document.getElementById('signature-modal');
  const form = document.getElementById('signature-form');

  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Clear the form and messages
  form.reset();
  const charCounter = document.getElementById('char-counter');
  if (charCounter) {
    charCounter.textContent = '0';
    charCounter.style.color = 'var(--color-text-muted)';
  }
  clearMessages();
}

/**
 * Add a new signature to the database
 */
async function addSignature(displayName, message) {
  try {
    // Check if supabase client is available
    if (!supabase) {
      throw new Error('Database connection not available');
    }

    console.log('Attempting to add signature:', {
      displayName,
      message: message.substring(0, 20) + '...',
    });

    const { data, error } = await supabase.from('signatures').insert([
      {
        display_name: displayName,
        message: message,
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);

      // Check if it's a duplicate
      if (error.code === '23505') {
        // Unique constraint violation
        throw new Error('This signature already exists.');
      }

      // Handle different error codes
      if (error.code === '23502') {
        throw new Error('Missing required information.');
      }

      if (error.message.includes('permission')) {
        throw new Error('Permission denied. Please try again.');
      }

      // Generic error with more context
      throw new Error(
        `Database error: ${error.message || 'Unknown error occurred'}`
      );
    }

    console.log('Signature added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in addSignature:', error);
    throw error;
  }
}

/**
 * Create a simple hash for duplicate detection
 */
async function createSimpleHash(text) {
  try {
    // Check if crypto.subtle is available
    if (!crypto || !crypto.subtle) {
      console.warn('Web Crypto API not available, using fallback hash');
      // Simple fallback hash
      let hash = 0;
      const str = text.toLowerCase().trim();
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash.toString(16);
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error creating hash:', error);
    // Fallback to a simple hash
    let hash = 0;
    const str = text.toLowerCase().trim();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
}

/**
 * Display error message
 */
function displayError(message) {
  const errorContainer = document.getElementById('signature-error');

  if (!errorContainer) {
    console.error('Error container not found:', message);
    alert('Error: ' + message); // Fallback to alert
    return;
  }

  errorContainer.textContent = message;
  errorContainer.style.display = 'block';

  // Hide error after 5 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
  const successContainer = document.getElementById('signature-success');
  successContainer.textContent = message;
  successContainer.style.display = 'block';

  // Hide success message after 3 seconds
  setTimeout(() => {
    successContainer.style.display = 'none';
  }, 3000);
}

/**
 * Clear all messages
 */
function clearMessages() {
  const errorContainer = document.getElementById('signature-error');
  const successContainer = document.getElementById('signature-success');

  if (errorContainer) {
    errorContainer.style.display = 'none';
  }

  if (successContainer) {
    successContainer.style.display = 'none';
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Initialize when DOM is loaded and Supabase is available
function waitForSupabaseAndInit() {
  let attempts = 0;
  const maxAttempts = 100; // 10 seconds maximum wait time

  const checkSupabase = setInterval(() => {
    attempts++;

    if (window.supabase) {
      clearInterval(checkSupabase);
      console.log('Supabase loaded, initializing signatures...');
      initializeSignatures();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkSupabase);
      console.error('Supabase failed to load after 10 seconds');
      displayError(
        'Failed to load required libraries. Please refresh the page.'
      );
    }
  }, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForSupabaseAndInit);
} else {
  waitForSupabaseAndInit();
}
