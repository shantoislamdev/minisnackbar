// Polyfill TextEncoder if missing (Node 18+ usually has it, but JSDOM env might not expose it completely)
if (typeof TextEncoder === 'undefined') {
  const util = require('util')
  global.TextEncoder = util.TextEncoder
  global.TextDecoder = util.TextDecoder
}

// Jest environment jsdom provides window, document, navigator, etc.

// Import the built Snackbar module (UMD/CommonJS)
const { Snackbar } = require('../dist/minisnackbar.cjs')

describe('MiniSnackbar', () => {
  beforeEach(() => {
    // Clean up any existing snackbar instance
    if (Snackbar.isInitialized()) {
      Snackbar.destroy()
    }
    // Clear the DOM before each test
    document.body.innerHTML = ''
    // Reset Snackbar state
    Snackbar.queue = []
    Snackbar.isShowing = false
    Snackbar.currentTimeout = null
    Snackbar.state = 'idle'
  })

  test('should initialize and create snackbar element', () => {
    Snackbar.init()
    const snackbar = document.getElementById('mini-snackbar')
    expect(snackbar).toBeTruthy()
    expect(snackbar.className).toBe('mini-snackbar')
  })

  test('should add message to queue', () => {
    Snackbar.init()
    Snackbar.add('Test message')
    expect(Snackbar.isShowing).toBe(true)
    expect(Snackbar.queue.length).toBe(0)
  })

  test('should show snackbar with message', (done) => {
    Snackbar.init()
    Snackbar.add('Test message', null, 100)

    setTimeout(() => {
      const snackbar = document.getElementById('mini-snackbar')
      const textElement = snackbar.querySelector('.mini-snackbar-text')
      expect(textElement.textContent).toBe('Test message')
      expect(snackbar.classList.contains('show')).toBe(true)
      done()
    }, 10)
  })

  test('should handle action button', (done) => {
    Snackbar.init()
    const mockHandler = jest.fn()
    Snackbar.add('Test with action', { text: 'UNDO', handler: mockHandler }, 100)

    setTimeout(() => {
      const actionButton = document.querySelector('.mini-snackbar-action')
      expect(actionButton).toBeTruthy()
      expect(actionButton.innerHTML).toBe('UNDO')

      actionButton.click()
      expect(mockHandler).toHaveBeenCalled()
      done()
    }, 10)
  })

  test('should queue multiple messages', (done) => {
    Snackbar.init()
    Snackbar.add('First message', null, 50)
    Snackbar.add('Second message', null, 50)

    expect(Snackbar.queue.length).toBe(1)
    expect(Snackbar.isShowing).toBe(true)

    setTimeout(() => {
      const snackbar = document.getElementById('mini-snackbar')
      const textElement = snackbar.querySelector('.mini-snackbar-text')
      expect(textElement.textContent).toBe('First message')

      setTimeout(() => {
        expect(textElement.textContent).toBe('Second message')
        expect(Snackbar.queue.length).toBe(0)
        done()
      }, 500)
    }, 10)
  })

  test('should provide access to internal state for testing', () => {
    Snackbar.init()
    expect(Snackbar.queue).toEqual([])
    Snackbar.queue = [{ message: 'test', action: null, duration: 1000 }]
    expect(Snackbar.queue.length).toBe(1)
    Snackbar.destroy()
  })
})
