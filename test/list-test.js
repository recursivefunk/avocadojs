'use strict';
/*global require module describe beforeEach it afterEach*/

var fs = require( 'fs' );
var sf = require( 'sf' );
var AvocadoJS = require( '../index' );
var assert = require( 'assert' );
var should = require( 'should' );

describe('Lists', function(){
  var file = fs.readFileSync( './config.json', 'utf8' );
  var config = JSON.parse( file ).valid;
  var avo;
  var listId;
  var listItemId;
  var index = 0;
  var listItemNewText = 'Do something else';
  var listNewName = 'My new title';

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

  describe('List Model', function () {

    it('returns a lols (list of lists)', function (done) {
      avo.getLists(function (err, lols) {
        should.not.exist( err );
        lols.should.be.instanceof( Array );
        return done();
      });
    });

    it( 'creates new list', function (done) {
      avo.createList('newTestList', function (err, list) {
        should.not.exist( err );
        list.should.be.instanceof( Object );
        list.should.have.property( 'id' );
        listId = list.id;
        return done();
      });
    });

    it('renames a list', function (done) {
      avo.renameList(listNewName, listId, function (err, list) {
        should.not.exist( err );
        list.should.have.property( 'id' );
        list.id.should.be.equal( listId );
        list.should.have.property( 'name' );
        list.name.should.equal( listNewName );
        return done();
      });
    });

    it( 'returns specified list', function (done) {
      avo.getList(listId, function(err, list) {
        should.not.exist( err );
        list.should.have.property( 'id' );
        list.id.should.be.equal( listId );
        return done();
      });
    });

    it( 'creates new list item', function (done) {
      avo.createListItem(listId, 'A new TODO', function (err, listItem) {
        should.not.exist( err );
        listItem.should.be.instanceof( Object );
        listItem.should.have.property( 'id' );
        listItemId = listItem.id;
        return done();
      });
    });

    it( 'edits a list item', function (done) {
      avo.editListItem(listId, listItemId, { text: listItemNewText, complete: 1, index: index }, function (err, list) {
        should.not.exist( err );
        list.should.have.property( 'items' );
        list.items.should.be.instanceof( Array );
        list.items[ index ].should.have.property( 'id' );
        list.items[ index ].id.should.equal( listItemId );
        list.items[ index ].should.have.property( 'complete' );
        list.items[ index ].complete.should.be.equal( true );
        list.items[ index ].should.have.property( 'text' );
        list.items[ index ].text.should.equal( listItemNewText );
        return done();
      });
    });

    it( 'deleted list item', function (done) {
      avo.deleteListItem(listId, listItemId, function (err, list) {
        should.not.exist( err );
        list.should.have.property( 'items' );
        list.items.should.be.empty;
        return done();
      });
    });

    it( 'deleted the list', function (done) {
      avo.deleteList(listId, function (err) {
        should.not.exist( err );
        return done();
      });
    });

  });
});