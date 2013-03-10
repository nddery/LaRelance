'use strict';
angular.module('app')
.controller('BucketModeCtrl', ['$scope', '$routeParams', 'idb', function BucketModeCtrl($scope, $routeParams, idb) {
  $scope.method = $routeParams.method;
  $scope.u = $routeParams.u ? $routeParams.u : null;
  $scope.p = $routeParams.p ? $routeParams.p : null;

  // Get our data.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db   = e.target.result,
        trn  = db.transaction(["UNIVERSITIES", "PROGRAMS", "DATA"]),
        uStore = trn.objectStore("UNIVERSITIES"),
        pStore = trn.objectStore("PROGRAMS"),
        dStore = trn.objectStore("DATA"),
        objs   = [],
        c      = {};

    switch($scope.method){
      case 'programs' :
        c.store = pStore;
        c.name = "PNAME";
        c.index = "PID";
        break

      default:
      case 'universities' :
        // store = uStore;
        c.store = uStore;
        c.name = "UNAME";
        c.index = "UID";
        break;
    }

    var range = null,
        U     = [];
    // We have universities, display programs.
    if(typeof $scope.u !== 'null'){
      // Get a list of programs from the data object store.
      range = IDBKeyRange.bound("975000","976000",false,false);
      var index = dStore.index("UID"),
          last  = 0,
          P     = [];

      index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
          if(P.indexOf(cursor.value.PID) === -1){
            console.log(cursor.value.UID);
            P.push(cursor.value.PID);
            last = cursor.value.PID;
            cursor.value.name = cursor.value[c.name];
            objs.push(cursor.value);
          }
          cursor.continue();
        }
        else{
          console.log(P);
          // get(P);
          $scope.$apply(function(){
            $scope.data = objs;
          });
        }
      }
    }
    // We have programs, display universities.
    else if(typeof $scope.p !== 'null'){
      get();
    }
    // We do not have anything.
    else{
      get();
    }

    // Retrieve whatever has been asked.
    var get = function(){
      var index = c.store.index(c.index);
      index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
          cursor.value.name = cursor.value[c.name];
          objs.push(cursor.value);
          cursor.continue();
        }
        else{
          $scope.$apply(function(){
            $scope.data = objs;
          });
        }
      }
    } // end get()
  }; // end request.onsuccess()

  $scope.clicked = function(evt) {
    console.log(evt);
  }
}]);
