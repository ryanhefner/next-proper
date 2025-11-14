import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import pkg from './package.json'

const input = 'src/index.js'

const defaultOutputOptions = {
  name: pkg.name,
  exports: 'named',
  format: 'umd',
  globals: {},
  banner: `/*! ${pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} Ryan Hefner | ${pkg.license} License | ${pkg.repository.url} !*/`,
  footer: '/* follow me on X/Twitter: @ryanhefner */',
}

const defaultPlugins = [
  peerDepsExternal(),
  json(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'runtime',
    presets: ['@babel/preset-env'],
  }),
]

const external = []

export default [
  // UMD - Minified
  {
    input,
    external,
    output: [
      {
        ...defaultOutputOptions,
        file: `dist/${pkg.name}.min.js`,
        format: 'umd',
      },
    ],
    plugins: [...defaultPlugins, terser()],
  },
  // UMD
  {
    input,
    external,
    output: [
      {
        ...defaultOutputOptions,
        file: `dist/${pkg.name}.js`,
        format: 'umd',
      },
    ],
    plugins: [...defaultPlugins],
  },
  // ES
  {
    input,
    external,
    output: [
      {
        ...defaultOutputOptions,
        file: 'dist/esm/index.mjs',
        format: 'esm',
      },
    ],
    plugins: [...defaultPlugins],
  },
  // CJS
  {
    input,
    external,
    output: [
      {
        ...defaultOutputOptions,
        file: 'dist/cjs/index.cjs',
        format: 'cjs',
        exports: 'auto',
      },
    ],
    plugins: [...defaultPlugins],
  },
]
