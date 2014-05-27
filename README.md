### No longer actively maintained!

### Install
```
npm install avocadojs
```
### Usage
```javascript
var AvocadoJS = require( 'avocadojs' )
var config = {
  devId: "devId",
  devKey: "crazyLongDevKey",
  email: "me@domain.com",
  password: "avocadopwd"
};

var avo = new AvocadoJS( config );

avo.login(function(err, currentUserModel) {
   // currentUser has Id and other Avocado metadata
   
   // send a message to your boo
   avo.sendMessage('#heyBoo', function(err, messageModel) {
      // messageObj has Id and other Avocado metadata

      // send your boo a photo
      avo.upload('usLastWeek.jpg', 'the caption', function(err, mediaObj) {
         // mediaObj has Id and other Avocado metadata
      });
   });
});
```
### Methods
#### General
```javascript
   avo.login( function (err, currentUserModel) {} );
   
   avo.logout( function ( err ) {} );
   
   avo.getRecentActivities( {
    before: Date.now(), //  Unix timestamp in milliseconds OR
    after: Date.now() //  Unix timestamp in milliseconds
    
    // NOTE you CANNOT specify both before AND after as this will return an
    // error. Choose only one for now. If neither be before or after is supplied
    // the last 100 activites will be returned
    
   }, function (err, activityList) {} );
   
   avo.deleteActivity( 'activityId', function (err) {} );
```

#### Users
```javascript
  avo.getCouple( function (err, currentCoupleModel) {} );
  
  avo.getCurrentUsers( function (err, currentUsersModel) {} );
  
  avo.getUser( 'userId', function (err, userModel) {} );
```

#### Lists
```javascript
  avo.createList( 'listName', function (err, newListModel) { } );
  
  avo.getLists( function (err, listOfListModels) );
  
  avo.renameList( 'newName', 'listId', function (err, listModel) { });
  
  avo.deleteList ( 'listId', function (err) { });
  
  avo.createListItem( 'listId', 'item text', function (err, newListModel) {} );
  
  avo.editListItem( 'listItemId', {
    text: 'newItemText',
    complete: 0, // 0 for incomplete, 1 for complete
    index: 0, // new index for list item
  },
  function (err, fullList) {} );
  
  avo.deleteListItem( 'listItemId', function (err, listModel) {} );
 
```

#### Messages
```javascript
  avo.sendMessage( 'hey boo', function (err, messageActivity) {} );
```

#### Media
```javascript
  avo.upload( '/path/to/media.jpeg', function (err, newMediaModel) {} );
  
  avo.getRecentMedia( {
    before: Date.now(), //  Unix timestamp in milliseconds
    after: Date.now() //  Unix timestamp in milliseconds
  }, function (err, mediaModelArray) {} );
  
  avo.deleteMedia( 'mediaId', function (err) {} );
```

#### Hugs & Kisses
```javascript

  // kisses is an array so, you may send more than one
  // call it makeout if you like
  var kisses = [
    {
      x: 0.6,
      y: 0.2,
      rotation: 0.5
    }
  ];

  avo.kiss( {kisses: kisses}, function (err, newKissModel) {});

  // by default, kisses will appear on your partner's current avatar
  // but you may specify a different photo via the media parameter
  var media = '/path/to/photo.jpg';
  avo.kiss( {kisses: kisses, media: media}, function (err, newKissModel));
```

For a detailed look at the various Model referenced please see the Avocado API docs https://avocado.io/guacamole/avocado-api


### Tests
#### You'll need a config.json file with the following
```
{
  "valid": {
    "devId": "devId",
    "devKey": "crazyLongDevKey",
    "email": "me@domain.com",
    "password": "avocadopwd",
    "testMedia": "someTestPhoto.jpg"
  },
  "invalid": {
    "devId": "devKey",
    "devKey": "crazyLongDevKey",
    "email": "wrongEmail@fakedomain.com",
    "password": "wrongAvoPwd"
  }
}
```
#### Then run
```
$ npm install -g mocha
$ make
```

### Support or Contact
You can reach me at johnny@johnnyray.me
Check out the official Avocado API docs at https://avocado.io/developers
