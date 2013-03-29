'use strict';
angular.module('app')
.controller('BucketCtrl', ['$rootScope', '$scope', '$routeParams', '$window', 'bucket', 'idb', function BucketCtrl($rootScope, $scope, $routeParams, $window, bucket, idb) {
  $scope.u      = $routeParams.u;
  $scope.p      = $routeParams.p;
  $scope.d      = $routeParams.d;

  // Set href.
  $scope.href   = '#/bucket';
  if(typeof $scope.u !== 'undefined'){
    var values = $scope.u.split(',');
    $scope.href += '/u/' + values[0];
    if(values.length === 2)
      $scope.href += ',' + values[1];
  }
  if(typeof $scope.p !== 'undefined'){
    var values = $scope.p.split(',');
    $scope.href += '/p/' + values[0];
    if(values.length === 2)
      $scope.href += ',' + values[1];
  }
  if(typeof $scope.d !== 'undefined'){
    var values = $scope.d.split(',');
    $scope.href += '/d/' + values[0];
    if(values.length === 2)
      $scope.href += ',' + values[1];
  }

  var labelU = 'label-important',
      labelP = 'label-info',
      labelD = 'label-success';
  var currentLabel = labelU;
  if(typeof $scope.u !== 'undefined')
    currentLabel = labelP;
  if(typeof $scope.p !== 'undefined')
    currentLabel = labelD;

  // The list in the bucket.
  $scope.items = [];
  $scope.$on('bucketItemsUpdated', function(event) {
    $scope.$apply(function(){
      // Add item from bucket to bucket.
      bucket.newItem.label = currentLabel;
      $scope.items.push(bucket.newItem);

      updateNextLink();
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
          event.target.result.name = event.target.result.UNAME;
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

  var updateNextLink = function(){
    // Universities
    if(typeof $scope.u === 'undefined'){
      idb.U[bucket.newItem.UID].checked = true;
      if($scope.href.match('/u/') === null){
        $scope.href += '/u/' + bucket.newItem.UID;
      }
      else{
        $scope.href += ',' + bucket.newItem.UID;
        // $window.location.href = $scope.href;
      }
    }
    // Programs
    else if(typeof $scope.p === 'undefined'){
      idb.P[bucket.newItem.PID].checked = true;
      if($scope.href.match('/p/') === null){
        $scope.href += '/p/' + bucket.newItem.PID;
      }
      else{
        $scope.href += ',' + bucket.newItem.PID;
        // $window.location.href = $scope.href;
      }
    }
    // Data
    else if(typeof $scope.d === 'undefined'){
      if($scope.href.match('/d/') === null){
        $scope.href += '/d/' + bucket.newItem.name;
      }
      else{
        $scope.href += ',' + bucket.newItem.name;
        // $window.location.href = $scope.href;
      }
    }

    // Limit to two items of each.
    console.log($scope.items.length % 2);
    // if($scope.items.length % 2 === 1)
    //   $window.location.href = $scope.href;
  }

  $scope.remove = function(event){
    console.log('remove');
  }
}]);
