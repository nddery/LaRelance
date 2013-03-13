'use strict';
angular.module('app')
.controller('BucketCtrl', ['$scope', '$routeParams', 'idb', function BucketCtrl($scope, $routeParams, idb) {
  $scope.u      = $routeParams.u;
  $scope.p      = $routeParams.p;
  $scope.d      = $routeParams.d;

  // The list in the bucket.
  $scope.items = [];

  // $scope.items = [{"name": "NAME", "UID": "980000"},{"name": "NAME", "UID": "980000"}];
  //
  // $(window).mousedown(mouseUpAfterDrag);
  // var mouseUpAfterDrag = function(e) {
  //   console.log('moving mouse');
  //   /* You can record the starting position with */
  //   var start_x = e.pageX;
  //   var start_y = e.pageY;

  //   $().mousemove(function(e) {
  //     /* And you can get the distance moved by */
  //     var offset_x = e.pageX - start_x;
  //     var offset_y = e.pageY - start_y;
  //   });

  //   $().one('mouseup', function() {
  //     alert("This will show after mousemove and mouse released.");
  //     $().unbind();
  //     $(window).mousedown(mouseUpAfterDrag);
  //   });

  //   // Using return false prevents browser's default,
  //   // often unwanted mousemove actions (drag & drop)
  //   return false;
  // }


  // Add data to bucket.
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
          event.target.result.label = 'label-important';
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
          event.target.result.label = 'label-info';
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
