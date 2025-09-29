class Snackbar {
  static _queue = []
  static _isShowing = false
  static _currentTimeout = null
  static _state = 'idle' // idle, showing, transitioning
  static _currentActionHandler = null // Store current action handler for cleanup
  static _transitionDuration = 250 // Default transition duration in ms
  static _initialized = false

  static init(options = {}) {
    // Prevent multiple initializations
    if (this._initialized) return

    if (typeof document === 'undefined' || !document.body) {
      console.error('Snackbar: DOM is not available')
      return
    }

    // Allow custom transition duration
    if (options.transitionDuration && typeof options.transitionDuration === 'number') {
      this._transitionDuration = options.transitionDuration
    }

    if (document.getElementById('mini-snackbar')) {
      this._initialized = true
      return
    }

    // Check if style already exists
    if (!document.getElementById('mini-snackbar-styles')) {
      // Create and append style with structured CSS
      const style = document.createElement('style')
      style.id = 'mini-snackbar-styles'
      style.textContent = `
        /* ===================================
           Snackbar Container
           =================================== */
        .mini-snackbar {
          /* Positioning */
          position: fixed;
          z-index: 1000;
          left: 50%;
          bottom: 30px;
          transform: translateX(-50%) translateY(100%);
          
          /* Sizing */
          min-width: 250px;
          max-width: 90%;
          
          /* Layout */
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          
          /* Spacing */
          padding: 0.875rem 1rem;
          
          /* Visibility */
          visibility: hidden;
          
          /* Colors */
          background-color: var(--mini-snackbar-bg, var(--md-sys-color-inverse-surface, rgba(255, 255, 255, 1)));
          color: var(--mini-snackbar-text, var(--md-sys-color-inverse-on-surface, inherit));
          border: var(--mini-snackbar-border, none);

          /* Typography */
          font-family: var(--mini-snackbar-font-family, inherit);
          font-size: 0.875rem;
          text-align: left;

          /* Shape */
          border-radius: var(--mini-snackbar-radius, 1rem);

          /* Elevation */
          box-shadow: var(--mini-snackbar-shadow, 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12));
          
          /* Transition */
          transition: var(--mini-snackbar-transition, transform ${this._transitionDuration}ms ease-in-out);
        }

        /* ===================================
           Snackbar Active State
           =================================== */
        .mini-snackbar.show {
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        /* ===================================
           Snackbar Action Button - Material Component
           =================================== */
        .mini-snackbar .mini-snackbar-action {
          flex-shrink: 0;
          padding: 0.5rem 1rem;
          margin: -0.5rem -0.5rem -0.5rem 0;
        }

        /* ===================================
           Snackbar Action Button - Fallback Styling
           =================================== */
        .mini-snackbar md-text-button[data-fallback] {
          /* Layout */
          display: inline-block;
          flex-shrink: 0;

          /* Spacing */
          padding: 0.5rem 1rem;
          margin: -0.5rem -0.5rem -0.5rem 0;
          
          /* Reset */
          border: none;
          background: var(--mini-snackbar-btn-bg, transparent);

          /* Typography */
          font-size: inherit;
          font-family: inherit;
          font-weight: 500;
          letter-spacing: 0.0892857143em;
          text-transform: uppercase;

          /* Appearance */
          color: var(--mini-snackbar-btn-text, inherit);
          cursor: pointer;
          user-select: none;
         
          /* Shape */
          border-radius: var(--mini-snackbar-btn-radius, 1rem);
          
          /* Transition */
          transition: opacity 0.2s ease;
        }

        .mini-snackbar md-text-button[data-fallback]:hover {
          opacity: var(--mini-snackbar-btn-hover-opacity, 0.8);
          outline: var(--mini-snackbar-btn-hover-outline, 2px solid var(--mini-snackbar-btn-text, inherit));
          outline-offset: var(--mini-snackbar-btn-outline-offset, 2px);
          background-color: var(--mini-snackbar-btn-hover-bg, transparent);
        }

        .mini-snackbar md-text-button[data-fallback]:focus {
          outline: var(--mini-snackbar-btn-focus-outline, 2px solid var(--mini-snackbar-btn-text, inherit));
          outline-offset: var(--mini-snackbar-btn-outline-offset, 2px);
        }

        /* ===================================
           Responsive - Mobile
           =================================== */
        @media (max-width: 600px) {
          .mini-snackbar {
            bottom: 90px;
          }
        }
        /* ===================================
           Reduced Motion Support
           =================================== */
        @media (prefers-reduced-motion: reduce) {
          .mini-snackbar {
            transition: opacity 0.15s ease;
          }
        }
      `
      document.head.appendChild(style)
    }

    // Create and append snackbar
    const snackbar = document.createElement('div')
    snackbar.id = 'mini-snackbar'
    snackbar.className = 'mini-snackbar'
    snackbar.setAttribute('role', 'alert')
    snackbar.setAttribute('aria-live', 'assertive')
    snackbar.setAttribute('aria-atomic', 'true')

    const snackbarText = document.createElement('span')
    snackbarText.className = 'mini-snackbar-text'
    snackbar.appendChild(snackbarText)

    document.body.appendChild(snackbar)

    this._initialized = true
  }

  static destroy() {
    // Clean up current state
    this.hideCurrent()
    this.clearQueue()

    // Remove DOM elements
    const snackbar = document.getElementById('mini-snackbar')
    if (snackbar) snackbar.remove()

    const styles = document.getElementById('mini-snackbar-styles')
    if (styles) styles.remove()

    // Reset state
    this._state = 'idle'
    this._isShowing = false
    this._currentActionHandler = null
    this._currentTimeout = null
    this._initialized = false
  }

  static getTransitionDuration() {
    const snackbar = document.getElementById('mini-snackbar')
    if (!snackbar) return this._transitionDuration

    try {
      const computedStyle = window.getComputedStyle(snackbar)
      const duration = computedStyle.transitionDuration
      if (duration && duration !== '0s') {
        // Parse duration (handles both 's' and 'ms' units)
        const value = parseFloat(duration)
        return duration.includes('ms') ? value : value * 1000
      }
    } catch (e) {
      console.warn('Snackbar: Could not read transition duration from CSS', e)
    }

    return this._transitionDuration
  }

  static add(message, action = null, duration = 3000) {
    if (!this._initialized) {
      console.warn('Snackbar: Not initialized. Call Snackbar.init() first.')
      return
    }

    // Input validation
    if (typeof message !== 'string' || message.trim() === '') {
      console.warn('Snackbar: Message must be a non-empty string')
      return
    }
    if (action !== null && (typeof action !== 'object' || typeof action.text !== 'string' || typeof action.handler !== 'function')) {
      console.warn('Snackbar: Action must be an object with "text" (string) and "handler" (function) properties')
      return
    }
    if (typeof duration !== 'number' || duration <= 0) {
      console.warn('Snackbar: Duration must be a positive number')
      return
    }

    this._queue.push({ message, action, duration })
    if (this._state === 'idle') this.showNext()
  }

  static _cleanupAction() {
    const snackbar = document.getElementById('mini-snackbar')
    if (!snackbar) return

    const actionButton = snackbar.querySelector('.mini-snackbar-action')
    if (actionButton && this._currentActionHandler) {
      actionButton.removeEventListener('click', this._currentActionHandler)
      this._currentActionHandler = null
      actionButton.remove()
    }
  }

  static _showSnackbar(message, action, duration, onHide = null) {
    const snackbar = document.getElementById('mini-snackbar')
    if (!snackbar) {
      console.error('Snackbar: Snackbar element not found. Ensure init() has been called.')
      return
    }

    this._state = 'showing'
    this._isShowing = true
    const snackbarText = snackbar.querySelector('.mini-snackbar-text')

    snackbarText.textContent = message

    if (action) {
      const actionButton = document.createElement('md-text-button')
      actionButton.classList.add('mini-snackbar-action')

      // Add fallback attribute if MD components are not available
      if (customElements.get('md-text-button') === undefined) {
        actionButton.setAttribute('data-fallback', '')
      }

      actionButton.textContent = action.text

      // Create handler function and store reference for cleanup
      this._currentActionHandler = () => {
        action.handler()
        this._hideSnackbar(onHide)
      }

      actionButton.addEventListener('click', this._currentActionHandler)
      snackbar.appendChild(actionButton)
    }

    snackbar.classList.add('show')

    this._currentTimeout = setTimeout(() => {
      this._hideSnackbar(onHide)
    }, duration)
  }

  static _hideSnackbar(onHide = null) {
    if (this._currentTimeout) {
      clearTimeout(this._currentTimeout)
      this._currentTimeout = null
    }

    this._state = 'transitioning'
    const snackbar = document.getElementById('mini-snackbar')
    if (snackbar) {
      snackbar.classList.remove('show')
    }

    // Clean up action immediately to prevent memory leaks
    this._cleanupAction()

    // Wait for transition to complete
    const transitionDuration = this.getTransitionDuration()
    setTimeout(() => {
      this._isShowing = false
      this._state = 'idle'
      if (onHide) onHide()
    }, transitionDuration)
  }

  static show(message, action = null, duration = 3000) {
    if (!this._initialized) {
      console.warn('Snackbar: Not initialized. Call Snackbar.init() first.')
      return
    }

    // Input validation
    if (typeof message !== 'string' || message.trim() === '') {
      console.warn('Snackbar: Message must be a non-empty string')
      return
    }
    if (action !== null && (typeof action !== 'object' || typeof action.text !== 'string' || typeof action.handler !== 'function')) {
      console.warn('Snackbar: Action must be an object with "text" (string) and "handler" (function) properties')
      return
    }
    if (typeof duration !== 'number' || duration <= 0) {
      console.warn('Snackbar: Duration must be a positive number')
      return
    }

    // If currently transitioning, queue the message instead
    if (this._state === 'transitioning') {
      this.add(message, action, duration)
      return
    }

    // Interrupt current snackbar if showing
    if (this._isShowing) {
      this._state = 'transitioning'
      if (this._currentTimeout) {
        clearTimeout(this._currentTimeout)
        this._currentTimeout = null
      }
      const snackbar = document.getElementById('mini-snackbar')
      if (snackbar) {
        snackbar.classList.remove('show')
      }
      this._cleanupAction()

      // Wait for transition to complete before showing new snackbar
      const transitionDuration = this.getTransitionDuration()
      setTimeout(() => {
        this._isShowing = false
        this._state = 'idle'
        this._showSnackbar(message, action, duration)
      }, transitionDuration)
    } else {
      this._showSnackbar(message, action, duration)
    }
  }

  static showNext() {
    if (this._queue.length === 0) {
      this._isShowing = false
      this._state = 'idle'
      return
    }

    const { message, action, duration } = this._queue.shift()
    this._showSnackbar(message, action, duration, () => {
      setTimeout(() => this.showNext(), 200)
    })
  }

  static clearQueue() {
    this._queue = []
  }

  static hideCurrent() {
    if (this._isShowing && this._state !== 'transitioning') {
      this._hideSnackbar()
    }
  }

  static isInitialized() {
    return this._initialized
  }

  // Getters and setters for testing
  static get queue() { return this._queue }
  static set queue(value) { this._queue = value }
  static get isShowing() { return this._isShowing }
  static set isShowing(value) { this._isShowing = value }
  static get currentTimeout() { return this._currentTimeout }
  static set currentTimeout(value) { this._currentTimeout = value }
  static get state() { return this._state }
  static set state(value) { this._state = value }
}

// Export for testing and module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Snackbar
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.Snackbar = Snackbar
}

// Usage examples:
// Initialize (required before use):
// document.addEventListener('DOMContentLoaded', () => {
//   Snackbar.init();
//   // or with custom transition duration
//   // Snackbar.init({ transitionDuration: 300 });
// });

// Simple message:
// Snackbar.add('Message sent successfully');

// Message with action:
// Snackbar.add('Item deleted', {
//   text: 'UNDO',
//   handler: () => {
//     console.log('Undo clicked');
//   }
// });

// Message with custom duration (5 seconds):
// Snackbar.add('Custom duration message', null, 5000);

// Immediate show (interrupts current):
// Snackbar.show('Immediate message');

// Immediate show with action:
// Snackbar.show('Item deleted', {
//   text: 'UNDO',
//   handler: () => {
//     console.log('Undo clicked');
//   }
// });

// Clean up when no longer needed:
// Snackbar.destroy();