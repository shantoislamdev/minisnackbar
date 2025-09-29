# MiniSnackbar

A simple, lightweight vanilla JavaScript snackbar/toast library with no dependencies.

## Features

- 🚀 Zero dependencies (works with or without Material Design web components)
- 🎨 Customizable styling
- 📱 Mobile responsive
- ⚡ Lightweight (~2KB minified)
- 🔄 Queue management for multiple messages
- 🎯 Action buttons support (uses Material Design buttons when available, falls back to styled md-text-button elements with data attributes)
- 📦 UMD, ESM, and CommonJS support

## Installation

```bash
npm install minisnackbar
```

## Usage

### Basic Usage

```javascript
import Snackbar from 'minisnackbar';

// Simple message
Snackbar.add('Message sent successfully');
```

### Message with Action Button

```javascript
Snackbar.add('Item deleted', {
  text: 'UNDO',
  handler: () => {
    console.log('Undo clicked');
    // Restore the deleted item
  }
});
```

### Custom Duration

```javascript
// Message with custom duration (5 seconds)
Snackbar.add('Custom duration message', null, 5000);
```

### Browser (Global)

```html
<script src="dist/minisnackbar.js"></script>
<script>
  // Available globally as Snackbar
  Snackbar.add('Hello World!');
</script>
```

## API

### `Snackbar.add(message, action?, duration?)`

Adds a new snackbar message to the queue.

- `message` (string): The message text to display
- `action` (object, optional): Action button configuration
  - `text` (string): Button text
  - `handler` (function): Click handler function
- `duration` (number, optional): Display duration in milliseconds (default: 3000)

### `Snackbar.show(message, action?, duration?)`

Shows a snackbar message immediately, interrupting any currently displayed snackbar.

- `message` (string): The message text to display
- `action` (object, optional): Action button configuration
  - `text` (string): Button text
  - `handler` (function): Click handler function
- `duration` (number, optional): Display duration in milliseconds (default: 3000)

## Styling

The snackbar comes with default Material Design-inspired styling. You can customize it using CSS variables or by overriding the CSS classes.

### CSS Variables

Customize the appearance by defining these CSS variables in your stylesheets. The library uses fallback values if variables are not defined:

```css
:root {
  --mini-snackbar-bg: #333;        /* Background color (default: white/#fff) */
  --mini-snackbar-text: #fff;      /* Text color (default: dark gray/#1a1a1a) */
  --mini-snackbar-btn-text: #4CAF50; /* Button text color (default: blue/#1976d2) */
  --mini-snackbar-btn-bg: transparent; /* Button background (default: transparent) */
  --mini-snackbar-radius: 0.5rem;   /* Border radius (default: 1rem) */
  --mini-snackbar-shadow: 0 2px 8px rgba(0,0,0,0.3); /* Box shadow (default: MD elevation) */
}
```

**Important:** Define these variables in your CSS before loading the MiniSnackbar library to ensure they take effect.

**Note:** Button hover outlines are automatically generated using `color-mix()` to create a darker shade of the button text color (20% black mixed in). In browsers that don't support `color-mix()`, the regular button text color is used for the hover outline.

### CSS Classes

You can also override the default styles directly:

```css
.mini-snackbar {
  /* Your custom styles */
}

.mini-snackbar.show {
  /* Animation styles */
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT
