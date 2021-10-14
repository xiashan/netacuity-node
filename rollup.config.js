/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:51:47
 * @LastEditTime: 2021-10-14 11:25:31
 */

import typescript from '@rollup/plugin-typescript';
export default {
  input: 'src/index.ts',
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
  plugins: [
    typescript({
      sourceMap: false,
      tsconfig: './tsconfig.json',
    }),
  ],
};
