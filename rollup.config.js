import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
    input: 'index.js',
    output: [
        {
            file: 'dist/minisnackbar.js',
            format: 'umd',
            name: 'Snackbar',
            sourcemap: true
        },
        {
            file: 'dist/minisnackbar.min.js',
            format: 'umd',
            name: 'Snackbar',
            plugins: [terser()],
            sourcemap: true
        },
        {
            file: 'dist/minisnackbar.esm.js',
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [resolve()]
};
