'use strict';
angular.module('app')
.controller('NavBarCtrl', ['$scope', 'stdData', 'idb', function NavBarCtrl($scope, stdData, idb) {
  $scope.visType  = stdData.visType;
  $scope.dataType = stdData.dataType;

  $scope.stopPropagation = function($event){
    // console.log($event);
    $event.stopPropagation();
  };

  $scope.$on('idbInitialized', function(event) {
    getData();
  });

  var getData = function(){
    // Get our data.
    var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
    request.onsuccess = function( e ) {
      var db    = e.target.result,
          trn   = db.transaction(["LARELANCE"]),
          store = trn.objectStore("LARELANCE"),
          objs  = [];

      $scope.universities = idb.U;
      if(typeof idb.U.length === 'undefined'){
        var index  = store.index("UID"),
            values = [];
        index.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if(cursor){
            // If we do not stored this value yet.
            if(values.indexOf(cursor.value["UID"]) === -1){
              values.push(cursor.value["UID"]);
              cursor.value.name = cursor.value["UNAME"];
              idb.U[cursor.value.UID] = {};
              idb.U[cursor.value.UID]["data"] = cursor.value;
              idb.U[cursor.value.UID]["programs"] = [];
            }
            cursor.continue();
          }
          else{
            // Add programs to each universities.
            var index  = store.index("UID");
            angular.forEach(idb.U, function(value,key){
              var range = IDBKeyRange.only(value.data.UID),
                  v     = [];
              index.openCursor(range).onsuccess = function(event) {
                var cursor = event.target.result;
                if(cursor){
                  // If we did not stored this value yet.
                  if(v.indexOf(cursor.value.PID) === -1){
                    v.push(cursor.value.PID);
                    value.programs.push(cursor.value.PID);
                  }
                  // console.log(cursor.value);
                  cursor.continue();
                }
              }
            });
            $scope.$apply(function(){
              $scope.universities = idb.U;
            });
          }
        }
      };

      $scope.programs = idb.P;
      if(typeof idb.P.length === 'undefined'){
        var index  = store.index("PID"),
            values = [];
        index.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if(cursor){
            // If we do not stored this value yet.
            if(values.indexOf(cursor.value["PID"]) === -1){
              values.push(cursor.value["PID"]);
              cursor.value.name = cursor.value["PNAME"];
              idb.P[cursor.value.PID] = {};
              idb.P[cursor.value.PID]["data"] = cursor.value;
              idb.P[cursor.value.PID]["universities"] = [];
            }
            cursor.continue();
          }
          else{
            // Add programs to each universities.
            var index  = store.index("PID");
            angular.forEach(idb.P, function(value,key){
              var range = IDBKeyRange.only(value.data.PID),
                  v     = [];
              index.openCursor(range).onsuccess = function(event) {
                var cursor = event.target.result;
                if(cursor){
                  // If we did not stored this value yet.
                  if(v.indexOf(cursor.value.UID) === -1){
                    v.push(cursor.value.UID);
                    value.universities.push(cursor.value.UID);
                  }
                  // console.log(cursor.value);
                  cursor.continue();
                }
              }
            });
            $scope.$apply(function(){
              $scope.programs = idb.P;
            });
          }
        }
      };
      }
    }
}]);
