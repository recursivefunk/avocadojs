'use strict';
/*global require module describe beforeEach it afterEach*/

var fs = require( 'fs' );
var sf = require( 'sf' );
var AvocadoJS = require( '../index' );
var should = require( 'should' );

describe('Authentication', function(){
  var file = fs.readFileSync( './config.json', 'utf8' );
  var obj = JSON.parse( file );
  var config = obj.valid;
  var invalidConfig = obj.invalid;
  var avo;

  describe('logging in and logging out', function () {
    it('returns the current user with valid creds and successfully logs out', function (done) {
      avo = new AvocadoJS( config );
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
      avo = new AvocadoJS( invalidConfig );
      avo.login( function (err, currentUser) {
        should.exist( err );
        should.not.exist( currentUser );
        return done();
      });
    });
  });
});
