/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:57:09
 * @LastEditTime: 2021-10-14 17:22:13
 */
import {version} from '../src/index';
test('当前项目版本为 1.0.0', () => {
  expect(version).toBe('1.0.0');
});
