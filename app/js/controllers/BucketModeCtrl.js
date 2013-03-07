'use strict';
angular.module('app')
.controller('BucketModeCtrl', ['$scope', '$routeParams', 'idb', function BucketModeCtrl($scope, $routeParams, idb) {
  $scope.method = $routeParams.method;


  // Get our data.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db   = e.target.result,
        trn  = db.transaction(["UNIVERSITIES", "PROGRAMS", "DATA"]),
        uStore = trn.objectStore("UNIVERSITIES"),
        pStore = trn.objectStore("PROGRAMS"),
        dStore = trn.objectStore("DATA"),
        objs   = [],
        store;

    switch($scope.method){
      case 'programs' :
        store = pStore;
        break

      default:
      case 'universities' :
        store = uStore;
        break;
    }

    // Retrieve whatever has been asked.
    store.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor){
        objs.push(cursor.value);
        cursor.continue();
      }
      else{
        $scope.$apply(function(){
          $scope.data = objs;
        });
      }
    }
  }; // end request.onsuccess()
}]);
