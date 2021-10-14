/*
 * ***************************************************************************
 * File:           NetAcuityTools.js
 * Author:         Digital Envoy
 * Program Name:   NetAcuity API library
 * Version:        6.0.0.7
 * Date:           21-Feb-2017
 *
 * Copyright 2000-2017, Digital Envoy, Inc.  All rights reserved.
 *
 *  Description:
 *    Supporting functions for the Node JS implementation
 *    of the Digital Envoy NetAcuity API library to query
 *    for ip based location data.
 *
 *
 *
 * This library is provided as an access method to the NetAcuity software
 * provided to you under License Agreement from Digital Envoy Inc.
 * You may NOT redistribute it and/or modify it in any way without express
 * written consent of Digital Envoy, Inc.
 *
 * Address bug reports and comments to:  tech-support@digitalenvoy.net
 *
 *
 * **************************************************************************
 */

var validator = require('validator');

var commonError = {
  ERROR: [1001, 'Service Error', 'Service Error'],
  TIMEOUT: [1002, 'Request timed out for transaction %s', 'Service Error'],
  IDENTIFY_ERROR: [1003, 'Transaction id not match', 'Service Error'],
  SERVICE_ERROR: [1004, 'NetAcuity service error %s', 'Service Error'],
  PARAM_ERROR: [1005, 'Params Error', 'Service Error'],
};

var databaseEnums = {
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

function na_geo(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['country'] = response[0] == undefined ? '?' : response[0];
  this['region'] = response[1] == undefined ? '?' : response[1];
  this['city'] = response[2] == undefined ? '?' : response[2];
  this['conn-speed'] = response[3] == undefined ? '?' : response[3];
  this['country-conf'] = response[4] == undefined ? 0 : response[4];
  this['region-conf'] = response[5] == undefined ? 0 : response[5];
  this['city-conf'] = response[6] == undefined ? 0 : response[6];
  this['metro-code'] = response[7] == undefined ? 0 : response[7];
  this['latitude'] = response[8] == undefined ? 0 : response[8];
  this['longitude'] = response[9] == undefined ? 0 : response[9];
  this['country-code'] = response[10] == undefined ? 0 : response[10];
  this['region-code'] = response[11] == undefined ? 0 : response[11];
  this['city-code'] = response[12] == undefined ? 0 : response[12];
  this['continent-code'] = response[13] == undefined ? 0 : response[13];
  this['two-letter-country'] = response[14] == undefined ? '?' : response[14];
}

function na_edge(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['edge-country'] = response[0] == undefined ? '?' : response[0];
  this['edge-region'] = response[1] == undefined ? '?' : response[1];
  this['edge-city'] = response[2] == undefined ? '?' : response[2];
  this['edge-conn-speed'] = response[3] == undefined ? '?' : response[3];
  this['edge-metro-code'] = response[4] == undefined ? 0 : response[4];
  this['edge-latitude'] = response[5] == undefined ? 0 : response[5];
  this['edge-longitude'] = response[6] == undefined ? 0 : response[6];
  this['edge-postal-code'] = response[7] == undefined ? '?' : response[7];
  this['edge-country-code'] = response[8] == undefined ? 0 : response[8];
  this['edge-region-code'] = response[9] == undefined ? 0 : response[9];
  this['edge-city-code'] = response[10] == undefined ? 0 : response[10];
  this['edge-continent-code'] = response[11] == undefined ? 0 : response[11];
  this['edge-two-letter-country'] = response[12] == undefined ? '?' : response[12];
  this['edge-internal-code'] = response[13] == undefined ? 0 : response[13];
  this['edge-area-codes'] = response[14] == undefined ? '?' : response[14];
  this['edge-country-conf'] = response[15] == undefined ? 0 : response[15];
  this['edge-region-conf'] = response[16] == undefined ? 0 : response[16];
  this['edge-city-conf'] = response[17] == undefined ? 0 : response[17];
  this['edge-postal-conf'] = response[18] == undefined ? 0 : response[18];
  this['edge-gmt-offset'] = response[19] == undefined ? 0 : response[19];
  this['edge-in-dst'] = response[20] == undefined ? '?' : response[20];
}

function na_sic(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['sic-code'] = response[0] == undefined ? 0 : response[0];
}

function na_domain(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['domain-name'] = response[0] == undefined ? '?' : response[0];
}

function na_zip(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['area-code'] = response[0] == undefined ? 0 : response[0];
  this['zip-code'] = response[1] == undefined ? 0 : response[1];
  this['gmt-offset'] = response[2] == undefined ? 0 : response[2];
  this['in-dst'] = response[3] == undefined ? '?' : response[3];
  this['zip-code-text'] = response[4] == undefined ? '?' : response[4];
  this['zip-country'] = response[5] == undefined ? '?' : response[5];
}

function na_isp(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['isp-name'] = response[0] == undefined ? '?' : response[0];
}

function na_home_biz(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['homebiz-type'] = response[0] == undefined ? '?' : response[0];
}

function na_asn(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['asn'] = response[0] == undefined ? 0 : response[0];
  this['asn-name'] = response[1] == undefined ? '?' : response[1];
}

function na_language(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['primary-lang'] = response[0] == undefined ? '?' : response[0];
  this['secondary-lang'] = response[1] == undefined ? '?' : response[1];
}

function na_proxy(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['proxy-type'] = response[0] == undefined ? '?' : response[0];
  this['proxy-description'] = response[1] == undefined ? '?' : response[1];
}

function na_is_an_isp(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['is-an-isp'] = response[0] == undefined ? '?' : response[0];
}

function na_company(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['company-name'] = response[0] == undefined ? '?' : response[0];
}

function na_demographics(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['rank'] = response[0] == undefined ? 0 : response[0];
  this['households'] = response[1] == undefined ? 0 : response[1];
  this['women'] = response[2] == undefined ? 0 : response[2];
  this['w18-34'] = response[3] == undefined ? 0 : response[3];
  this['w35-49'] = response[4] == undefined ? 0 : response[4];
  this['men'] = response[5] == undefined ? 0 : response[5];
  this['m18-34'] = response[6] == undefined ? 0 : response[6];
  this['m35-49'] = response[7] == undefined ? 0 : response[7];
  this['teens'] = response[8] == undefined ? 0 : response[8];
  this['kids'] = response[9] == undefined ? 0 : response[9];
}

function na_naics(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['naics-code'] = response[0] == undefined ? 0 : response[0];
}

function na_cbsa(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['cbsa-code'] = response[0] == undefined ? 0 : response[0];
  this['cbsa-title'] = response[1] == undefined ? '?' : response[1];
  this['cbsa-type'] = response[2] == undefined ? '?' : response[2];
  this['csa-code'] = response[3] == undefined ? 0 : response[3];
  this['csa-title'] = response[4] == undefined ? '?' : response[4];
  this['md-code'] = response[5] == undefined ? 0 : response[5];
  this['md-title'] = response[6] == undefined ? '?' : response[6];
}

function na_mobile_carrier(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['mobile-carrier'] = response[0] == undefined ? '?' : response[0];
  this['mcc'] = response[1] == undefined ? 0 : response[1];
  this['mnc'] = response[2] == undefined ? 0 : response[2];
  this['mobile-carrier-code'] = response[2] == undefined ? 0 : response[3];
}

function na_organization(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['organization-name'] = response[0] == undefined ? '?' : response[0];
}

function na_pulse(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['pulse-country'] = response[0] == undefined ? '?' : response[0];
  this['pulse-region'] = response[1] == undefined ? '?' : response[1];
  this['pulse-city'] = response[2] == undefined ? '?' : response[2];
  this['pulse-conn-speed'] = response[3] == undefined ? '?' : response[3];
  this['pulse-conn-type'] = response[4] == undefined ? '?' : response[4];
  this['pulse-metro-code'] = response[5] == undefined ? 0 : response[5];
  this['pulse-latitude'] = response[6] == undefined ? 0 : response[6];
  this['pulse-longitude'] = response[7] == undefined ? 0 : response[7];
  this['pulse-postal-code'] = response[8] == undefined ? '?' : response[8];
  this['pulse-country-code'] = response[9] == undefined ? 0 : response[9];
  this['pulse-region-code'] = response[10] == undefined ? 0 : response[10];
  this['pulse-city-code'] = response[11] == undefined ? 0 : response[11];
  this['pulse-continent-code'] = response[12] == undefined ? 0 : response[12];
  this['pulse-two-letter-country'] = response[13] == undefined ? '?' : response[13];
  this['pulse-internal-code'] = response[14] == undefined ? 0 : response[14];
  this['pulse-area-codes'] = response[15] == undefined ? '?' : response[15];
  this['pulse-country-conf'] = response[16] == undefined ? 0 : response[16];
  this['pulse-region-conf'] = response[17] == undefined ? 0 : response[17];
  this['pulse-city-conf'] = response[18] == undefined ? 0 : response[18];
  this['pulse-postal-conf'] = response[19] == undefined ? 0 : response[19];
  this['pulse-gmt-offset'] = response[20] == undefined ? 0 : response[20];
  this['pulse-in-dst'] = response[21] == undefined ? '?' : response[21];
}

function na_pulse_plus(queryParamArray, response) {
  this['trans-id'] = queryParamArray == undefined ? '?' : queryParamArray[1];
  this['ip'] = queryParamArray == undefined ? '?' : queryParamArray[2];
  this['pulse-plus-country'] = response[0] == undefined ? '?' : response[0];
  this['pulse-plus-region'] = response[1] == undefined ? '?' : response[1];
  this['pulse-plus-city'] = response[2] == undefined ? '?' : response[2];
  this['pulse-plus-conn-speed'] = response[3] == undefined ? '?' : response[3];
  this['pulse-plus-conn-type'] = response[4] == undefined ? '?' : response[4];
  this['pulse-plus-metro-code'] = response[5] == undefined ? 0 : response[5];
  this['pulse-plus-latitude'] = response[6] == undefined ? 0 : response[6];
  this['pulse-plus-longitude'] = response[7] == undefined ? 0 : response[7];
  this['pulse-plus-postal-code'] = response[8] == undefined ? '?' : response[8];
  this['pulse-plus-postal-ext'] = response[9] == undefined ? '?' : response[9];
  this['pulse-plus-country-code'] = response[10] == undefined ? 0 : response[10];
  this['pulse-plus-region-code'] = response[11] == undefined ? 0 : response[11];
  this['pulse-plus-city-code'] = response[12] == undefined ? 0 : response[12];
  this['pulse-plus-continent-code'] = response[13] == undefined ? 0 : response[13];
  this['pulse-plus-two-letter-country'] = response[14] == undefined ? '?' : response[14];
  this['pulse-plus-internal-code'] = response[15] == undefined ? 0 : response[15];
  this['pulse-plus-area-codes'] = response[16] == undefined ? '?' : response[16];
  this['pulse-plus-country-conf'] = response[17] == undefined ? 0 : response[17];
  this['pulse-plus-region-conf'] = response[18] == undefined ? 0 : response[18];
  this['pulse-plus-city-conf'] = response[19] == undefined ? 0 : response[19];
  this['pulse-plus-postal-conf'] = response[20] == undefined ? 0 : response[20];
  this['pulse-plus-gmt-offset'] = response[21] == undefined ? 0 : response[22];
  this['pulse-plus-in-dst'] = response[22] == undefined ? '?' : response[22];
}

exports.isValidDatabaseId = function (databaseId) {
  for (var key in databaseEnums) {
    if (databaseEnums.hasOwnProperty(key)) {
      if (databaseEnums[key] == databaseId) {
        return true;
      }
    }
  }
  return false;
};

exports.isValidApiId = function (apiId) {
  return validator.isInt(apiId, {min: 0, max: 127});
};

exports.isValidDelay = function (number) {
  return validator.isInt(number);
};

exports.determineIpType = function (ipAddress) {
  var type;
  if (validator.isIP(ipAddress, 4)) {
    type = 4;
  } else if (validator.isIP(ipAddress, 6)) {
    type = 6;
  }
  return type;
};

/**
 *
 * @param queryParamArray an array containint the databaseId, transaciton id, and ip address queried
 * @param responseArray the raw response array
 * @param callback the callback function provided by the user
 */
exports.generateResponseObject = function (queryParamArray, responseArray, callback) {
  var responseObject;
  switch (queryParamArray[0]) {
    case 3:
      responseObject = new na_geo(queryParamArray, responseArray);
      break;
    case 4:
      responseObject = new na_edge(queryParamArray, responseArray);
      break;
    case 5:
      responseObject = new na_sic(queryParamArray, responseArray);
      break;
    case 6:
      responseObject = new na_domain(queryParamArray, responseArray);
      break;
    case 7:
      responseObject = new na_zip(queryParamArray, responseArray);
      break;
    case 8:
      responseObject = new na_isp(queryParamArray, responseArray);
      break;
    case 9:
      responseObject = new na_home_biz(queryParamArray, responseArray);
      break;
    case 10:
      responseObject = new na_asn(queryParamArray, responseArray);
      break;
    case 11:
      responseObject = new na_language(queryParamArray, responseArray);
      break;
    case 12:
      responseObject = new na_proxy(queryParamArray, responseArray);
      break;
    case 14:
      responseObject = new na_is_an_isp(queryParamArray, responseArray);
      break;
    case 15:
      responseObject = new na_company(queryParamArray, responseArray);
      break;
    case 17:
      responseObject = new na_demographics(queryParamArray, responseArray);
      break;
    case 18:
      responseObject = new na_naics(queryParamArray, responseArray);
      break;
    case 19:
      responseObject = new na_cbsa(queryParamArray, responseArray);
      break;
    case 24:
      responseObject = new na_mobile_carrier(queryParamArray, responseArray);
      break;
    case 25:
      responseObject = new na_organization(queryParamArray, responseArray);
      break;
    case 26:
      responseObject = new na_pulse(queryParamArray, responseArray);
      break;
    case 30:
      responseObject = new na_pulse_plus(queryParamArray, responseArray);
      break;
    default:
      console.log('This should not happen.');
  }
  return responseObject;
};

/**
 *
 * @param response the already xml parsed raw object
 * @param transactionId of the request
 * @param callback the callback function provided by the user
 */
exports.generateXMLResponseObject = function (response, transactionId, callback) {
  var xmlObject = response.response.$; //accessing the data parsed after xml2js does its work
  if (xmlObject['trans-id'] != transactionId) {
    var responseObject = 'Error : response transaction id does not match request transaction id.';
    callback(responseObject);
    return;
  }
  for (var x in xmlObject) {
    if (x === 'error' && xmlObject[x] === 'DB Not Loaded') {
      delete xmlObject[x]; //remove "DB Not Loaded" from response object
    }
  }
  callback(xmlObject);
};

exports.showError = function (identify, extra) {
  let errInfo;
  if (!identify || !commonError[identify]) {
    errInfo = commonError.ERROR;
  } else {
    errInfo = commonError[identify];
  }
  const [errNum, errMsg, errShowMsg] = errInfo;
  const data = {
    errNum,
    errMsg,
    errShowMsg,
  };
  if (extra) {
    data.errMsg = data.errMsg.replace('%s', extra);
  }
  return data;
};

exports.showResult = function (data) {
  return {
    errNum: 0,
    data,
  };
};
