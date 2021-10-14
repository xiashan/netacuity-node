/**
 * 当前函数库版本
 */

const netAcuityAPI = require('./lib/NetAcuityAPI.js');
const databaseEnums = {
  geo: 3,
  edge: 4,
  sic: 5,
  domain: 6,
  zip: 7,
  isp: 8,
  home_biz: 9,
  asn: 10,
  language: 11,
  proxy: 12,
  isAnIsp: 14,
  company: 15,
  demographics: 17,
  naics: 18,
  cbsa: 19,
  mobileCarrier: 24,
  organization: 25,
  pulse: 26,
  pulseplus: 30,
};

exports.query = async function () {
  const queryParam = [databaseEnums.geo, 64, '118.26.73.210', '47.88.65.136', 2000];
  return await netAcuityAPI.queryNetAcuityServer(queryParam);
};
