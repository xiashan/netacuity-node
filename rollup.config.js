/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:51:47
 * @LastEditTime: 2021-10-20 20:24:06
 */

// import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
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
    // terser(),
  ],
};
