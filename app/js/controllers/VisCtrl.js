'use strict';
angular.module('app')
.controller('VisCtrl', ['$scope', '$routeParams', 'idb', function VisCtrl($scope, $routeParams, idb) {
  $scope.$on('appReady', function(event) {
    gatherData();
  });

  var gatherData = function(){
    var a = {};
    a.name = "La Relance";
    a.children = [];
    angular.forEach(idb.U, function(v,k){
      var foo = {};
      if(v.data.UID !== "975000"){
        foo.name = v.data.name;
        foo.children = v.children;
        a.children.push(foo);
      }
    });

    if(!$scope.$$phase){
      $scope.$apply(function(){
        console.log(JSON.stringify(a));
        $scope.data = a;
      });
    }
    else{
      $scope.data = a;
    }
  }

  gatherData();
}]);
