import { DEFAULT_TRANSITION_DURATION, QUEUE_GAP_DURATION } from './constants'
import { SnackbarRenderer } from './renderer'
import type { SnackbarItem, SnackbarOptions, SnackbarState } from './types'
import { normalizeItem, normalizeTransitionDuration } from './validation'

export class SnackbarController {
  private queue: SnackbarItem[] = []
  private state: SnackbarState = 'idle'
  private renderer: SnackbarRenderer | null = null
  private displayTimer: ReturnType<typeof setTimeout> | null = null
  private transitionTimer: ReturnType<typeof setTimeout> | null = null
  private queueGapTimer: ReturnType<typeof setTimeout> | null = null
  private transitionDuration = DEFAULT_TRANSITION_DURATION
  private initialized = false

  init(options: SnackbarOptions = {}): void {
    if (this.initialized) return

    if (typeof document === 'undefined') {
      console.error('Snackbar: DOM is not available')
      return
    }

    const transitionDuration = normalizeTransitionDuration(options.transitionDuration)
    if (transitionDuration !== null) this.transitionDuration = transitionDuration

    this.renderer = new SnackbarRenderer(document)
    if (!this.renderer.ensureRoot(this.transitionDuration)) {
      console.error('Snackbar: DOM is not available')
      this.renderer = null
      return
    }

    this.initialized = true
  }

  destroy(): void {
    this.clearTimers()
    this.clearQueue()
    this.renderer?.destroy()
    this.renderer = null
    this.state = 'idle'
    this.transitionDuration = DEFAULT_TRANSITION_DURATION
    this.initialized = false
  }

  add(message: string, action: SnackbarItem['action'] = null, duration?: number): void {
    if (!this.ensureInitialized()) return

    const item = normalizeItem(message, action, duration)
    if (!item) return

    this.queue.push(item)
    if (this.state === 'idle') this.showNext()
  }

  show(message: string, action: SnackbarItem['action'] = null, duration?: number): void {
    if (!this.ensureInitialized()) return

    const item = normalizeItem(message, action, duration)
    if (!item) return

    this.clearQueue()

    if (this.state === 'idle') {
      this.showItem(item)
      return
    }

    if (this.state === 'transitioning') {
      this.clearTimer('transitionTimer')
      this.state = 'idle'
      this.showItem(item)
      return
    }

    this.hideActiveItem(() => this.showItem(item))
  }

  clearQueue(): void {
    this.queue = []
    this.clearTimer('queueGapTimer')
  }

  hideCurrent(): void {
    if (this.state === 'showing') {
      this.hideActiveItem(() => this.finishCurrentItem())
    }
  }

  isInitialized(): boolean {
    return this.initialized
  }

  getTransitionDuration(): number {
    return this.renderer?.getTransitionDuration(this.transitionDuration) ?? this.transitionDuration
  }

  private showNext(): void {
    if (this.state !== 'idle') return

    const item = this.queue.shift()
    if (!item) return

    this.showItem(item)
  }

  private showItem(item: SnackbarItem): void {
    if (!this.renderer) return

    this.clearTimers()
    this.state = 'showing'
    this.renderer.setMessage(item.message)
    this.renderer.setAction(item.action, () => {
      try {
        item.action?.handler()
      } finally {
        this.hideActiveItem(() => this.finishCurrentItem())
      }
    })
    this.renderer.show()

    this.displayTimer = setTimeout(() => {
      this.hideActiveItem(() => this.finishCurrentItem())
    }, item.duration)
  }

  private hideActiveItem(afterHidden?: () => void): void {
    if (!this.renderer || this.state === 'transitioning') return

    this.clearTimer('displayTimer')
    this.state = 'transitioning'
    this.renderer.hide()
    this.renderer.cleanupAction()

    this.transitionTimer = setTimeout(() => {
      this.transitionTimer = null
      this.state = 'idle'
      afterHidden?.()
    }, this.getTransitionDuration())
  }

  private finishCurrentItem(): void {
    if (this.state !== 'idle') return
    if (this.queue.length === 0) return

    this.clearTimer('queueGapTimer')
    this.queueGapTimer = setTimeout(() => {
      this.queueGapTimer = null
      this.showNext()
    }, QUEUE_GAP_DURATION)
  }

  private ensureInitialized(): boolean {
    if (this.initialized) return true
    console.warn('Snackbar: Not initialized. Call Snackbar.init() first.')
    return false
  }

  private clearTimers(): void {
    this.clearTimer('displayTimer')
    this.clearTimer('transitionTimer')
    this.clearTimer('queueGapTimer')
  }

  private clearTimer(timer: 'displayTimer' | 'transitionTimer' | 'queueGapTimer'): void {
    const timeout = this[timer]
    if (timeout) clearTimeout(timeout)
    this[timer] = null
  }
}
