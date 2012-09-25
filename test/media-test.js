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
  var mediaId;
  var caption = 'Test upload';

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
      avo.getRecentMedia( { before: Date.now() }, function (err, mediaList) {
        should.not.exist( err );
        mediaList.should.be.instanceof( Array );
        // assuming account has media items associated with it
        mediaList.length.should.be.above( 0 );
        return done();
      });
    });

    it( 'returns an empty array', function (done) {
      avo.getRecentMedia( { after: Date.now() }, function (err, mediaList) {
        should.not.exist( err );
        mediaList.should.be.instanceof( Array );
        mediaList.length.should.equal( 0 );
        return done();
      });
    });

    it( 'uploads a photo', function (done) {
      avo.upload( config.testMedia, caption, function (err, mediaObj) {
        should.not.exist( err );
        mediaObj.should.have.property( 'id' );
        mediaId = mediaObj.id;
        mediaObj.should.have.property( 'caption' );
        mediaObj.caption.should.equal( caption );
        mediaObj.should.have.property( 'url' );
        return done();
      });
    });

    it( 'delete the media', function (done) {
      avo.deleteMedia( mediaId, function (err, msg) {
        should.not.exist( err );
        msg.should.be.equal( 'OK' );
        return done();
      });
    });

  });
});
























