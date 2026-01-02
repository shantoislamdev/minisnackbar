import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/minisnackbar.cjs',
            format: 'umd',
            name: 'Snackbar',
            sourcemap: true,
            exports: 'named',
            globals: {}
        },
        {
            file: 'dist/minisnackbar.js',
            format: 'umd',
            name: 'Snackbar',
            sourcemap: true,
            exports: 'named',
            globals: {}
        },
        {
            file: 'dist/minisnackbar.min.js',
            format: 'umd',
            name: 'Snackbar',
            plugins: [terser()],
            sourcemap: true,
            exports: 'named',
            globals: {}
        },
        {
            file: 'dist/minisnackbar.min.cjs',
            format: 'umd',
            name: 'Snackbar',
            plugins: [terser()],
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
    plugins: [
        resolve(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: './dist',
            rootDir: './src'
        })
    ]
}
