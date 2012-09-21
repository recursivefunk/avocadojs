'use strict';
/*global require module describe beforeEach it afterEach*/

var fs = require( 'fs' );
var sf = require( 'sf' );
var AvocadoJS = require( '../index' );
var assert = require( 'assert' );
var should = require( 'should' );

describe('Messages', function(){
  var file = fs.readFileSync( './config.json', 'utf8' );
  var config = JSON.parse( file ).valid;
  var avo;
  var messageId;

  beforeEach(function (done) {
    avo = new AvocadoJS( config );
    avo.login(function (err) {
      return done();
    });
  });

  afterEach(function (done) {
    avo.logout(function (err) {
      return done();
    });
  });

  describe('Message Model', function () {

    it( 'sends a message', function (done) {
      avo.sendMessage('Testing 123', function (err, message) {
        should.not.exist( err );
        message.should.have.property( 'id' );
        messageId = message.id;
        return done();
      });
    });

    it( 'delete recently created message', function (done) {
      avo.deleteActivity(messageId, function (err, resp) {
        should.not.exist( err );
        resp.should.be.equal( 'OK' );
        return done();
      });
    });
  });
});