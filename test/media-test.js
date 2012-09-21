'use strict';
/*global require module describe beforeEach it afterEach*/

var fs = require( 'fs' );
var sf = require( 'sf' );
var AvocadoJS = require( '../index' );
var assert = require( 'assert' );
var should = require( 'should' );

describe('Media', function(){
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

  describe('Media Model', function () {

    it( 'returns an array of all media', function (done) {
      avo.getMedia( { before: Date.now() }, function (err, mediaList) {
        should.not.exist( err );
        mediaList.should.be.instanceof( Array );
        // assuming account has media items associated with it
        mediaList.length.should.be.above( 0 );
        return done();
      });
    });

    it( 'returns an empty array', function (done) {
      avo.getMedia( { after: Date.now() }, function (err, mediaList) {
        should.not.exist( err );
        mediaList.should.be.instanceof( Array );
        mediaList.length.should.equal( 0 );
        return done();
      });
    });

  });
});