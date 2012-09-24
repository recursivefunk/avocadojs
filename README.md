### Install
```
npm install avocadojs
```
### Usage
```
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
```
   avo.login( function (err, currentUserModel) {} );
   
   avo.logout( function ( err ) {} );
   
   avo.getAcitivities( {
    before: Date.now() //  Unix timestamp in milliseconds OR
    after: Date.now() //  Unix timestamp in milliseconds
    
    // NOTE you CANNOT specify both before AND after as this will return an
    // error. Choose only one for now. If neither be before or after is supplied
    // the last 100 activites will be returned
    
   }, function (err, activityList) {} );
   
   avo.deleteActivity( 'activityId', function (err) {} );
```

#### Users
```
  avo.getCouple( function (err, currentCoupleModel) {} );
  
  avo.getCurrentUsers( function (err, currentUsersModel) {} );
  
  avo.getUser( 'userId', function (err, userModel) {} );
```

#### Lists
```
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
```
  avo.sendMessage( 'hey boo', function (err, messageActivity) {} );
```

#### Media
```
  avo.upload( '/path/to/media.jpeg'/, function (err, newMediaModel) {} );
  
  avo.getMedia( {
    before: Date.now() //  Unix timestamp in milliseconds
    after: Date.now() //  Unix timestamp in milliseconds
  }, function (err, mediaModelArray) {} );
  
  avo.deleteMedi( 'mediaId', function (err) {} );
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