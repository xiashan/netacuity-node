/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:51:24
 * @LastEditTime: 2021-10-19 10:38:41
 */
const requestIp = require('request-ip');
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

/**
 * get client geo info
 * @param {object} [req]
 * @param {object} [options] - Configuration.
 * @param {number} [options.databaseType]
 * @param {string} [options.netAcuityIp]
 * @param {number} [options.apiId]
 * @param {number} [options.timeoutDelay]
 * @return {*}
 */
async function getClientInfo(req, options) {
  if (is.not.object(options)) {
    throw new TypeError('Options must be an object!');
  }
  const {databaseType = 3, netAcuityIp = '47.88.65.136', apiId = 64, timeoutDelay = 2000} = options;
  if (!netAcuityIp) {
    throw new TypeError('NetAcuityIp must be exist!');
  }

  const clientIp = requestIp.getClientIp(req);
  //clientIp = '118.26.73.210';
  // console.log('clientIp:', clientIp);
  const queryParam = [databaseType, apiId, clientIp, netAcuityIp, timeoutDelay];
  const data = await netAcuityAPI.queryNetAcuityServer(queryParam);
  // console.log('geoData:', data);
  return data;
}

/**
 * Expose client geo as a middleware.
 *
 * @param {object} [options] - Configuration.
 * @param {string} [options.attributeName] - Name of attribute to augment request object with.
 * @return {*}
 */
function mw(options = {}) {
  // Validation.
  if (is.not.object(options)) {
    throw new TypeError('Options must be an object!');
  }

  const attributeName = options.attributeName || 'clientInfo';
  return (req, res, next) => {
    const data = await getClientInfo(req, options);
    Object.defineProperty(req, attributeName, {
      get: () => data,
      configurable: true,
    });
    next();
  };
}

module.exports = {
  getClientInfo,
  mw,
};
