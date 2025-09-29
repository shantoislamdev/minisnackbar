# MiniSnackbar Documentation

## Overview

MiniSnackbar is a lightweight, zero-dependency vanilla JavaScript library for displaying snackbar/toast notifications. It provides a simple API for showing temporary messages with optional action buttons, queue management, and customizable styling.

**Key Feature:** MiniSnackbar automatically integrates with [Material Web](https://material-web.dev/) components and matches your site's default Material theme. Since Material Web doesn't provide a snackbar component, this library fills that gap while maintaining design consistency.

**Author:** Shanto Islam ([shantoislamdev.web.app](https://shantoislamdev.web.app)) <shantoislamdev@gmail.com>
**Version:** 1.0.1
**License:** MIT
**Repository:** [github.com/shantoislamdev/minisnackbar](https://github.com/shantoislamdev/minisnackbar)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Styling and Theming](#styling-and-theming)
- [Advanced Usage](#advanced-usage)
- [Browser Support](#browser-support)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🚀 **Zero Dependencies**: Works standalone without external libraries
- 🎨 **Customizable Styling**: Extensive CSS variable support for theming
- 📱 **Mobile Responsive**: Optimized for all screen sizes
- ⚡ **Lightweight**: ~2KB minified bundle size
- 🔄 **Queue Management**: Handles multiple messages automatically
- 🎯 **Action Buttons**: Support for interactive buttons with Material Design integration
- 📦 **Multiple Formats**: UMD, ESM, and CommonJS module support
- ♿ **Accessible**: ARIA attributes and keyboard navigation support
- 🎭 **Material Design**: Optional integration with Material Design web components

## Installation

### NPM

```bash
npm install minisnackbar
```

### CDN

```html
<script src="https://unpkg.com/minisnackbar/dist/minisnackbar.js"></script>
```

> **Note:** Omitting the version number will always load the latest version. For production stability, consider pinning to a specific version (e.g., `@1.0.1`).

### Manual Download

Download the latest release from the [GitHub releases page](https://github.com/shantoislamdev/minisnackbar/releases) and include the `dist/minisnackbar.js` file in your project.

## Quick Start

### Basic Setup

```javascript
import Snackbar from 'minisnackbar';

// Initialize (required)
Snackbar.init();

// Show a simple message
Snackbar.add('Hello, world!');
```

### Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <button id="show-btn">Show Message</button>

    <script src="dist/minisnackbar.js"></script>
    <script>
        // Initialize first
        Snackbar.init();

        // Add event listener
        document.getElementById('show-btn').addEventListener('click', () => {
            Snackbar.add('Button clicked!');
        });
    </script>
</body>
</html>
```

## API Reference

### Initialization

#### `Snackbar.init(options?)`

Initializes the MiniSnackbar library. This method must be called before using any other methods.

**Parameters:**
- `options` (Object, optional): Configuration options
  - `transitionDuration` (number, optional): Animation duration in milliseconds (default: 250)

**Returns:** `void`

**Example:**
```javascript
// Basic initialization
Snackbar.init();

// With custom transition duration
Snackbar.init({ transitionDuration: 500 });
```

### Message Display

#### `Snackbar.add(message, action?, duration?)`

Adds a message to the display queue. Messages are shown in order, respecting the current display state.

**Parameters:**
- `message` (string): The text content to display
- `action` (Object, optional): Action button configuration
  - `text` (string): Button label text
  - `handler` (function): Click event handler function
- `duration` (number, optional): Display duration in milliseconds (default: 3000)

**Returns:** `void`

**Examples:**
```javascript
// Simple message
Snackbar.add('File saved successfully');

// With action button
Snackbar.add('Item deleted', {
  text: 'UNDO',
  handler: () => {
    // Restore the deleted item
    restoreItem();
  }
});

// Custom duration
Snackbar.add('Long message', null, 5000);
```

#### `Snackbar.show(message, action?, duration?)`

Immediately displays a message, interrupting any currently shown snackbar.

**Parameters:** Same as `Snackbar.add()`

**Returns:** `void`

**Example:**
```javascript
// Interrupt current message
Snackbar.show('Urgent notification!');
```

### Queue Management

#### `Snackbar.clearQueue()`

Removes all pending messages from the queue.

**Returns:** `void`

**Example:**
```javascript
Snackbar.clearQueue();
```

#### `Snackbar.hideCurrent()`

Hides the currently displayed snackbar immediately.

**Returns:** `void`

**Example:**
```javascript
Snackbar.hideCurrent();
```

### State Management

#### `Snackbar.destroy()`

Completely cleans up the snackbar instance, removing DOM elements and resetting all state.

**Returns:** `void`

**Example:**
```javascript
// Clean up when done
Snackbar.destroy();
```

#### `Snackbar.isInitialized()`

Checks if the snackbar has been initialized.

**Returns:** `boolean` - True if initialized, false otherwise

**Example:**
```javascript
if (Snackbar.isInitialized()) {
  Snackbar.add('Already initialized');
}
```

#### `Snackbar.getTransitionDuration()`

Gets the current transition duration in milliseconds.

**Returns:** `number` - Transition duration

**Example:**
```javascript
const duration = Snackbar.getTransitionDuration();
console.log(`Transition takes ${duration}ms`);
```

## Configuration

### Transition Duration

You can customize the animation speed by setting the transition duration during initialization:

```javascript
Snackbar.init({ transitionDuration: 300 }); // Faster animations
```

This affects both show and hide transitions.

## Styling and Theming

MiniSnackbar uses CSS variables for easy customization. Define these variables in your stylesheet before initializing the library.

### CSS Variables

```css
:root {
  /* Color scheme */
  --mini-snackbar-bg: #323232;           /* Background color */
  --mini-snackbar-text: #ffffff;         /* Text color */

  /* Button styling */
  --mini-snackbar-btn-text: #4CAF50;     /* Button text color */
  --mini-snackbar-btn-bg: transparent;   /* Button background */

  /* Shape and layout */
  --mini-snackbar-radius: 4px;           /* Border radius */
  --mini-snackbar-shadow: 0 2px 8px rgba(0,0,0,0.3); /* Box shadow */

  /* Typography */
  --mini-snackbar-font-family: inherit;  /* Font family */

  /* Advanced button properties */
  --mini-snackbar-btn-radius: 4px;       /* Button border radius */
  --mini-snackbar-btn-hover-opacity: 0.8; /* Button hover opacity */
  --mini-snackbar-btn-hover-outline: 2px solid var(--mini-snackbar-btn-text);
  --mini-snackbar-btn-outline-offset: 2px;
  --mini-snackbar-btn-focus-outline: 2px solid var(--mini-snackbar-btn-text);

  /* Animation */
  --mini-snackbar-transition: transform 250ms ease-in-out;
}
```

### Dark Theme Example

```css
/* Dark theme */
:root {
  --mini-snackbar-bg: #1a1a1a;
  --mini-snackbar-text: #ffffff;
  --mini-snackbar-btn-text: #64b5f6;
}

/* Light theme */
.light-theme {
  --mini-snackbar-bg: #ffffff;
  --mini-snackbar-text: #1a1a1a;
  --mini-snackbar-btn-text: #1976d2;
}
```

### CSS Class Overrides

For more advanced customization, override the default CSS classes:

```css
/* Custom snackbar styles */
.mini-snackbar {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  letter-spacing: 0.5px;
}

/* Custom show animation */
.mini-snackbar.show {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
```

### Material Design Integration

MiniSnackbar automatically detects and integrates with Material Design web components:

```html
<script type="importmap">
    {
      "imports": {
        "@material/web/": "https://esm.run/@material/web/"
      }
    }
  </script>
  <script type="module">
    import '@material/web/all.js';
  </script>
<script src="dist/minisnackbar.js"></script>
<script>
  Snackbar.init();
  // Now uses native md-text-button components
</script>
```

## Advanced Usage

### Queue Management

Messages are automatically queued and displayed sequentially:

```javascript
// Multiple messages will queue automatically
Snackbar.add('First message');
Snackbar.add('Second message');
Snackbar.add('Third message');
```

### Interrupting Messages

Use `show()` to interrupt the current message:

```javascript
Snackbar.add('This will be interrupted', null, 10000);
setTimeout(() => {
  Snackbar.show('Urgent message!'); // Interrupts the long message
}, 1000);
```

### Cleanup and Memory Management

Always clean up when you're done:

```javascript
// In a single-page application
window.addEventListener('beforeunload', () => {
  Snackbar.destroy();
});
```

### Error Handling

The library includes built-in error handling and warnings:

```javascript
// These will log warnings but not throw errors
Snackbar.add(''); // Empty message - warning logged
Snackbar.add('Valid message', { text: '', handler: () => {} }); // Invalid action
```

## Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

### Polyfills

For older browsers, consider adding these polyfills:

```html
<!-- CSS color-mix() support -->
<script src="https://unpkg.com/css-color-mix-polyfill@1.0.0/dist/index.js"></script>
```

## Accessibility

MiniSnackbar follows accessibility best practices:

- **ARIA Attributes**: Uses `role="alert"` and `aria-live="assertive"`
- **Keyboard Navigation**: Action buttons are focusable and keyboard accessible
- **Screen Readers**: Messages are announced to assistive technologies
- **Reduced Motion**: Respects `prefers-reduced-motion` media query

### Custom ARIA Labels

```javascript
// The library automatically handles ARIA attributes
// No additional configuration needed
```

## Troubleshooting

### Common Issues

#### Snackbar not showing
- Ensure `Snackbar.init()` has been called
- Check that the DOM is ready (`DOMContentLoaded` event)
- Verify no JavaScript errors in the console

#### Styling not applying
- Define CSS variables before calling `init()`
- Ensure CSS is loaded before JavaScript
- Check for CSS specificity conflicts

#### Action buttons not working
- Verify the `handler` is a function
- Check for JavaScript errors in the handler
- Ensure Material Design components are loaded if using them

### Debug Mode

Enable debug logging:

```javascript
// The library logs warnings for invalid inputs
// Check browser console for debugging information
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/shantoislamdev/minisnackbar.git
cd minisnackbar

# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For more information, visit the [GitHub repository](https://github.com/shantoislamdev/minisnackbar).
