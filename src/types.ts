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

export type SnackbarState = 'idle' | 'showing' | 'transitioning'
