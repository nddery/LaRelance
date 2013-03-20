'use strict';
angular.module('app')
.controller('BucketCtrl', ['$rootScope', '$scope', '$routeParams', 'bucket', 'idb', function BucketCtrl($rootScope, $scope, $routeParams, bucket, idb) {
  $scope.u      = $routeParams.u;
  $scope.p      = $routeParams.p;
  $scope.d      = $routeParams.d;
  $scope.href   = '#/bucket';

  var labelU = 'label-important',
      labelP = 'label-info',
      labelD = 'label';
  var currentLabel = labelU;
  if(typeof $scope.u !== 'undefined')
    currentLabel = labelP;
  if(typeof $scope.p !== 'undefined')
    currentLabel = labelD;

  // The list in the bucket.
  $scope.items = [];
  $scope.$on('bucketItemsUpdated', function(event) {
    $scope.$apply(function(){
      // console.log($scope.data[bucket.index]);
      $scope.data.splice(bucket.index, 1);
      bucket.newItem.label = currentLabel;
      $scope.items.push(bucket.newItem);
    });
  });

  // Add URL data to bucket.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db     = e.target.result,
        trn    = db.transaction(["LARELANCE"]),
        dStore = trn.objectStore("LARELANCE"),
        objs   = [];

    var range  = null;
    // Universities
    if(typeof $scope.u !== 'undefined'){
      console.log('Adding university to bucket');
      // Get a list of programs from the data object store.
      var values = $scope.u.split(',');
      values.forEach(function(cur){
        var index = dStore.index("UID");
        index.get(cur).onsuccess = function(event){
          event.target.result.name = event.target.result.UNAMEL;
          event.target.result.label = labelU;
          $scope.items.push(event.target.result);

          $scope.$apply(function(){
            $scope.items = $scope.items;
          });
        }
      });
    } // end population bucket for universities.

    // Programs
    if(typeof $scope.p !== 'undefined'){
      console.log('Adding program to bucket');
      // Get a list of programs from the data object store.
      var values = $scope.p.split(',');
      values.forEach(function(cur){
        var index = dStore.index("PID");
        index.get(cur).onsuccess = function(event){
          event.target.result.name = event.target.result.PNAME;
          event.target.result.label = labelP;
          $scope.items.push(event.target.result);

          $scope.$apply(function(){
            $scope.items = $scope.items;
          });
        }
      });
    } // end population bucket for universities.
  }; // end request.onsuccess()

  $scope.remove = function(event){
    console.log('remove');
  }
}]);
