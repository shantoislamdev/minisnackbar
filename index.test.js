// Polyfill TextEncoder for Node.js < 16
if (typeof TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}

const { JSDOM } = require('jsdom');

// Setup JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Import the Snackbar after setting up globals
const Snackbar = require('./index.js');

describe('MiniSnackbar', () => {
    beforeEach(() => {
        // Clear the DOM before each test
        document.body.innerHTML = '';
        // Reset Snackbar state
        Snackbar.queue = [];
        Snackbar.isShowing = false;
        Snackbar.currentTimeout = null;
    });

    test('should initialize and create snackbar element', () => {
        Snackbar.init();
        const snackbar = document.getElementById('mini-snackbar');
        expect(snackbar).toBeTruthy();
        expect(snackbar.className).toBe('mini-snackbar');
    });

    test('should add message to queue', () => {
        Snackbar.init();
        // First message starts showing immediately
        Snackbar.add('Test message');
        expect(Snackbar.isShowing).toBe(true);
        // Queue should be empty since message is being shown
        expect(Snackbar.queue.length).toBe(0);
    });

    test('should show snackbar with message', (done) => {
        Snackbar.init();
        Snackbar.add('Test message', null, 100); // Short duration for test

        // Wait for next tick to allow DOM updates
        setTimeout(() => {
            const snackbar = document.getElementById('mini-snackbar');
            const textElement = snackbar.querySelector('.mini-snackbar-text');
            expect(textElement.textContent).toBe('Test message');
            expect(snackbar.classList.contains('show')).toBe(true);
            done();
        }, 10);
    });

    test('should handle action button', (done) => {
        Snackbar.init();

        const mockHandler = jest.fn();
        Snackbar.add('Test with action', { text: 'UNDO', handler: mockHandler }, 100);

        setTimeout(() => {
            const actionButton = document.querySelector('.mini-snackbar-action');
            expect(actionButton).toBeTruthy();
            expect(actionButton.innerHTML).toBe('UNDO');
            expect(actionButton.tagName).toBe('MD-TEXT-BUTTON'); // Always use md-text-button
            expect(actionButton.hasAttribute('data-fallback')).toBe(true); // Should have fallback attribute when MD not available

            // Simulate click
            actionButton.click();
            expect(mockHandler).toHaveBeenCalled();

            done();
        }, 10);
    });

    test('should queue multiple messages', (done) => {
        Snackbar.init();

        Snackbar.add('First message', null, 50);
        Snackbar.add('Second message', null, 50);

        // First message is showing, second is queued
        expect(Snackbar.queue.length).toBe(1);
        expect(Snackbar.isShowing).toBe(true);

        // Wait for first message to show
        setTimeout(() => {
            const snackbar = document.getElementById('mini-snackbar');
            const textElement = snackbar.querySelector('.mini-snackbar-text');
            expect(textElement.textContent).toBe('First message');

            // Wait for first to hide (50ms) + transition delay (200ms) + buffer
            setTimeout(() => {
                expect(textElement.textContent).toBe('Second message');
                expect(Snackbar.queue.length).toBe(0); // Second message now showing
                done();
            }, 300);
        }, 10);
    });

    test('should show message immediately with show method', (done) => {
        Snackbar.init();
        Snackbar.show('Show message', null, 100);

        setTimeout(() => {
            const snackbar = document.getElementById('mini-snackbar');
            const textElement = snackbar.querySelector('.mini-snackbar-text');
            expect(textElement.textContent).toBe('Show message');
            expect(snackbar.classList.contains('show')).toBe(true);
            expect(Snackbar.isShowing).toBe(true);
            done();
        }, 10);
    });

    test('should interrupt current show with new show', (done) => {
        Snackbar.init();
        Snackbar.show('First show', null, 200);
        Snackbar.show('Second show', null, 100);

        // Wait for requestAnimationFrame to execute
        setTimeout(() => {
            const snackbar = document.getElementById('mini-snackbar');
            const textElement = snackbar.querySelector('.mini-snackbar-text');
            expect(textElement.textContent).toBe('Second show');
            expect(snackbar.classList.contains('show')).toBe(true);
            done();
        }, 20);
    });

    test('should handle action button in show method', (done) => {
        Snackbar.init();

        const mockHandler = jest.fn();
        Snackbar.show('Show with action', { text: 'OK', handler: mockHandler }, 100);

        setTimeout(() => {
            const actionButton = document.querySelector('.mini-snackbar-action');
            expect(actionButton).toBeTruthy();
            expect(actionButton.innerHTML).toBe('OK');

            actionButton.click();
            expect(mockHandler).toHaveBeenCalled();
            expect(Snackbar.isShowing).toBe(false);

            done();
        }, 10);
    });
});
