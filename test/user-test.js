'use strict';
/*global require module describe beforeEach it afterEach*/

var fs = require( 'fs' );
var sf = require( 'sf' );
var AvocadoJS = require( '../index' );
var assert = require( 'assert' );
var should = require( 'should' );

describe('Users', function(){
  var file = fs.readFileSync( './config.json', 'utf8' );
  var config = JSON.parse( file ).valid;
  var currUserId;
  var otherUserId;
  var avo;

  describe('User Model', function () {

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

    it( 'returns a couple model', function (done) {
      avo.getCouple( function ( err, coupleModel ) {
        should.not.exist( err );
        coupleModel.should.have.property( 'currentUser' );
        coupleModel.should.have.property( 'otherUser' );
        currUserId = coupleModel.currentUser.id;
        otherUserId = coupleModel.otherUser.id; 
        return done();  
      });
    });

    it( 'return current users model', function (done) {
      avo.getCurrentUsers(function (err, currUsers) {
        should.not.exist( err );
        currUsers.should.be.instanceof( Array );
        return done();
      });
    });

    it( 'returns single user', function (done) {
      avo.getUser( currUserId, function ( err, currUser) {
        should.not.exist( err );
        currUser.should.have.property( 'id' );
        return done();
      });
    });

  });
});
