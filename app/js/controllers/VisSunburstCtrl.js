'use strict';

angular.module('app').controller('VisSunburstCtrl', ['$scope', '$routeParams', 'idb', function VisSunburstCtrl($scope, $routeParams, idb) {
  // Get our data.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db          = e.target.result,
        objectStore = db.transaction("DATA").objectStore("DATA"),
        data        = [];

    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        data.push( cursor.value );
        cursor.continue();
      }
      else {
        $scope.$apply(function(){
          $scope.data = data;
        });
      }
    };
  }; // end request.onsuccess()
}]);
