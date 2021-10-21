/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:57:09
 * @LastEditTime: 2021-10-21 11:22:53
 */
import {getClientInfo} from '../src/index';
// const netacuityNode = require('../dist/bundle.cjs');

test('当前访问者国家是cn', async () => {
  const req = {
    connection: {
      remoteAddress: '118.26.73.210',
    },
  };
  const options = {
    netAcuityIp: '47.88.65.136',
  };
  const data = await getClientInfo(req, options);
  // const data = await netacuityNode.getClientInfo(req, options);
  expect(data['two-letter-country']).toBe('cn');
});
