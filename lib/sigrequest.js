'use strict';

/**
* Snagged from official Avocado dev signature code
* https://github.com/AvocadoCorp/avocado-api-samples/blob/master/developer%20signatures/AvocadoSignTest.js
*/

/*global require:false, console:false, module:false */

var crypto = require('crypto');
var events = require('events');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var tty = require('tty');
var util = require('util');

var API_HOST = "avocado.io";
var API_PORT = 443;
var API_URL_BASE = "/api/";
var API_URL_LOGIN =  API_URL_BASE + "authentication/login";
var API_URL_COUPLE = API_URL_BASE + "couple";
var AVOCADO_COOKIE_NAME = "user_email";
var AVOCADO_USER_AGENT = "Avocado Test Api Client v.1.0";
var ERROR_MSG = "FAILED.  Signature was tested and failed. Try again and check the auth information.";

/**
 * @constructor
 * @extends {events.EventEmitter}
 */
function SignatureRequest(config) {
  events.EventEmitter.apply(this);
  this.config = config;
}
util.inherits(SignatureRequest, events.EventEmitter);

SignatureRequest.options = {
  host: API_HOST,
  port: API_PORT,
  path: API_URL_LOGIN,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': AVOCADO_USER_AGENT
  },
  method: 'POST'
};

SignatureRequest.prototype.send = function() {
  this.request = https.request(SignatureRequest.options,
    this.onRequestSuccess.bind(this));
  this.request.write(querystring.stringify({
    'email' : this.config.email,
    'password': this.config.password
  }));
  this.request.end();
  this.request.on('error', this.onRequestError.bind(this));
};

SignatureRequest.prototype.onRequestSuccess = function(response) {
  this.response = response;
  this.response.on('data', this.parseResponse.bind(this));
};

SignatureRequest.prototype.onRequestError = function(e) {
  console.error(e);
  this.emit(ApiRequestEvent.ERROR);
};

SignatureRequest.prototype.getUserCookieValue = function() {
  var respCookieString = this.response.headers['set-cookie'][0];
  var cookies = {};
  respCookieString.split(';').forEach(function(cookie) {
    var name = cookie.substring(0, cookie.indexOf('='));
    var value = cookie.substring(name.length + 1, cookie.length);
    cookies[name.trim()] = (value || '').trim();
  });
  this.config.cookies = cookies;
  return cookies[AVOCADO_COOKIE_NAME];
};

SignatureRequest.prototype.getHashedUserToken = function() {
  var hasher = crypto.createHash('sha256');
  hasher.update(this.config.cookieValue + this.config.devKey);
  return hasher.digest('hex');
};

SignatureRequest.prototype.parseResponse = function(data) {
  if (data) data = data.toString();

  if (this.response.statusCode != 200) {
    console.log(data);
    this.emit(ApiRequestEvent.ERROR);
    return;
  }

  this.config.cookieValue = this.getUserCookieValue();
  this.config.signature = this.config.devId + ":" + this.getHashedUserToken();
  this.emit(ApiRequestEvent.SUCCESS, data);
};


var ApiRequestEvent = {
  SUCCESS: 'io.avocado.request.success',
  ERROR: 'io.avocado.request.error'
};

module.exports = SignatureRequest;