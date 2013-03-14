'use strict';
angular.module('app')
.service('bucket', function() {
  return {
    newItem: {},
    items: [],
  };
});
