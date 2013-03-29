'use strict';
angular.module('app')
.controller('AppCtrl', ['$scope', '$routeParams', 'stdData', 'idb', function AppCtrl($scope, $routeParams, stdData, idb) {
  $scope.dataType = stdData.dataType;

  // Only show the "continue" button when we have a database to work with.
  $scope.ready = idb.indexedDB ? true : false;
  $scope.$on('appReady', function(event) {
    console.log('READY');
    $scope.$apply(function(){
      $scope.ready = true;
    });
  });
}]);
