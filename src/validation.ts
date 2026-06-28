import { DEFAULT_DURATION } from './constants'
import type { SnackbarAction, SnackbarItem } from './types'

type Warn = (message: string) => void

const isValidDuration = (duration: unknown): duration is number =>
  typeof duration === 'number' && Number.isFinite(duration) && duration > 0

export function normalizeItem(
  message: unknown,
  action: unknown = null,
  duration: unknown = DEFAULT_DURATION,
  warn: Warn = console.warn
): SnackbarItem | null {
  if (typeof message !== 'string' || message.trim() === '') {
    warn('Snackbar: Message must be a non-empty string')
    return null
  }

  if (
    action !== null &&
    (typeof action !== 'object' ||
      typeof (action as Partial<SnackbarAction>).text !== 'string' ||
      typeof (action as Partial<SnackbarAction>).handler !== 'function')
  ) {
    warn(
      'Snackbar: Action must be an object with "text" (string) and "handler" (function) properties'
    )
    return null
  }

  if (!isValidDuration(duration)) {
    warn('Snackbar: Duration must be a positive number')
    return null
  }

  return {
    message,
    action: action as SnackbarAction | null,
    duration
  }
}

export function normalizeTransitionDuration(
  duration: unknown,
  warn: Warn = console.warn
): number | null {
  if (duration === undefined) return null

  if (typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0) {
    warn('Snackbar: transitionDuration must be a non-negative number')
    return null
  }

  return duration
}
