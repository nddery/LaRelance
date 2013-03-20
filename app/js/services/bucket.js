'use strict';
angular.module('app')
.service('bucket', function() {
  return {
    index: 0,
    newItem: {},
    items: [],
  };
});
