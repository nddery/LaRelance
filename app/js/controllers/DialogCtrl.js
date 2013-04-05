'use strict';
app.controller('DialogCtrl', ['$scope', 'dialog', function DialogCtrl($scope, dialog) {
  $scope.close = function(result){
    dialog.close(result);
  };
}]);
