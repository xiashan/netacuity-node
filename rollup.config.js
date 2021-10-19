/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:51:47
 * @LastEditTime: 2021-10-19 14:22:01
 */

import typescript from '@rollup/plugin-typescript';
export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'es',
    },
  ],
  // plugins: [
  //   typescript({
  //     sourceMap: false,
  //     tsconfig: './tsconfig.json',
  //   }),
  // ],
};
