/**
 * MiniSnackbar - A simple vanilla JavaScript snackbar/toast library
 *
 * @version 2.0.0
 * @author Shanto Islam <shantoislamdev@gmail.com>
 * @license MIT
 * @description A lightweight, zero-dependency snackbar library with Material Design integration
 * @repository https://github.com/shantoislamdev/minisnackbar
 * @homepage https://github.com/shantoislamdev/minisnackbar#readme
 */

// Type definitions
export interface SnackbarAction {
  text: string
  handler: () => void
}

export interface SnackbarOptions {
  transitionDuration?: number
}

export interface SnackbarItem {
  message: string
  action: SnackbarAction | null
  duration: number
}

type SnackbarState = 'idle' | 'showing' | 'transitioning'

// Snackbar class
class Snackbar {
  private static _queue: SnackbarItem[] = []
  private static _isShowing: boolean = false
  private static _currentTimeout: ReturnType<typeof setTimeout> | null = null
  private static _state: SnackbarState = 'idle'
  private static _currentActionHandler: (() => void) | null = null
  private static _transitionDuration: number = 250
  private static _initialized: boolean = false

  static init(options: SnackbarOptions = {}): void {
    if (this._initialized) return

    if (typeof document === 'undefined' || !document.body) {
      console.error('Snackbar: DOM is not available')
      return
    }

    if (options.transitionDuration && typeof options.transitionDuration === 'number') {
      this._transitionDuration = options.transitionDuration
    }

    if (document.getElementById('mini-snackbar')) {
      this._initialized = true
      return
    }

    if (!document.getElementById('mini-snackbar-styles')) {
      const style = document.createElement('style')
      style.id = 'mini-snackbar-styles'
      style.textContent = `
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
          padding: 0.875rem 1rem;
          
          /* Visibility */
          visibility: hidden;
          
          /* Theming */
          background-color: var(--mini-snackbar-bg, var(--md-sys-color-inverse-surface, rgba(255, 255, 255, 1)));
          color: var(--mini-snackbar-text, var(--md-sys-color-inverse-on-surface, rgba(27, 27, 27, 1)));
          border: var(--mini-snackbar-border, none);
          font-family: var(--mini-snackbar-font-family, inherit);
          font-size: 0.875rem;
          text-align: left;
          border-radius: var(--mini-snackbar-radius, 1rem);
          box-shadow: var(--mini-snackbar-shadow, 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12));
          
          /* Animation */
          transition: var(--mini-snackbar-transition, transform ${this._transitionDuration}ms ease-in-out);
        }

        .mini-snackbar.show {
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        /* Material Component Action Button */
        .mini-snackbar .mini-snackbar-action {
          flex-shrink: 0;
          padding: 0.5rem 1rem;
          margin: -0.5rem -0.5rem -0.5rem 0;
        }

        /* Fallback Action Button (when Material Components unavailable) */
        .mini-snackbar md-text-button[data-fallback] {
          display: inline-block;
          flex-shrink: 0;
          padding: 0.5rem 1rem;
          margin: -0.5rem -0.5rem -0.5rem 0;
          border: none;
          background: var(--mini-snackbar-btn-bg, transparent);
          font-size: inherit;
          font-family: inherit;
          font-weight: 500;
          letter-spacing: 0.0892857143em;
          text-transform: uppercase;
          color: var(--mini-snackbar-btn-text, inherit);
          cursor: pointer;
          user-select: none;
          border-radius: var(--mini-snackbar-btn-radius, 1rem);
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

        /* Mobile responsive */
        @media (max-width: 600px) {
          .mini-snackbar {
            bottom: 90px;
          }
        }

        /* Accessibility: Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .mini-snackbar {
            transition: opacity 0.15s ease;
          }
        }
      `
      document.head.appendChild(style)
    }

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

  static destroy(): void {
    this.hideCurrent()
    this.clearQueue()

    const snackbar = document.getElementById('mini-snackbar')
    if (snackbar) snackbar.remove()

    const styles = document.getElementById('mini-snackbar-styles')
    if (styles) styles.remove()

    this._state = 'idle'
    this._isShowing = false
    this._currentActionHandler = null
    this._currentTimeout = null
    this._initialized = false
  }

  static getTransitionDuration(): number {
    const snackbar = document.getElementById('mini-snackbar')
    if (!snackbar) return this._transitionDuration

    try {
      const computedStyle = window.getComputedStyle(snackbar)
      const duration = computedStyle.transitionDuration
      if (duration && duration !== '0s') {
        const value = parseFloat(duration)
        return duration.includes('ms') ? value : value * 1000
      }
    } catch (e) {
      console.warn('Snackbar: Could not read transition duration from CSS', e)
    }

    return this._transitionDuration
  }

  static add(message: string, action: SnackbarAction | null = null, duration: number = 3000): void {
    if (!this._initialized) {
      console.warn('Snackbar: Not initialized. Call Snackbar.init() first.')
      return
    }

    if (typeof message !== 'string' || message.trim() === '') {
      console.warn('Snackbar: Message must be a non-empty string')
      return
    }
    if (
      action !== null &&
      (typeof action !== 'object' ||
        typeof action.text !== 'string' ||
        typeof action.handler !== 'function')
    ) {
      console.warn(
        'Snackbar: Action must be an object with "text" (string) and "handler" (function) properties'
      )
      return
    }
    if (typeof duration !== 'number' || duration <= 0) {
      console.warn('Snackbar: Duration must be a positive number')
      return
    }

    this._queue.push({ message, action, duration })
    if (this._state === 'idle') this.showNext()
  }

  private static _cleanupAction(): void {
    const snackbar = document.getElementById('mini-snackbar')
    if (!snackbar) return

    const actionButton = snackbar.querySelector('.mini-snackbar-action')
    if (actionButton && this._currentActionHandler) {
      actionButton.removeEventListener('click', this._currentActionHandler)
      this._currentActionHandler = null
      actionButton.remove()
    }
  }

  private static _showSnackbar(
    message: string,
    action: SnackbarAction | null,
    duration: number,
    onHide: (() => void) | null = null
  ): void {
    const snackbar = document.getElementById('mini-snackbar')
    if (!snackbar) {
      console.error('Snackbar: Snackbar element not found. Ensure init() has been called.')
      return
    }

    this._state = 'showing'
    this._isShowing = true
    const snackbarText = snackbar.querySelector('.mini-snackbar-text')
    if (snackbarText) {
      snackbarText.textContent = message
    }

    if (action) {
      const actionButton = document.createElement('md-text-button')
      actionButton.classList.add('mini-snackbar-action')

      // Fallback for when Material Components are not available
      if (customElements.get('md-text-button') === undefined) {
        actionButton.setAttribute('data-fallback', '')
      }

      actionButton.textContent = action.text

      this._currentActionHandler = (): void => {
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

  private static _hideSnackbar(onHide: (() => void) | null = null): void {
    if (this._currentTimeout) {
      clearTimeout(this._currentTimeout)
      this._currentTimeout = null
    }

    this._state = 'transitioning'
    const snackbar = document.getElementById('mini-snackbar')
    if (snackbar) {
      snackbar.classList.remove('show')
    }

    this._cleanupAction()

    // Wait for CSS transition to complete
    const transitionDuration = this.getTransitionDuration()
    setTimeout(() => {
      this._isShowing = false
      this._state = 'idle'
      if (onHide) onHide()
    }, transitionDuration)
  }

  static show(
    message: string,
    action: SnackbarAction | null = null,
    duration: number = 3000
  ): void {
    if (!this._initialized) {
      console.warn('Snackbar: Not initialized. Call Snackbar.init() first.')
      return
    }

    if (typeof message !== 'string' || message.trim() === '') {
      console.warn('Snackbar: Message must be a non-empty string')
      return
    }
    if (
      action !== null &&
      (typeof action !== 'object' ||
        typeof action.text !== 'string' ||
        typeof action.handler !== 'function')
    ) {
      console.warn(
        'Snackbar: Action must be an object with "text" (string) and "handler" (function) properties'
      )
      return
    }
    if (typeof duration !== 'number' || duration <= 0) {
      console.warn('Snackbar: Duration must be a positive number')
      return
    }

    // Queue message if currently transitioning
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

  static showNext(): void {
    if (this._queue.length === 0) {
      this._isShowing = false
      this._state = 'idle'
      return
    }

    const item = this._queue.shift()
    if (item) {
      const { message, action, duration } = item
      this._showSnackbar(message, action, duration, () => {
        setTimeout(() => this.showNext(), 200)
      })
    }
  }

  static clearQueue(): void {
    this._queue = []
  }

  static hideCurrent(): void {
    if (this._isShowing && this._state !== 'transitioning') {
      this._hideSnackbar()
    }
  }

  static isInitialized(): boolean {
    return this._initialized
  }

  // Getters/setters for testing
  static get queue(): SnackbarItem[] {
    return this._queue
  }
  static set queue(value: SnackbarItem[]) {
    this._queue = value
  }
  static get isShowing(): boolean {
    return this._isShowing
  }
  static set isShowing(value: boolean) {
    this._isShowing = value
  }
  static get currentTimeout(): ReturnType<typeof setTimeout> | null {
    return this._currentTimeout
  }
  static set currentTimeout(value: ReturnType<typeof setTimeout> | null) {
    this._currentTimeout = value
  }
  static get state(): SnackbarState {
    return this._state
  }
  static set state(value: SnackbarState) {
    this._state = value
  }
}

// Make available globally in browser for UMD builds
if (typeof window !== 'undefined') {
  ; (window as typeof window & { Snackbar: typeof Snackbar }).Snackbar = Snackbar
}

export default Snackbar
export { Snackbar }
