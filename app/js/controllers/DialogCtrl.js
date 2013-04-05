'use strict';
app.controller('DialogCtrl', ['$scope', 'dialog', function DialogCtrl($scope, dialog) {
  $scope.close = function(){
    console.log('should close');
    console.log(dialog);
    dialog.close();
  };
}]);
