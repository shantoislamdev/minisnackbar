# MiniSnackbar

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-blue.svg)

A simple, lightweight vanilla JavaScript snackbar/toast library with no dependencies. Works standalone or seamlessly blends with [Material Web](https://material-web.dev/) components, adapting to your site's theme when available. Since Material Web doesn't provide a snackbar component, this library fills that gap.

**Author:** Shanto Islam ([shantoislamdev.web.app](https://shantoislamdev.web.app))
**License:** MIT  
**Repository:** [github.com/shantoislamdev/minisnackbar](https://github.com/shantoislamdev/minisnackbar)

## Installation

```bash
npm install minisnackbar
```

## Usage

```javascript
// ES Module
import { Snackbar } from 'minisnackbar'

// CommonJS
const { Snackbar } = require('minisnackbar')

// Initialize
Snackbar.init()

// Show a message
Snackbar.add('Hello, world!')
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Documentation

For full documentation, API reference, and advanced usage, see [docs.md](docs.md).

## License

MIT
