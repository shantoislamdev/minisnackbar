# MiniSnackbar

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-blue.svg)

A simple, lightweight snackbar/toast library with no dependencies. Works standalone or seamlessly blends with [Material Web](https://material-web.dev/) components, adapting to your site's theme when available. Since Material Web doesn't provide a snackbar component, this library fills that gap.

## Install

```bash
npm install minisnackbar
```

## Usage

```javascript
import { Snackbar } from 'minisnackbar'

Snackbar.init()
Snackbar.add('Saved successfully')

Snackbar.add('Item deleted', {
  text: 'UNDO',
  handler: () => restoreItem()
})
```

## CDN

```html
<script src="https://unpkg.com/minisnackbar@3.0.0/dist/minisnackbar.min.js"></script>
<script>
  Snackbar.init()
  Snackbar.add('Hello from MiniSnackbar')
</script>
```

## API

- `Snackbar.init(options?)`
- `Snackbar.add(message, action?, duration?)`
- `Snackbar.show(message, action?, duration?)`
- `Snackbar.clearQueue()`
- `Snackbar.hideCurrent()`
- `Snackbar.destroy()`
- `Snackbar.isInitialized()`

## Builds

- ESM: `dist/minisnackbar.esm.js`
- CommonJS: `dist/minisnackbar.cjs`
- Browser global: `dist/minisnackbar.min.js`
- Types: `dist/index.d.ts`

## Documentation

See [docs.md](docs.md) for configuration, styling, and advanced usage.

## License

MIT
