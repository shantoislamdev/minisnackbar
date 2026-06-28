import { STYLES_ID } from './constants'

export function createSnackbarStyles(transitionDuration: number): string {
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
  `
}

export function installSnackbarStyles(document: Document, transitionDuration: number): void {
  const existingStyles = document.getElementById(STYLES_ID)
  if (existingStyles) return

  const styles = document.createElement('style')
  styles.id = STYLES_ID
  styles.textContent = createSnackbarStyles(transitionDuration)
  document.head.appendChild(styles)
}

export function removeSnackbarStyles(document: Document): void {
  document.getElementById(STYLES_ID)?.remove()
}
