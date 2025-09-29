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
        // Clean up any existing snackbar instance
        if (Snackbar.isInitialized()) {
            Snackbar.destroy();
        }
        // Clear the DOM before each test
        document.body.innerHTML = '';
        // Reset Snackbar state
        Snackbar.queue = [];
        Snackbar.isShowing = false;
        Snackbar.currentTimeout = null;
        Snackbar.state = 'idle';
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

            // Wait for first to hide (50ms) + transition (250ms) + queue delay (200ms)
            setTimeout(() => {
                expect(textElement.textContent).toBe('Second message');
                expect(Snackbar.queue.length).toBe(0); // Second message now showing
                done();
            }, 500);
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

        // Wait for transition to complete (250ms) + buffer
        setTimeout(() => {
            const snackbar = document.getElementById('mini-snackbar');
            const textElement = snackbar.querySelector('.mini-snackbar-text');
            expect(textElement.textContent).toBe('Second show');
            expect(snackbar.classList.contains('show')).toBe(true);
            done();
        }, 300);
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

            done();
        }, 10);
    });

    test('should initialize with custom transition duration', () => {
        Snackbar.init({ transitionDuration: 500 });
        expect(Snackbar.isInitialized()).toBe(true);
        // Clean up
        Snackbar.destroy();
    });

    test('should return initialization status', () => {
        expect(Snackbar.isInitialized()).toBe(false);
        Snackbar.init();
        expect(Snackbar.isInitialized()).toBe(true);
        Snackbar.destroy();
        expect(Snackbar.isInitialized()).toBe(false);
    });

    test('should destroy and clean up properly', () => {
        Snackbar.init();
        Snackbar.add('Test message');

        // Verify elements exist
        expect(document.getElementById('mini-snackbar')).toBeTruthy();
        expect(document.getElementById('mini-snackbar-styles')).toBeTruthy();

        Snackbar.destroy();

        // Verify elements are removed
        expect(document.getElementById('mini-snackbar')).toBeFalsy();
        expect(document.getElementById('mini-snackbar-styles')).toBeFalsy();

        // Verify state is reset
        expect(Snackbar.isInitialized()).toBe(false);
        expect(Snackbar.isShowing).toBe(false);
        expect(Snackbar.state).toBe('idle');
    });

    test('should get transition duration', () => {
        Snackbar.init({ transitionDuration: 400 });
        expect(Snackbar.getTransitionDuration()).toBe(400);
        Snackbar.destroy();
    });

    test('should provide access to internal state for testing', () => {
        Snackbar.init();

        // Test queue getter/setter
        expect(Snackbar.queue).toEqual([]);
        Snackbar.queue = [{ message: 'test', action: null, duration: 1000 }];
        expect(Snackbar.queue.length).toBe(1);

        // Test isShowing getter/setter
        expect(Snackbar.isShowing).toBe(false);
        Snackbar.isShowing = true;
        expect(Snackbar.isShowing).toBe(true);

        // Test state getter/setter
        expect(Snackbar.state).toBe('idle');
        Snackbar.state = 'showing';
        expect(Snackbar.state).toBe('showing');

        // Test currentTimeout getter/setter
        expect(Snackbar.currentTimeout).toBe(null);
        const mockTimeout = setTimeout(() => { }, 100);
        Snackbar.currentTimeout = mockTimeout;
        expect(Snackbar.currentTimeout).toBe(mockTimeout);
        clearTimeout(mockTimeout);

        Snackbar.destroy();
    });
});
