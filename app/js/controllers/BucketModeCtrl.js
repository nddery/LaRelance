'use strict';
angular.module('app')
.controller('BucketModeCtrl', ['$scope', '$routeParams', 'idb', function BucketModeCtrl($scope, $routeParams, idb) {
  $scope.method = $routeParams.method;
  $scope.u      = $routeParams.u;
  $scope.p      = $routeParams.p;

  // Get our data.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db     = e.target.result,
        trn    = db.transaction(["LARELANCE"]),
        dStore = trn.objectStore("LARELANCE"),
        objs   = [],
        c      = {};

    switch($scope.method){
      case 'programs' :
        c.name = "PNAME";
        c.index = "PID";
        break

      default:
      case 'universities' :
        c.name = "UNAME";
        c.index = "UID";
        break;
    }

    var range  = null;
    // We have universities, display programs.
    if(typeof $scope.u !== 'undefined'){
      console.log(typeof $scope.u);
      // Get a list of programs from the data object store.
      range = IDBKeyRange.bound("975000","976000",false,false);
      var index  = dStore.index("UID"),
          values = [];

      index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
          // If we do not stored this value yet.
          if(values.indexOf(cursor.value.PID) === -1){
            values.push(cursor.value.PID);
            cursor.value.name = cursor.value['PNAME'];
            objs.push(cursor.value);
          }
          cursor.continue();
        }
        else{
          $scope.$apply(function(){
            $scope.data = objs;
          });
        }
      }
    }
    // We have programs, display universities.
    else if(typeof $scope.p !== 'undefined'){
      // Get a list of programs from the data object store.
      range = IDBKeyRange.only("5104");
      var index  = dStore.index("PID")
          values = [];

      index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
          // If we do not stored this value yet.
          if(values.indexOf(cursor.value.UID) === -1){
            values.push(cursor.value.UID);
            cursor.value.name = cursor.value['UNAME'];
            objs.push(cursor.value);
          }
          cursor.continue();
        }
        else{
          $scope.$apply(function(){
            $scope.data = objs;
          });
        }
      }
    }
    // We do not have anything.
    else{
      // Retrieve whatever has been asked.
      var index  = dStore.index(c.index),
          values = [];
      index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
          // If we do not stored this value yet.
          if(values.indexOf(cursor.value.UID) === -1){
            values.push(cursor.value.UID);
            cursor.value.name = cursor.value[c.name];
            objs.push(cursor.value);
            cursor.continue();
          }
        }
        else{
          $scope.$apply(function(){
            $scope.data = objs;
          });
        }
      }
    }
  }; // end request.onsuccess()

  $scope.clicked = function(evt) {
    console.log(evt);
  }
}]);
