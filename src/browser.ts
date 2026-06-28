import Snackbar from './index'

if (typeof window !== 'undefined') {
  ;(window as typeof window & { Snackbar: typeof Snackbar }).Snackbar = Snackbar
}

export default Snackbar
