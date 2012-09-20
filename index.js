
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

  _post: function (path, formData, callback) {
    if ( !this.loggedIn ) {return callback( new Error('You must be logged in to complete this request!'));}
    var self = this;
    var url = this._buildUrl(this.apiEndpoint, path, {});
    var blah = self.request({
      method: 'POST',
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

  _get: function (path, params, callback) {
    if ( !this.loggedIn ) {return callback( new Error('You must be logged in to complete this request!'));}
    var self = this;
    var url = this._buildUrl(this.apiEndpoint, path, params);
    var blah = self.request({
      method: 'GET',
      jar: self.cookieJar,
      url: url,
      headers: {
        'X-AvoSig': self.config.signature,
        'User-Agent': 'Avocado Node Api Client v.1.0'
      }
    }, function (err, response, body) {
      return callback(err, response, body);
    });
  },

  _sendPost: function (opts, params, callback) {
    var _404= 'Not Found';
    var _400 = 'Missing Data';
    var msg;
    params = params || {};
    params = _.extend( params, this._getStdSigParams() );
    opts = opts || {};
    this._post( opts.path, params, function (err, response, body) {
      
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
    });
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
    return this._sendPost({
      path: '/lists/',
      _400: 'List name not provided'
    }, {
      name: name
    }, callback);
  },

  getLists: function (callback) {
    var path = '/lists/';
    var params = this._getStdSigParams();
    this._get( path, params, function (err, response, body) {
      if (err){return callback(err);}
      return callback( null, JSON.parse( body ));
    });
  },

  renameList: function (name, id, callback) {
    return this._sendPost({
      path: sf( '/lists/{0}/', id ),
      _404: 'The list was not found',
      _400: 'The list name was not supplied'
    }, {
      name: name
    }, callback);
  },

  getList: function (id, callback) {
    var path = sf('/lists/{0}', id);
    var params = this._getStdSigParams();
    this._get( path, params, function (err, response, body) {
      if (err){return callback(err);}
      return callback( null, JSON.parse( body ));
    });
  },

  deleteListItem: function (listId, itemId, callback) {
    return this._sendPost({
      path: sf( '/lists/{0}/{1}/delete/', listId, itemId ),
      _404: 'The list item was not found'
    }, {}, callback);
  },

  deleteList: function (listId, callback) {
    return this._sendPost({
      path: sf( '/lists/{0}/delete/', listId ),
      _404: 'The list was not found'
    }, {}, callback);
  },

  editListItem: function (listId, itemId, params, callback) {
    return this._sendPost({
      path: sf( '/lists/{0}/{1}', listId, itemId ),
      _404: 'The list or list item was not found',
      _400: 'The index was out of bounds, or no edits were specified'
    }, params, callback);
  },

  createListItem: function (id, itemText, callback) {
    return this._sendPost({
      path: sf( '/lists/{0}/', id ),
      _404: 'The list was not found!',
      _400: 'The new list item was not supplied!'
    }, {
      text: itemText
    }, callback);
  },

  logout: function(callback) {
    this._get( '/authentication/logout/', null, function (err, response, body) {
      return callback( err );
    });
  },

  getCouple: function (callback) {
    var self = this;
    var params = this._getStdSigParams();

    this._get( '/couple/', params, function (err, response, body) {
      if (err) {
        return callback(err);
      }
      return callback(null, JSON.parse( body ));
    });
  },

  sendMessage: function(text, callback) {
    this._sendPost({
      path: '/conversation/',
      _404: 'Empty or otherwise bad-news message'
    }, {
      message: text
    }, callback);
  },

  getActivities: function (opts, callback) {
    var path = '/activities/';
    var params = {};
    if ( opts.before && opts.after ) {
      return callback( new Error('You cannot specifiy both before and after times.') );
    }
    if ( opts.before ) {
      params.before = opts.before;
    }
    if ( opts.after ) {
      params.after = opts.after;
    }
    params = _.extend( params, this._getStdSigParams() );
    this._get( path, params, function (err, response, body) {
      if (err) {return callback(err);}
      return callback(null, JSON.parse(body) );
    });
  },

  deleteActivity: function (id, callback) {
    var path = sf( '/activities/{0}/delete/', id );

    this._post( path, {}, function (err, response, body) {
      if (err){return callback(err);}
      if ( response.statusCode === 404 ) {
        return callback( new Error('ID ' + id + ' was not found!') );
      }
      return callback(null);
    });
  },

  getCurrentUsers: function (callback) {
    var params = this._getStdSigParams();

    this._get( '/user/', params, function (err, response, body) {
      if (err) {return callback(err);}
      return callback( null, JSON.parse( body ) );
    });
  },

  getUser: function (id, callback) {
    var params = this._getStdSigParams();
    var path = '/user/' + id + '/';

    this._get(path, params, function (err, response, body) {
      if (err) {
        return callback(err);
      }
      return callback(null, JSON.parse( body ));
    });
  }

});

module.exports = AvocadoJS;