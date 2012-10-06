'use strict';
/*global require module describe beforeEach it afterEach*/

var fs = require( 'fs' );
var sf = require( 'sf' );
var AvocadoJS = require( '../index' );
var assert = require( 'assert' );
var should = require( 'should' );

describe('Hugs and Kisses', function(){
  var file = fs.readFileSync( './config.json', 'utf8' );
  var config = JSON.parse( file ).valid;
  var testMedia = config.testMedia;
  var mediaId;
  var testActivityId;
  var simpleKiss = [
    {
      x: 0.6,
      y: 0.2,
      rotation: 0.5
    }
  ];
  var severalKisses = [
    {
      x: 0.4,
      y: 0.3,
      rotation: 0.8
    },
    {
      x: 0.6,
      y: 0.2,
      rotation: 0.5
    }
  ];
  var avo;

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

  describe('Hug Model', function () {
    it( 'returns a hug model', function (done) {
      avo.hug(function (err, hugActivity) {
        should.not.exist( err );
        hugActivity.should.have.property( 'type' );
        hugActivity.type.should.equal( 'hug' );
        return done();
      });
    });
  });

  describe('Kiss Model', function () {
    it( 'simple kiss returns a kiss model', function (done) {
      avo.kiss( {kisses: simpleKiss}, function (err, kissModel) {
        should.not.exist( err );
        kissModel.should.have.property( 'type' );
        kissModel.type.should.equal( 'kiss' );
        return done();
      });
    });

    it('several kisses returns a kiss model', function (done) {
      avo.kiss( {kisses: severalKisses}, function (err, kissModel) {
        should.not.exist( err );
        kissModel.should.have.property( 'type' );
        kissModel.type.should.equal( 'kiss' );
        return done();
      });
    });

    it('several kisses with media returns a kiss model', function (done) {
      avo.kiss({kisses: severalKisses, media: testMedia}, function (err, kissModel) {
        should.not.exist( err );
        kissModel.should.have.property( 'type' );
        kissModel.type.should.equal( 'kiss' );
        testActivityId = kissModel.id;
        return done();
      });
    });

    it('deletes kiss activity', function (done) {
      avo.deleteActivity(testActivityId, function (err) {
        should.not.exist( err );
        return done();
      });
    });
  });
});


