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

avo.login(function(err, currentUser) {
   // currentUser has Id and other Avocado metadata
   
   // send a message to your boo
   avo.sendMessage('#heyBoo', function(err, messageObj) {
      // messageObj has Id and other Avocado metadata

      // send your boo a photo
      avo.upload('usLastWeek.jpg', 'the caption', function(err, mediaObj) {
         // mediaObj has Id and other Avocado metadata
      });
   });
});
```

### Tests
#### You'll need a config.json file with the following
```
{
  "devId": "devId",
  "devKey": "crazyLongDevKey",
  "email": "me@domain.com",
  "password": "avocadopwd"
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