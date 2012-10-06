
exports.objectEmpty = function (object) {
  for ( var i in object ) {
    return false;
  }
  return true;
};