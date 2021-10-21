/*
 * @Author: xiashan
 * @Date: 2021-10-13 18:51:24
 * @LastEditTime: 2021-10-21 10:16:00
 */
import requestIp from 'request-ip';
import {queryNetAcuityServer} from './lib/NetAcuityAPI.js';

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
export const getClientInfo = async (req, options) => {
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
    return await queryNetAcuityServer(queryParam, rawBoolean);
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Expose client geo as a middleware.
 *
 * @param {object} [options] - Configuration.
 * @param {string} [options.attributeName] - Name of attribute to augment request object with.
 * @return {*}
 */
export const mw = (options = {}) => {
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
};
