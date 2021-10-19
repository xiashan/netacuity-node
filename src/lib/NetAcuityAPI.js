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

var dgram = require('dgram');
var randomstring = require('randomstring');
var xml2js = require('xml2js');
var netAcuityTools = require('./NetAcuityTools.js');

var implementationProtocolVersion = 5;
var nodeJSAPI = 12;
var netAcuityPort = 5400;

/**
 *
 * @param queryParamArray contains the following parameters in order : databaseId, apiId, ipAddress, netAcuityServerIp, timeoutDelay
 * @param callback the user provided function that handles the asynchronous listeners' results
 * @param rawBoolean true if the user wants to receive raw data instead of a generated object
 */
exports.queryNetAcuityServer = function (queryParamArray, rawBoolean = false) {
  var databaseId = queryParamArray[0];
  var apiId = queryParamArray[1];
  var ipAddress = queryParamArray[2];
  var netAcuityIp = queryParamArray[3];
  var timeoutDelay = queryParamArray[4];
  //check if queryParamArray has appropriate values
  var ipType = netAcuityTools.determineIpType(netAcuityIp);

  return new Promise((resolve, reject) => {
    if (
      netAcuityTools.isValidDatabaseId(databaseId) &&
      netAcuityTools.isValidApiId(apiId) &&
      ipType != undefined &&
      netAcuityTools.determineIpType(netAcuityIp) != undefined &&
      netAcuityTools.isValidDelay(timeoutDelay)
    ) {
      //set socket type and query string
      var client = ipType === 4 ? dgram.createSocket('udp4') : dgram.createSocket('udp6');
      var transactionId = randomstring.generate({
        length: 10,
        charset: 'alphanumeric',
      });
      var queryString =
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
      var bufferMessage = Buffer.from(queryString);

      //if the request times out, close the client and call the callback function with the response
      var timeoutObject = setTimeout(function (err) {
        client.close();
        if (err) {
          return reject(netAcuityTools.showError('SERVICE_ERROR', err));
        }
        return reject(netAcuityTools.showError('TIMEOUT', transactionId));
      }, timeoutDelay);

      //parses the message received from the netacuity server and calls a function that generates the response objects and calls the callback function
      client.on('message', function (message) {
        client.close();
        clearTimeout(timeoutObject);
        var msg = message.toString();

        if (rawBoolean) {
          return resolve(netAcuityTools.showResult(msg));
        }

        var delimitedArray = msg.split(';');
        //find the transactionId section, followed by the error, and then the fields - sometimes netacuity server pads with an extra field
        var index = 0;
        while (delimitedArray[index] != transactionId && index < delimitedArray.length) {
          index++;
        }
        if (index >= delimitedArray.length - 1) {
          return reject(netAcuityTools.showError('IDENTIFY_ERROR'));
        }

        if (delimitedArray[index + 1] == '') {
          //make sure error field is empty
          var responseArray = delimitedArray.slice(index + 2, delimitedArray.length - 1);
          var paramArray = [databaseId, transactionId, ipAddress];
          const response = netAcuityTools.generateResponseObject(paramArray, responseArray);
          return resolve(response);
        } else {
          return reject(netAcuityTools.showError('SERVICE_ERROR', `Error: ${delimitedArray[index + 1]}`));
        }
      });
      //send the request
      client.send(bufferMessage, 0, bufferMessage.length, netAcuityPort, netAcuityIp, function (err) {
        if (err) {
          return reject(netAcuityTools.showError('SERVICE_ERROR', err));
        }
        // console.log('Querying NetAcuity Server : ' + queryString);
      });
    } else {
      reject(netAcuityTools.showError('PARAM_ERROR', err));
    }
  });
};
