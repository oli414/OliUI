import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';

export default {
    input: './src/index.js',
    output: {
        file: './demobuild/out.js',
        format: 'iife'
    },
    plugins: [
        getBabelOutputPlugin({
            babelHelpers: "bundled",
            presets: [
                "@babel/preset-env"
            ]
        })
    ]
};