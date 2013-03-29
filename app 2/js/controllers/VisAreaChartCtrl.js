'use strict';
angular.module('app')
.controller('VisAreaChartCtrl', ['$scope', '$routeParams', 'idb', function VisAreaChartCtrl($scope, $routeParams, idb) {
  $scope.$on('bucketItemsUpdated', function(event) {
    updateData();
  });

  var updateData = function(){
    // Get our data.
    var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
    request.onsuccess = function( e ) {
      var db     = e.target.result,
          trn    = db.transaction(["LARELANCE"]),
          dStore = trn.objectStore("LARELANCE"),
          objs   = [];

      var index  = dStore.index("UID"),
          values = [];
      index.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
          // If we do not stored this value yet.
          if(values.indexOf(cursor.value["UID"]) === -1){
            values.push(cursor.value["UID"]);
            cursor.value.name = cursor.value["UNAME"];
            objs.push(cursor.value);
          }
          cursor.continue();
        }
        else{
          apply(objs);
        }
      }
    }; // end request.onsuccess()
  } // end updateData()

  var apply = function(o){
    $scope.$apply(function(){
      $scope.data = o;
    });
  }
}]);
