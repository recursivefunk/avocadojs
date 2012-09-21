'use strict';
/*global require module describe beforeEach it afterEach*/

var fs = require( 'fs' );
var sf = require( 'sf' );
var AvocadoJS = require( '../index' );
var assert = require( 'assert' );
var should = require( 'should' );

describe('Activities', function(){
  var avo;

  beforeEach(function (done) {
    var file = fs.readFileSync( '../config.json', 'utf8' );
    var config = JSON.parse( file );
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

  describe('Activity Model', function () {

    it( 'returns the last 100 activities', function (done) {
      avo.getActivities({}, function (err, activities) {
        should.not.exist( err );
        activities.should.be.instanceof( Array );
        activities.length.should.equal( 100 );
        return done();
      });
    });

    it( 'returns 0 activities', function (done) {
      avo.getActivities({ after: Date.now() }, function (err, activities) {
        should.not.exist( err );
        activities.should.be.instanceof( Array );
        activities.length.should.be.equal( 0 );
        return done();
      });
    });
  });
});