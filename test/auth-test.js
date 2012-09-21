'use strict';
/*global require module describe beforeEach it should*/

describe('Authentication', function(){
  var fs = require( 'fs' );
  var events = require( 'events' );
  var sf = require( 'sf' );
  var AvocadoJS = require( '../index' );
  var assert = require( 'assert' );
  var should = require( 'should' );

  describe('logging in and logging out', function () {
    it('returns the current user with valid creds and successfully logs out', function (done) {
      var file = fs.readFileSync( '../config.json', 'utf8' );
      var config = JSON.parse( file );
      var promise = new events.EventEmitter();
      var avo = new AvocadoJS( config );

      avo.login( function (err, currentUser) {
        should.not.exist( err );
        currentUser.should.have.property( 'currentUser' );

        avo.logout( function (err, ok) {
          should.not.exist( err );
          ok.should.equal( 'OK' );
          return done();
        });
      });
    });

    it( 'returns invalid user error from server with invalid creds', function (done) {
      var file = fs.readFileSync( '../invalid-config.json', 'utf8' );
      var config = JSON.parse( file );
      var promise = new events.EventEmitter();
      var avo = new AvocadoJS( config );

      avo.login( function (err, currentUser) {
        should.exist( err );
        should.not.exist( currentUser );
        return done();
      });
    });
  });
});
