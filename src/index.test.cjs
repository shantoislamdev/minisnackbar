// Polyfill TextEncoder if missing (Node 18+ usually has it, but JSDOM env might not expose it completely)
if (typeof TextEncoder === 'undefined') {
  const util = require('util')
  global.TextEncoder = util.TextEncoder
  global.TextDecoder = util.TextDecoder
}

const { Snackbar } = require('../dist/minisnackbar.cjs')

const getSnackbar = () => document.getElementById('mini-snackbar')
const getText = () => getSnackbar().querySelector('.mini-snackbar-text').textContent

describe('MiniSnackbar', () => {
  let warnSpy
  let errorSpy

  beforeEach(() => {
    jest.useFakeTimers()
    Snackbar.destroy()
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    Snackbar.destroy()
    warnSpy.mockRestore()
    errorSpy.mockRestore()
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  test('initializes the snackbar DOM and styles once', () => {
    Snackbar.init()
    Snackbar.init()

    const snackbar = getSnackbar()
    expect(snackbar).toBeTruthy()
    expect(snackbar.className).toBe('mini-snackbar')
    expect(snackbar.getAttribute('role')).toBe('alert')
    expect(snackbar.getAttribute('aria-live')).toBe('assertive')
    expect(document.querySelectorAll('#mini-snackbar').length).toBe(1)
    expect(document.querySelectorAll('#mini-snackbar-styles').length).toBe(1)
    expect(Snackbar.isInitialized()).toBe(true)
  })

  test('queues messages and shows them in order', () => {
    Snackbar.init({ transitionDuration: 10 })

    Snackbar.add('First message', null, 100)
    Snackbar.add('Second message', null, 100)

    expect(getText()).toBe('First message')
    expect(getSnackbar().classList.contains('show')).toBe(true)

    jest.advanceTimersByTime(100)
    expect(getSnackbar().classList.contains('show')).toBe(false)

    jest.advanceTimersByTime(210)
    expect(getText()).toBe('Second message')
    expect(getSnackbar().classList.contains('show')).toBe(true)
  })

  test('show interrupts the current message and clears queued messages', () => {
    Snackbar.init({ transitionDuration: 10 })

    Snackbar.add('First message', null, 1000)
    Snackbar.add('Queued message', null, 100)
    Snackbar.show('Immediate message', null, 100)

    jest.advanceTimersByTime(10)
    expect(getText()).toBe('Immediate message')

    jest.advanceTimersByTime(310)
    expect(getText()).toBe('Immediate message')
  })

  test('show during transition displays the newest message', () => {
    Snackbar.init({ transitionDuration: 50 })

    Snackbar.show('First message', null, 100)
    jest.advanceTimersByTime(100)
    Snackbar.show('Second message', null, 100)

    expect(getText()).toBe('Second message')
    expect(getSnackbar().classList.contains('show')).toBe(true)
  })

  test('uses an accessible button fallback for actions', () => {
    Snackbar.init({ transitionDuration: 10 })
    const handler = jest.fn()

    Snackbar.add('Action message', { text: 'UNDO', handler }, 1000)
    const actionButton = document.querySelector('.mini-snackbar-action')

    expect(actionButton.tagName).toBe('BUTTON')
    expect(actionButton.getAttribute('type')).toBe('button')
    expect(actionButton.textContent).toBe('UNDO')

    actionButton.click()
    expect(handler).toHaveBeenCalledTimes(1)
    expect(getSnackbar().classList.contains('show')).toBe(false)
  })

  test('validates input without mutating the DOM', () => {
    Snackbar.init()

    Snackbar.add('')
    Snackbar.add('Valid message', {})
    Snackbar.add('Valid message', null, 0)

    expect(warnSpy).toHaveBeenCalledTimes(3)
    expect(getText()).toBe('')
  })

  test('warns when used before initialization', () => {
    Snackbar.add('Missing init')

    expect(warnSpy).toHaveBeenCalledWith('Snackbar: Not initialized. Call Snackbar.init() first.')
    expect(getSnackbar()).toBeNull()
  })

  test('hideCurrent hides the active snackbar and continues the queue', () => {
    Snackbar.init({ transitionDuration: 10 })

    Snackbar.add('First message', null, 1000)
    Snackbar.add('Second message', null, 100)
    Snackbar.hideCurrent()

    expect(getSnackbar().classList.contains('show')).toBe(false)
    jest.advanceTimersByTime(210)
    expect(getText()).toBe('Second message')
  })

  test('destroy removes DOM, styles, queue, and pending timers', () => {
    Snackbar.init({ transitionDuration: 10 })
    Snackbar.add('First message', null, 100)
    Snackbar.add('Second message', null, 100)

    Snackbar.destroy()
    jest.advanceTimersByTime(1000)

    expect(Snackbar.isInitialized()).toBe(false)
    expect(getSnackbar()).toBeNull()
    expect(document.getElementById('mini-snackbar-styles')).toBeNull()

    Snackbar.init()
    expect(getText()).toBe('')
  })
})
