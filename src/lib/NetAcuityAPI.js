/*
 * ***************************************************************************
 * File:           NetAcuityAPI.js
 * Author:         Digital Envoy
 * Program Name:   NetAcuity API library
 * Version:        6.0.0.7
 * Date:           21-Feb-2017
 *
 * Copyright 2000-2017, Digital Envoy, Inc.  All rights reserved.
 *
 *  Description:
 *    Node JS implementation of the Digital Envoy NetAcuity API library
 *    to query for ip based location data.
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

import dgram from 'dgram';
import randomstring from 'randomstring';
// import xml2js from 'xml2js';
import {
  determineIpType,
  isValidDatabaseId,
  isValidApiId,
  isValidDelay,
  showError,
  showResult,
  generateResponseObject,
} from './NetAcuityTools';

const implementationProtocolVersion = 5;
const nodeJSAPI = 12;
const netAcuityPort = 5400;

/**
 *
 * @param queryParamArray contains the following parameters in order : databaseId, apiId, ipAddress, netAcuityServerIp, timeoutDelay
 * @param callback the user provided function that handles the asynchronous listeners' results
 * @param rawBoolean true if the user wants to receive raw data instead of a generated object
 */
export const queryNetAcuityServer = (queryParamArray, rawBoolean = false) => {
  const [databaseId, apiId, ipAddress, netAcuityIp, timeoutDelay] = queryParamArray;
  //check if queryParamArray has appropriate values
  const ipType = determineIpType(netAcuityIp);

  return new Promise((resolve, reject) => {
    if (
      isValidDatabaseId(databaseId) &&
      isValidApiId(apiId) &&
      ipType != undefined &&
      determineIpType(netAcuityIp) != undefined &&
      isValidDelay(timeoutDelay)
    ) {
      //set socket type and query string
      const client = ipType === 4 ? dgram.createSocket('udp4') : dgram.createSocket('udp6');
      const transactionId = randomstring.generate({
        length: 10,
        charset: 'alphanumeric',
      });
      const queryString =
        databaseId +
        ';' +
        apiId +
        ';' +
        ipAddress +
        ';' +
        implementationProtocolVersion +
        ';' +
        nodeJSAPI +
        ';' +
        transactionId +
        ';';
      const bufferMessage = Buffer.from(queryString);

      //if the request times out, close the client and call the callback function with the response
      const timeoutObject = setTimeout(function (err) {
        client.close();
        if (err) {
          return reject(showError('SERVICE_ERROR', err));
        }
        return reject(showError('TIMEOUT', transactionId));
      }, timeoutDelay);

      //parses the message received from the netacuity server and calls a function that generates the response objects and calls the callback function
      client.on('message', function (message) {
        client.close();
        clearTimeout(timeoutObject);
        const msg = message.toString();

        if (rawBoolean) {
          return resolve(showResult(msg));
        }

        const delimitedArray = msg.split(';');
        //find the transactionId section, followed by the error, and then the fields - sometimes netacuity server pads with an extra field
        let index = 0;
        while (delimitedArray[index] != transactionId && index < delimitedArray.length) {
          index++;
        }
        if (index >= delimitedArray.length - 1) {
          return reject(showError('IDENTIFY_ERROR'));
        }

        if (delimitedArray[index + 1] == '') {
          //make sure error field is empty
          const responseArray = delimitedArray.slice(index + 2, delimitedArray.length - 1);
          const paramArray = [databaseId, transactionId, ipAddress];
          const response = generateResponseObject(paramArray, responseArray);
          return resolve(response);
        } else {
          return reject(showError('SERVICE_ERROR', `Error: ${delimitedArray[index + 1]}`));
        }
      });
      //send the request
      client.send(bufferMessage, 0, bufferMessage.length, netAcuityPort, netAcuityIp, function (err) {
        if (err) {
          return reject(showError('SERVICE_ERROR', err));
        }
        // console.log('Querying NetAcuity Server : ' + queryString);
      });
    } else {
      reject(showError('PARAM_ERROR', err));
    }
  });
};
