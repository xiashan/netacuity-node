/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:51:47
 * @LastEditTime: 2021-10-19 15:06:14
 */

// import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      exports: 'default',
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'es',
    },
  ],
  plugins: [
    // typescript({
    //   sourceMap: false,
    //   tsconfig: './tsconfig.json',
    // }),
    resolve(),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
};
