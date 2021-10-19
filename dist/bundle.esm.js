/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:51:24
 * @LastEditTime: 2021-10-19 14:13:33
 */
const requestIp = require('request-ip');
const netAcuityAPI = require('./lib/NetAcuityAPI.js');

function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * get client geo info
 * @param {object} [req]
 * @param {object} [options] - Configuration.
 * @param {number} [options.databaseType]
 * @param {string} [options.netAcuityIp]
 * @param {number} [options.apiId]
 * @param {number} [options.timeoutDelay]
 * @param {boolean} [options.rawBoolean]
 * @return {*}
 */
async function getClientInfo(req, options) {
  if (!isObject(options)) {
    throw new TypeError('Options must be an object!');
  }
  const {databaseType = 3, apiId = 64, netAcuityIp, timeoutDelay = 2000, rawBoolean = false} = options;
  if (!netAcuityIp) {
    throw new Error('NetAcuityIp must be exist!');
  }

  const clientIp = requestIp.getClientIp(req);
  const queryParam = [databaseType, apiId, clientIp, netAcuityIp, timeoutDelay];
  try {
    return await netAcuityAPI.queryNetAcuityServer(queryParam, rawBoolean);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Expose client geo as a middleware.
 *
 * @param {object} [options] - Configuration.
 * @param {string} [options.attributeName] - Name of attribute to augment request object with.
 * @return {*}
 */
function mw(options = {}) {
  if (!isObject(options)) {
    throw new TypeError('Options must be an object!');
  }

  const attributeName = options.attributeName || 'clientInfo';
  return async (req, res, next) => {
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
