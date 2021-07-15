(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var Promise = Package.promise.Promise;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/steedos_autoform-file/lib/server/publish.coffee               //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('autoformFileDoc', function (collectionName, docId) {
  var collection;
  check(collectionName, String);
  check(docId, String);
  collection = FS._collections[collectionName] || global[collectionName];

  if (collection) {
    return collection.find({
      _id: docId
    });
  }
});
////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:autoform-file");

})();

//# sourceURL=meteor://💻app/packages/steedos_autoform-file.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19hdXRvZm9ybS1maWxlL2xpYi9zZXJ2ZXIvcHVibGlzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zZXJ2ZXIvcHVibGlzaC5jb2ZmZWUiXSwibmFtZXMiOlsiTWV0ZW9yIiwicHVibGlzaCIsImNvbGxlY3Rpb25OYW1lIiwiZG9jSWQiLCJjb2xsZWN0aW9uIiwiY2hlY2siLCJTdHJpbmciLCJGUyIsIl9jb2xsZWN0aW9ucyIsImdsb2JhbCIsImZpbmQiLCJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU9DLE9BQVAsQ0FBZSxpQkFBZixFQUFrQyxVQUFDQyxjQUFELEVBQWlCQyxLQUFqQjtBQUNoQyxNQUFBQyxVQUFBO0FBQUFDLFFBQU1ILGNBQU4sRUFBc0JJLE1BQXRCO0FBQ0FELFFBQU1GLEtBQU4sRUFBYUcsTUFBYjtBQUVBRixlQUFhRyxHQUFHQyxZQUFILENBQWdCTixjQUFoQixLQUFtQ08sT0FBT1AsY0FBUCxDQUFoRDs7QUFDQSxNQUFHRSxVQUFIO0FDQ0UsV0RBQUEsV0FBV00sSUFBWCxDQUNFO0FBQUFDLFdBQUtSO0FBQUwsS0FERixDQ0FBO0FBR0Q7QURUSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2F1dG9mb3JtLWZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJNZXRlb3IucHVibGlzaCAnYXV0b2Zvcm1GaWxlRG9jJywgKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCkgLT5cclxuICBjaGVjayBjb2xsZWN0aW9uTmFtZSwgU3RyaW5nXHJcbiAgY2hlY2sgZG9jSWQsIFN0cmluZ1xyXG5cclxuICBjb2xsZWN0aW9uID0gRlMuX2NvbGxlY3Rpb25zW2NvbGxlY3Rpb25OYW1lXSBvciBnbG9iYWxbY29sbGVjdGlvbk5hbWVdXHJcbiAgaWYgY29sbGVjdGlvblxyXG4gICAgY29sbGVjdGlvbi5maW5kXHJcbiAgICAgIF9pZDogZG9jSWRcclxuIiwiTWV0ZW9yLnB1Ymxpc2goJ2F1dG9mb3JtRmlsZURvYycsIGZ1bmN0aW9uKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCkge1xuICB2YXIgY29sbGVjdGlvbjtcbiAgY2hlY2soY29sbGVjdGlvbk5hbWUsIFN0cmluZyk7XG4gIGNoZWNrKGRvY0lkLCBTdHJpbmcpO1xuICBjb2xsZWN0aW9uID0gRlMuX2NvbGxlY3Rpb25zW2NvbGxlY3Rpb25OYW1lXSB8fCBnbG9iYWxbY29sbGVjdGlvbk5hbWVdO1xuICBpZiAoY29sbGVjdGlvbikge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgX2lkOiBkb2NJZFxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
