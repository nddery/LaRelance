'use strict';
angular.module('app')
.controller('VisCtrl', ['$scope', '$routeParams', 'idb', function VisCtrl($scope, $routeParams, idb) {
  $scope.$on('appReady', function(event) {
    gatherData();
  });

  var gatherData = function(){
    var a = {};
    a.name = "root";
    a.children = [];
    angular.forEach(idb.U, function(v,k){
      var foo = {};
      if(v.data.UID !== "975000"){
        foo.name = v.data.name;
        foo.image = v.data.image;
        foo.children = v.children;
        a.children.push(foo);
      }
    });

    if(!$scope.$$phase){
      $scope.$apply(function(){
        $scope.data = a;
      });
    }
    else{
      $scope.data = a;
    }
  }

  gatherData();
}]);
