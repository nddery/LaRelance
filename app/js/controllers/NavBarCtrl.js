'use strict';
angular.module('app')
.controller('NavBarCtrl', ['$rootScope', '$scope', 'bucket', 'idb', function NavBarCtrl($rootScope, $scope, bucket, idb) {
  $scope.$on('bucketItemsUpdated', function(event) {
    $scope.$apply(function(){
      //
    });
  });

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
          }
          cursor.continue();
        }
        else{
          console.log(idb.U);
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
          }
          cursor.continue();
        }
        else{
          console.log(idb.P);
          $scope.$apply(function(){
            $scope.programs = idb.P;
          });
        }
      }
    };
  }



  // Add URL data to bucket.
  // var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  // request.onsuccess = function( e ) {
  //   var db     = e.target.result,
  //       trn    = db.transaction(["LARELANCE"]),
  //       dStore = trn.objectStore("LARELANCE"),
  //       objs   = [];

  //   var range  = null;
  //   // Universities
  //   if(typeof $scope.u !== 'undefined'){
  //     console.log('Adding university to bucket');
  //     // Get a list of programs from the data object store.
  //     var values = $scope.u.split(',');
  //     values.forEach(function(cur){
  //       var index = dStore.index("UID");
  //       index.get(cur).onsuccess = function(event){
  //         event.target.result.name = event.target.result.UNAME;
  //         event.target.result.label = labelU;
  //         $scope.items.push(event.target.result);

  //         $scope.$apply(function(){
  //           $scope.items = $scope.items;
  //         });
  //       }
  //     });
  //   } // end population bucket for universities.

  //   // Programs
  //   if(typeof $scope.p !== 'undefined'){
  //     console.log('Adding program to bucket');
  //     // Get a list of programs from the data object store.
  //     var values = $scope.p.split(',');
  //     values.forEach(function(cur){
  //       var index = dStore.index("PID");
  //       index.get(cur).onsuccess = function(event){
  //         event.target.result.name = event.target.result.PNAME;
  //         event.target.result.label = labelP;
  //         $scope.items.push(event.target.result);

  //         $scope.$apply(function(){
  //           $scope.items = $scope.items;
  //         });
  //       }
  //     });
  //   } // end population bucket for universities.
  // }; // end request.onsuccess()

  // var updateNextLink = function(){
  //   // Universities
  //   if(typeof $scope.u === 'undefined'){
  //     if($scope.href.match('/u/') === null){
  //       $scope.href += '/u/' + bucket.newItem.UID;
  //     }
  //     else{
  //       $scope.href += ',' + bucket.newItem.UID;
  //       // $window.location.href = $scope.href;
  //     }
  //   }
  //   // Programs
  //   else if(typeof $scope.p === 'undefined'){
  //     if($scope.href.match('/p/') === null){
  //       $scope.href += '/p/' + bucket.newItem.PID;
  //     }
  //     else{
  //       $scope.href += ',' + bucket.newItem.PID;
  //       // $window.location.href = $scope.href;
  //     }
  //   }
  //   // Data
  //   else if(typeof $scope.d === 'undefined'){
  //     if($scope.href.match('/d/') === null){
  //       $scope.href += '/d/' + bucket.newItem.name;
  //     }
  //     else{
  //       $scope.href += ',' + bucket.newItem.name;
  //       // $window.location.href = $scope.href;
  //     }
  //   }

  //   // Limit to two items of each.
  //   console.log($scope.items.length % 2);
  //   // if($scope.items.length % 2 === 1)
  //   //   $window.location.href = $scope.href;
  // }

  // $scope.remove = function(event){
  //   console.log('remove');
  // }
}]);
