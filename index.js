
var Class = require( 'class' ).Class;
var sf = require( 'sf' );
var _ = require( 'underscore' );
var SignatureRequest = require( './lib/sigrequest' );

var AvocadoJS = Class({

  apiEndpoint: 'https://avocado.io/api',

  constructor: function (config) {
    if ( !config ) {
      throw new Error( 'You need an API Key, dev key, email and password' );
    }

    this.request = require( 'request' );
    this.config = config;
    this.loggedIn = false;
    this.cookieJar = null;
  },

  login: function (callback) {
    var self = this;
    var sigRequest = new SignatureRequest( this.config );
    sigRequest.on('io.avocado.request.success', function (data) {
      self.config.signature = sigRequest.config.signature;
      self.config.cookieValue = sigRequest.config.cookieValue;
      self.cookieJar = self.request.jar();
      var cookieStr = 'user_email=' + sigRequest.config.cookieValue + ';';
      var cookie = self.request.cookie( cookieStr );
      self.cookieJar.add( cookie );

      try {
        data = JSON.parse( data );
        self.loggedIn = true;
        return callback( null, data );
      } catch ( e ) {
        return callback( e );
      }
    });

    sigRequest.send();
  },

  _performRequest: function (opts, formData, callback) {
    var self = this;

    if ( !this.loggedIn ) {
      return callback( new Error( 'You must be logged in to complete this request!' ) );
    }
    
    var url = this._buildUrl( this.apiEndpoint, opts.path, {} );
    var blah = self.request({
      method: opts.method,
      jar: self.cookieJar,
      form: formData,
      url: url,
      headers: {
        'X-AvoSig': self.config.signature,
        'User-Agent': 'Avocado Node Api Client v.1.0'
      }
    }, function (err, response, body) {
      return callback(err, response, body);
    });
  },

  _send: function (opts, params, callback) {
    var _404= 'Not Found';
    var _400 = 'Missing Data';
    var msg;
    params = params || {};
    params = _.extend( params, this._getStdSigParams() );

    function onRequestComplete ( err, response, body ) {
      
      if ( err ) {
        return callback( err );
      }
      
      if ( response.statusCode === 404 ) {
        msg = opts._404 || _404;
        return callback( new Error( msg ) );
      }

      if ( response.statusCode === 400 ) {
        msg = opts._400 || _400;
        return callback( new Error( msg ) );
      }

      var obj;
      try {
        obj = JSON.parse( body );
      } catch ( e ) {
        return callback( new Error( 'Malformed Response' ) );
      }

      return callback( null, obj );
    }

    return this._performRequest( opts, params, onRequestComplete );
  },

  _buildUrl: function (endpoint, path, params) {
    var base = endpoint + path;
    if (params) {
      base += '?';

      for (var p in params) {
        base += p + '=' + params[p] + '&';
      }
    }
    if (base[base.length - 1] === '&') {
      base = base.substring(0, base.length - 1);
    }
    return base;
  },

  _getStdSigParams: function () {
    return {
      avosig: this.config.signature
    };
  },

  createList: function (name, callback) {
    return this._send({
      path: '/lists/',
      _400: 'List name not provided',
      method: 'post'
    }, {
      name: name
    }, callback);
  },

  getLists: function (callback) {
    return this._send({
      path: '/lists/'
    }, {}, callback);
  },

  renameList: function (name, id, callback) {
    return this._send({
      path: sf( '/lists/{0}/', id ),
      _404: 'The list was not found',
      _400: 'The list name was not supplied',
      method: 'post'
    }, {
      name: name
    }, callback);
  },

  getList: function (id, callback) {
    return this._send({
      path: sf( '/lists/{0}/', id ),
      medhod: 'get'
    }, {}, callback);
  },

  deleteListItem: function (listId, itemId, callback) {
    return this._send({
      path: sf( '/lists/{0}/{1}/delete/', listId, itemId ),
      _404: 'The list item was not found',
      method: 'post'
    }, {}, callback);
  },

  deleteList: function (listId, callback) {
    return this._send({
      path: sf( '/lists/{0}/delete/', listId ),
      _404: 'The list was not found',
      method: 'post'
    }, {}, callback);
  },

  editListItem: function (listId, itemId, params, callback) {
    return this._send({
      path: sf( '/lists/{0}/{1}', listId, itemId ),
      _404: 'The list or list item was not found',
      _400: 'The index was out of bounds, or no edits were specified',
      method: 'post'
    }, params, callback);
  },

  createListItem: function (id, itemText, callback) {
    return this._send({
      path: sf( '/lists/{0}/', id ),
      _404: 'The list was not found!',
      _400: 'The new list item was not supplied!',
      method: 'post'
    }, {
      text: itemText
    }, callback);
  },

  logout: function(callback) {
    return this._send({
      path: '/authentication/logout/'
    }, {}, function (err, body) {
      self.isLoggedIn = false;
      return callback( err, body );
    });
  },

  getCouple: function (callback) {
    return this._send({
      path: '/couple/'
    }, {}, callback);
  },

  sendMessage: function(text, callback) {
    this._send({
      path: '/conversation/',
      _404: 'Empty or otherwise bad-news message',
      method: 'post'
    }, {
      message: text
    }, callback);
  },

  // TODO: Fix Bug here. Activity queries for after 'now' bring back ALL activities when they
  // should bring back none
  getActivities: function (opts, callback) {
    if ( opts.before && opts.after ) {
      return callback( new Error('You cannot specifiy both before and after times.') );
    }
    return this._send({
      path: '/activities/'
    }, opts, callback);
  },

  deleteActivity: function (id, callback) {
    return this._send({
      path: sf( '/activities/{0}/delete/', id ),
      method: 'post',
      _404: sf( 'ID {0} was not found!', id )
    }, {}, callback);
  },

  getCurrentUsers: function (callback) {
    return this._send({
      path: '/user/'
    }, {}, callback);
  },

  getUser: function (id, callback) {
    return this._send({
      path: sf( '/user/{0}/', id )
    }, {}, callback);
  }

});

module.exports = AvocadoJS;