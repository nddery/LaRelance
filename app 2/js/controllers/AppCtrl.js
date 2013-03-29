'use strict';
angular.module('app')
.controller('AppCtrl', ['$scope', '$routeParams', 'idb', function AppCtrl($scope, $routeParams, idb) {
  // Current "step".
  $scope.step = typeof $routeParams.step == 'undefined' ? 1 : $routeParams.step;

  // Only show the "continue" button when we have a database to work with.
  $scope.ready = idb.indexedDB ? true : false;
  $scope.$on('idbInitialized', function(event) {
    $scope.$apply(function(){
      $scope.ready = true;
    });
  });
}]);
