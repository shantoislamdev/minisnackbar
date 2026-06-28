import {
  SNACKBAR_ACTION_CLASS,
  SNACKBAR_CLASS,
  SNACKBAR_ID,
  SNACKBAR_TEXT_CLASS,
  SNACKBAR_VISIBLE_CLASS
} from './constants'
import { installSnackbarStyles, removeSnackbarStyles } from './styles'
import type { SnackbarAction } from './types'

export class SnackbarRenderer {
  private readonly document: Document
  private actionButton: HTMLElement | null = null
  private actionHandler: (() => void) | null = null

  constructor(document: Document) {
    this.document = document
  }

  ensureRoot(transitionDuration: number): boolean {
    if (!this.document.body) return false

    installSnackbarStyles(this.document, transitionDuration)

    if (this.getRoot()) return true

    const snackbar = this.document.createElement('div')
    snackbar.id = SNACKBAR_ID
    snackbar.className = SNACKBAR_CLASS
    snackbar.setAttribute('role', 'alert')
    snackbar.setAttribute('aria-live', 'assertive')
    snackbar.setAttribute('aria-atomic', 'true')

    const text = this.document.createElement('span')
    text.className = SNACKBAR_TEXT_CLASS
    snackbar.appendChild(text)

    this.document.body.appendChild(snackbar)
    return true
  }

  destroy(): void {
    this.cleanupAction()
    this.getRoot()?.remove()
    removeSnackbarStyles(this.document)
  }

  setMessage(message: string): void {
    const text = this.getRoot()?.querySelector(`.${SNACKBAR_TEXT_CLASS}`)
    if (text) text.textContent = message
  }

  setAction(action: SnackbarAction | null, onClick: () => void): void {
    this.cleanupAction()
    if (!action) return

    const actionButton = this.createActionButton()
    actionButton.classList.add(SNACKBAR_ACTION_CLASS)
    actionButton.textContent = action.text

    this.actionHandler = onClick
    actionButton.addEventListener('click', this.actionHandler)
    this.actionButton = actionButton
    this.getRoot()?.appendChild(actionButton)
  }

  show(): void {
    this.getRoot()?.classList.add(SNACKBAR_VISIBLE_CLASS)
  }

  hide(): void {
    this.getRoot()?.classList.remove(SNACKBAR_VISIBLE_CLASS)
  }

  cleanupAction(): void {
    if (this.actionButton && this.actionHandler) {
      this.actionButton.removeEventListener('click', this.actionHandler)
    }

    this.actionButton?.remove()
    this.actionButton = null
    this.actionHandler = null
  }

  getTransitionDuration(fallback: number): number {
    const snackbar = this.getRoot()
    const view = this.document.defaultView
    if (!snackbar || !view) return fallback

    try {
      const duration = view.getComputedStyle(snackbar).transitionDuration
      return parseTransitionDuration(duration, fallback)
    } catch (error) {
      console.warn('Snackbar: Could not read transition duration from CSS', error)
      return fallback
    }
  }

  private getRoot(): HTMLElement | null {
    return this.document.getElementById(SNACKBAR_ID)
  }

  private createActionButton(): HTMLElement {
    const registry = this.document.defaultView?.customElements

    if (registry?.get('md-text-button')) {
      return this.document.createElement('md-text-button')
    }

    const button = this.document.createElement('button')
    button.type = 'button'
    return button
  }
}

function parseTransitionDuration(duration: string, fallback: number): number {
  if (!duration || duration === '0s') return fallback

  const firstDuration = duration.split(',')[0]?.trim()
  if (!firstDuration) return fallback

  const value = Number.parseFloat(firstDuration)
  if (!Number.isFinite(value)) return fallback

  return firstDuration.endsWith('ms') ? value : value * 1000
}
