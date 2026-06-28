var Snackbar = (function () {
  'use strict';

  const SNACKBAR_ID = 'mini-snackbar';
  const STYLES_ID = 'mini-snackbar-styles';
  const SNACKBAR_CLASS = 'mini-snackbar';
  const SNACKBAR_VISIBLE_CLASS = 'show';
  const SNACKBAR_TEXT_CLASS = 'mini-snackbar-text';
  const SNACKBAR_ACTION_CLASS = 'mini-snackbar-action';
  const DEFAULT_DURATION = 3000;
  const DEFAULT_TRANSITION_DURATION = 250;
  const QUEUE_GAP_DURATION = 200;

  function createSnackbarStyles(transitionDuration) {
      return `
    .mini-snackbar {
      position: fixed;
      z-index: 1000;
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%) translateY(100%);
      min-width: 250px;
      max-width: 90%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 0.875rem 1rem;
      visibility: hidden;
      background-color: var(--mini-snackbar-bg, var(--md-sys-color-inverse-surface, rgba(255, 255, 255, 1)));
      color: var(--mini-snackbar-text, var(--md-sys-color-inverse-on-surface, rgba(27, 27, 27, 1)));
      border: var(--mini-snackbar-border, none);
      font-family: var(--mini-snackbar-font-family, inherit);
      font-size: 0.875rem;
      text-align: left;
      border-radius: var(--mini-snackbar-radius, 1rem);
      box-shadow: var(--mini-snackbar-shadow, 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12));
      transition: var(--mini-snackbar-transition, transform ${transitionDuration}ms ease-in-out);
    }

    .mini-snackbar.show {
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    .mini-snackbar .mini-snackbar-action {
      flex-shrink: 0;
      padding: 0.5rem 1rem;
      margin: -0.5rem -0.5rem -0.5rem 0;
    }

    .mini-snackbar button.mini-snackbar-action {
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

    .mini-snackbar button.mini-snackbar-action:hover {
      opacity: var(--mini-snackbar-btn-hover-opacity, 0.8);
      outline: var(--mini-snackbar-btn-hover-outline, 2px solid var(--mini-snackbar-btn-text, inherit));
      outline-offset: var(--mini-snackbar-btn-outline-offset, 2px);
      background-color: var(--mini-snackbar-btn-hover-bg, transparent);
    }

    .mini-snackbar button.mini-snackbar-action:focus {
      outline: var(--mini-snackbar-btn-focus-outline, 2px solid var(--mini-snackbar-btn-text, inherit));
      outline-offset: var(--mini-snackbar-btn-outline-offset, 2px);
    }

    @media (max-width: 600px) {
      .mini-snackbar {
        bottom: 90px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mini-snackbar {
        transition: opacity 0.15s ease;
      }
    }
  `;
  }
  function installSnackbarStyles(document, transitionDuration) {
      const existingStyles = document.getElementById(STYLES_ID);
      if (existingStyles)
          return;
      const styles = document.createElement('style');
      styles.id = STYLES_ID;
      styles.textContent = createSnackbarStyles(transitionDuration);
      document.head.appendChild(styles);
  }
  function removeSnackbarStyles(document) {
      document.getElementById(STYLES_ID)?.remove();
  }

  class SnackbarRenderer {
      constructor(document) {
          this.actionButton = null;
          this.actionHandler = null;
          this.document = document;
      }
      ensureRoot(transitionDuration) {
          if (!this.document.body)
              return false;
          installSnackbarStyles(this.document, transitionDuration);
          if (this.getRoot())
              return true;
          const snackbar = this.document.createElement('div');
          snackbar.id = SNACKBAR_ID;
          snackbar.className = SNACKBAR_CLASS;
          snackbar.setAttribute('role', 'alert');
          snackbar.setAttribute('aria-live', 'assertive');
          snackbar.setAttribute('aria-atomic', 'true');
          const text = this.document.createElement('span');
          text.className = SNACKBAR_TEXT_CLASS;
          snackbar.appendChild(text);
          this.document.body.appendChild(snackbar);
          return true;
      }
      destroy() {
          this.cleanupAction();
          this.getRoot()?.remove();
          removeSnackbarStyles(this.document);
      }
      setMessage(message) {
          const text = this.getRoot()?.querySelector(`.${SNACKBAR_TEXT_CLASS}`);
          if (text)
              text.textContent = message;
      }
      setAction(action, onClick) {
          this.cleanupAction();
          if (!action)
              return;
          const actionButton = this.createActionButton();
          actionButton.classList.add(SNACKBAR_ACTION_CLASS);
          actionButton.textContent = action.text;
          this.actionHandler = onClick;
          actionButton.addEventListener('click', this.actionHandler);
          this.actionButton = actionButton;
          this.getRoot()?.appendChild(actionButton);
      }
      show() {
          this.getRoot()?.classList.add(SNACKBAR_VISIBLE_CLASS);
      }
      hide() {
          this.getRoot()?.classList.remove(SNACKBAR_VISIBLE_CLASS);
      }
      cleanupAction() {
          if (this.actionButton && this.actionHandler) {
              this.actionButton.removeEventListener('click', this.actionHandler);
          }
          this.actionButton?.remove();
          this.actionButton = null;
          this.actionHandler = null;
      }
      getTransitionDuration(fallback) {
          const snackbar = this.getRoot();
          const view = this.document.defaultView;
          if (!snackbar || !view)
              return fallback;
          try {
              const duration = view.getComputedStyle(snackbar).transitionDuration;
              return parseTransitionDuration(duration, fallback);
          }
          catch (error) {
              console.warn('Snackbar: Could not read transition duration from CSS', error);
              return fallback;
          }
      }
      getRoot() {
          return this.document.getElementById(SNACKBAR_ID);
      }
      createActionButton() {
          const registry = this.document.defaultView?.customElements;
          if (registry?.get('md-text-button')) {
              return this.document.createElement('md-text-button');
          }
          const button = this.document.createElement('button');
          button.type = 'button';
          return button;
      }
  }
  function parseTransitionDuration(duration, fallback) {
      if (!duration || duration === '0s')
          return fallback;
      const firstDuration = duration.split(',')[0]?.trim();
      if (!firstDuration)
          return fallback;
      const value = Number.parseFloat(firstDuration);
      if (!Number.isFinite(value))
          return fallback;
      return firstDuration.endsWith('ms') ? value : value * 1000;
  }

  const isValidDuration = (duration) => typeof duration === 'number' && Number.isFinite(duration) && duration > 0;
  function normalizeItem(message, action = null, duration = DEFAULT_DURATION, warn = console.warn) {
      if (typeof message !== 'string' || message.trim() === '') {
          warn('Snackbar: Message must be a non-empty string');
          return null;
      }
      if (action !== null &&
          (typeof action !== 'object' ||
              typeof action.text !== 'string' ||
              typeof action.handler !== 'function')) {
          warn('Snackbar: Action must be an object with "text" (string) and "handler" (function) properties');
          return null;
      }
      if (!isValidDuration(duration)) {
          warn('Snackbar: Duration must be a positive number');
          return null;
      }
      return {
          message,
          action: action,
          duration
      };
  }
  function normalizeTransitionDuration(duration, warn = console.warn) {
      if (duration === undefined)
          return null;
      if (typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0) {
          warn('Snackbar: transitionDuration must be a non-negative number');
          return null;
      }
      return duration;
  }

  class SnackbarController {
      constructor() {
          this.queue = [];
          this.state = 'idle';
          this.renderer = null;
          this.displayTimer = null;
          this.transitionTimer = null;
          this.queueGapTimer = null;
          this.transitionDuration = DEFAULT_TRANSITION_DURATION;
          this.initialized = false;
      }
      init(options = {}) {
          if (this.initialized)
              return;
          if (typeof document === 'undefined') {
              console.error('Snackbar: DOM is not available');
              return;
          }
          const transitionDuration = normalizeTransitionDuration(options.transitionDuration);
          if (transitionDuration !== null)
              this.transitionDuration = transitionDuration;
          this.renderer = new SnackbarRenderer(document);
          if (!this.renderer.ensureRoot(this.transitionDuration)) {
              console.error('Snackbar: DOM is not available');
              this.renderer = null;
              return;
          }
          this.initialized = true;
      }
      destroy() {
          this.clearTimers();
          this.clearQueue();
          this.renderer?.destroy();
          this.renderer = null;
          this.state = 'idle';
          this.transitionDuration = DEFAULT_TRANSITION_DURATION;
          this.initialized = false;
      }
      add(message, action = null, duration) {
          if (!this.ensureInitialized())
              return;
          const item = normalizeItem(message, action, duration);
          if (!item)
              return;
          this.queue.push(item);
          if (this.state === 'idle')
              this.showNext();
      }
      show(message, action = null, duration) {
          if (!this.ensureInitialized())
              return;
          const item = normalizeItem(message, action, duration);
          if (!item)
              return;
          this.clearQueue();
          if (this.state === 'idle') {
              this.showItem(item);
              return;
          }
          if (this.state === 'transitioning') {
              this.clearTimer('transitionTimer');
              this.state = 'idle';
              this.showItem(item);
              return;
          }
          this.hideActiveItem(() => this.showItem(item));
      }
      clearQueue() {
          this.queue = [];
          this.clearTimer('queueGapTimer');
      }
      hideCurrent() {
          if (this.state === 'showing') {
              this.hideActiveItem(() => this.finishCurrentItem());
          }
      }
      isInitialized() {
          return this.initialized;
      }
      getTransitionDuration() {
          return this.renderer?.getTransitionDuration(this.transitionDuration) ?? this.transitionDuration;
      }
      showNext() {
          if (this.state !== 'idle')
              return;
          const item = this.queue.shift();
          if (!item)
              return;
          this.showItem(item);
      }
      showItem(item) {
          if (!this.renderer)
              return;
          this.clearTimers();
          this.state = 'showing';
          this.renderer.setMessage(item.message);
          this.renderer.setAction(item.action, () => {
              try {
                  item.action?.handler();
              }
              finally {
                  this.hideActiveItem(() => this.finishCurrentItem());
              }
          });
          this.renderer.show();
          this.displayTimer = setTimeout(() => {
              this.hideActiveItem(() => this.finishCurrentItem());
          }, item.duration);
      }
      hideActiveItem(afterHidden) {
          if (!this.renderer || this.state === 'transitioning')
              return;
          this.clearTimer('displayTimer');
          this.state = 'transitioning';
          this.renderer.hide();
          this.renderer.cleanupAction();
          this.transitionTimer = setTimeout(() => {
              this.transitionTimer = null;
              this.state = 'idle';
              afterHidden?.();
          }, this.getTransitionDuration());
      }
      finishCurrentItem() {
          if (this.state !== 'idle')
              return;
          if (this.queue.length === 0)
              return;
          this.clearTimer('queueGapTimer');
          this.queueGapTimer = setTimeout(() => {
              this.queueGapTimer = null;
              this.showNext();
          }, QUEUE_GAP_DURATION);
      }
      ensureInitialized() {
          if (this.initialized)
              return true;
          console.warn('Snackbar: Not initialized. Call Snackbar.init() first.');
          return false;
      }
      clearTimers() {
          this.clearTimer('displayTimer');
          this.clearTimer('transitionTimer');
          this.clearTimer('queueGapTimer');
      }
      clearTimer(timer) {
          const timeout = this[timer];
          if (timeout)
              clearTimeout(timeout);
          this[timer] = null;
      }
  }

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
  const controller = new SnackbarController();
  class Snackbar {
      static init(options = {}) {
          controller.init(options);
      }
      static destroy() {
          controller.destroy();
      }
      static getTransitionDuration() {
          return controller.getTransitionDuration();
      }
      static add(message, action = null, duration) {
          controller.add(message, action, duration);
      }
      static show(message, action = null, duration) {
          controller.show(message, action, duration);
      }
      static clearQueue() {
          controller.clearQueue();
      }
      static hideCurrent() {
          controller.hideCurrent();
      }
      static isInitialized() {
          return controller.isInitialized();
      }
  }

  if (typeof window !== 'undefined') {
      window.Snackbar = Snackbar;
  }

  return Snackbar;

})();
//# sourceMappingURL=minisnackbar.js.map
