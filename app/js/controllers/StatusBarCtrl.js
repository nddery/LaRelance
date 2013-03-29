'use strict';
angular.module('app')
.controller('StatusBarCtrl', ['$scope', 'statusBar', function VisCtrl($scope, statusBar) {
  $scope.type   = '';
  $scope.status = '';

  $scope.$on('statusUpdated', function(){
    if(!$scope.$$phase){
      $scope.$apply(function(){
        $scope.type   = statusBar.type;
        $scope.status = '...' + statusBar.status;
      });
    }
  });
}]);
