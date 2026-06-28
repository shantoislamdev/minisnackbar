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

import { SnackbarController } from './controller'
import type { SnackbarAction, SnackbarOptions } from './types'

export type { SnackbarAction, SnackbarOptions }

const controller = new SnackbarController()

class Snackbar {
  static init(options: SnackbarOptions = {}): void {
    controller.init(options)
  }

  static destroy(): void {
    controller.destroy()
  }

  static getTransitionDuration(): number {
    return controller.getTransitionDuration()
  }

  static add(message: string, action: SnackbarAction | null = null, duration?: number): void {
    controller.add(message, action, duration)
  }

  static show(message: string, action: SnackbarAction | null = null, duration?: number): void {
    controller.show(message, action, duration)
  }

  static clearQueue(): void {
    controller.clearQueue()
  }

  static hideCurrent(): void {
    controller.hideCurrent()
  }

  static isInitialized(): boolean {
    return controller.isInitialized()
  }
}

export default Snackbar
export { Snackbar }
