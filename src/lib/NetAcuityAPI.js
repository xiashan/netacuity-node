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

const {rejects} = require('assert');
var dgram = require('dgram');
const {resolve} = require('path');
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
exports.queryNetAcuityServer = function (queryParamArray, callback, rawBoolean) {
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
          reject(netAcuityTools.showError('SERVICE_ERROR', 'err'));
          return;
        }
        callback(
          'Error : Request timed out after ' + timeoutDelay + ' milliseconds for transaction : ' + transactionId,
        );
      }, timeoutDelay);

      //parses the message received from the netacuity server and calls a function that generates the response objects and calls the callback function
      client.on('message', function (message) {
        client.close();
        clearTimeout(timeoutObject);
        var msg = message.toString();

        if (rawBoolean) {
          return callback(msg);
        }
        var delimitedArray = msg.split(';');

        //find the transactionId section, followed by the error, and then the fields - sometimes netacuity server pads with an extra field
        var index = 0;
        while (delimitedArray[index] != transactionId && index < delimitedArray.length) {
          index++;
        }

        if (index >= delimitedArray.length - 1) {
          return callback('Error : transaction id from response does not match transaction id of request.');
        }

        if (delimitedArray[index + 1] == '') {
          //make sure error field is empty
          var responseArray = delimitedArray.slice(index + 2, delimitedArray.length - 1);
          var paramArray = [databaseId, transactionId, ipAddress];
          netAcuityTools.generateResponseObject(paramArray, responseArray, callback);
        } else {
          return callback('Error : ' + delimitedArray[index + 1]);
        }
      });
      //send the request
      client.send(bufferMessage, 0, bufferMessage.length, netAcuityPort, netAcuityIp, function (err) {
        if (err) {
          return callback(err);
        }
        console.log('Querying NetAcuity Server : ' + queryString);
      });
    } else {
      var error = 'Please make sure the values in your input array are correct.';
      console.log(error);
      callback(error);
    }
  });
};

/**
 *
 * @param queryParamArray contains the following parameters in order : [array of databaseIds], apiId, ipAddress, netAcuityServerIp, timeoutDelay, port
 * @param callback the user provided function that handles the asynchronous listener's results
 * @param rawBoolean true if the user wants to receive raw data instead of a generated object
 */
exports.queryXMLNetAcuityServer = function (queryParamArray, callback, rawBoolean) {
  var databaseIds = queryParamArray[0];
  var apiId = queryParamArray[1];
  var ipAddress = queryParamArray[2];
  var netAcuityIp = queryParamArray[3];
  var timeoutDelay = queryParamArray[4];

  var responseObject;
  var databaseIdArray = databaseIds;
  var ipType = netAcuityTools.determineIpType(netAcuityIp);

  for (var id in databaseIdArray) {
    if (!netAcuityTools.isValidDatabaseId(databaseIdArray[id])) {
      return callback('Error : Please make sure all databaseIds are valid.');
    }
  }

  //check if queryParamArray has appropriate values
  if (
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
    var queryString = '<request trans-id="' + transactionId + '" ip="' + ipAddress + '" api-id="' + apiId + '">';
    for (var id in databaseIds) {
      queryString += ' <query db="' + databaseIdArray[id] + '"/>';
    }
    queryString += ' </request>';
    var bufferMessage = new Buffer(queryString);

    //if the request times out, close the client and call the callback function with the response
    var timeoutObject = setTimeout(function (err) {
      client.close();
      if (err) {
        return callback(err);
      }
      callback('Error : Request timed out after ' + timeoutDelay + ' milliseconds for transaction : ' + transactionId);
    }, timeoutDelay);

    //parses the message received from the netacuity server and calls a function that generates the response object and calls the callback function
    client.on('message', function (message) {
      client.close();
      clearTimeout(timeoutObject);
      var msg = message.toString();

      if (rawBoolean) {
        return callback(msg);
      }

      var cleanMsg = msg.slice(msg.indexOf('<'), msg.length);
      var parser = new xml2js.Parser();
      parser.parseString(cleanMsg, function (err, result) {
        if (err) {
          responseObject = err.toString();
          console.log('Error : ' + responseObject);
          return callback(responseObject);
        }
        netAcuityTools.generateXMLResponseObject(result, transactionId, callback);
      });
    });
    //send the request
    client.send(bufferMessage, 0, bufferMessage.length, netAcuityPort, netAcuityIp, function (err) {
      if (err) {
        return callback(err);
      }
      console.log('Querying NetAcuity Server : ' + queryString);
    });
  } else {
    var error = 'Please make sure the values in your input array are correct.';
    console.log(error);
    callback(error);
  }
};
