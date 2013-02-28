'use strict';

app.controller('VisCtrl', ['$scope', '$routeParams', 'idb', function VisCtrl($scope, $routeParams, idb) {
  // Everything is done through requests and transactions.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db = e.target.result;
    var objectStore = db.transaction("UNIVERSITIES").objectStore("UNIVERSITIES");
    var universities = [];
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        universities.push(cursor.value);
        cursor.continue();
      }
      else {
        $scope.$apply(function(){
          $scope.data = universities;
        });
      }
    };
  }; // end request.onsuccess()
}]);
