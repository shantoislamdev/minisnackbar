import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const sourcePlugins = [
  resolve(),
  typescript({
    tsconfig: './tsconfig.build.json',
    declaration: true,
    declarationDir: './dist',
    rootDir: './src'
  })
]

const browserPlugins = [
  resolve(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    declarationMap: false,
    rootDir: './src'
  })
]

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/minisnackbar.cjs',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        globals: {}
      },
      {
        file: 'dist/minisnackbar.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: sourcePlugins
  },
  {
    input: 'src/browser.ts',
    output: [
      {
        file: 'dist/minisnackbar.js',
        format: 'iife',
        name: 'Snackbar',
        sourcemap: true,
        exports: 'default'
      },
      {
        file: 'dist/minisnackbar.min.js',
        format: 'iife',
        name: 'Snackbar',
        plugins: [terser()],
        sourcemap: true,
        exports: 'default'
      }
    ],
    plugins: browserPlugins
  }
]
