'use strict';
angular.module('app')
.controller('BucketModeCtrl', ['$scope', '$routeParams', 'bucket', 'idb', function BucketModeCtrl($scope, $routeParams, bucket, idb) {
  $scope.u      = $routeParams.u;
  $scope.p      = $routeParams.p;

  // Get our data.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db     = e.target.result,
        trn    = db.transaction(["LARELANCE"]),
        dStore = trn.objectStore("LARELANCE"),
        objs   = [];

    var range  = null;
    // We have both universities and programs.
    if(typeof $scope.u !== 'undefined' && typeof $scope.p !== 'undefined'){
      var values = $scope.u.split(','),
          index  = dStore.index("UID");
      index.get(values[0]).onsuccess = function(event){
        // var foo = event.target.result;
        // foo.name = 'enRapport';
        // objs.push(foo);

        // var bar = event.target.result;
        // bar.name = 'dureeDeRecherche';
        // objs.push(bar);
        // console.log(objs);
        // apply(objs);
        //
        // var notIn = ["PID", "PNAME", "UID", "UNAME", "UNAMEL", "UNIQ", "id"];
        // for(var cur in event.target.result){
        //   if(notIn.indexOf(cur) === -1){
        //     // event.target.result.name = event.target.result.cur;
        //     objs.push(event.target.result);
        //   }
        // };
        // apply(objs);
        // console.log(objs);
        // event.target.result.name = event.target.result.PNAME;
        // event.target.result.label = 'label-info';
        // $scope.items.push(event.target.result);
      }
    }
    // We only have universities, display programs.
    else if(typeof $scope.u !== 'undefined'){
      console.log('UNIVERSITIES');
      // Get a list of programs from the data object store.
      var rangeValues = $scope.u.split(','),
          index       = dStore.index("UID"),
          values      = [];

      if(rangeValues.length === 2){
        var v1 = [],
            v2 = [],
            p1 = [],
            p2 = [],
            i  = 0;
        // Get programs for first univeristy.
        range = IDBKeyRange.only(rangeValues[0]);
        index.openCursor(range).onsuccess = function(event) {
          var cursor = event.target.result;
          if(cursor){
            // If we did not stored this value yet.
            if(v1.indexOf(cursor.value.PID) === -1){
              v1.push(cursor.value.PID);
              cursor.value.name = cursor.value['PNAME'];
              p1.push(cursor.value);
            }
            cursor.continue();
          }
          else{
            i++;
            if(i === 2)
              mergePrograms(p1, p2);
          }
        }

        // Get programs for second univeristy.
        range = IDBKeyRange.only(rangeValues[1]);
        index.openCursor(range).onsuccess = function(event) {
          var cursor = event.target.result;
          if(cursor){
            // If we did not stored this value yet.
            if(v2.indexOf(cursor.value.PID) === -1){
              v2.push(cursor.value.PID);
              cursor.value.name = cursor.value['PNAME'];
              p2.push(cursor.value);
            }
            cursor.continue();
          }
          else{
            i++;
            if(i === 2)
              mergePrograms(p1, p2);
          }
        }
      }
      else {
        range = IDBKeyRange.only(rangeValues[0]);
        index.openCursor(range).onsuccess = function(event) {
          var cursor = event.target.result;
          if(cursor){
            // If we did not stored this value yet.
            if(values.indexOf(cursor.value.PID) === -1){
              values.push(cursor.value.PID);
              cursor.value.name = cursor.value['PNAME'];
              objs.push(cursor.value);
            }
            cursor.continue();
          }
          else{
            apply(objs);
          }
        }
      }
    }
    // We do not have anything, display universities
    else{
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
    }
  }; // end request.onsuccess()

  $scope.$on('bucketItemsUpdated', function(event) {
    $scope.$apply(function(){
      // Remove item from $scope.data.
      $scope.data.splice(bucket.index, 1);
    });
  });

  var mergePrograms = function(p1, p2){
    var p = [];
    p1.forEach(function(o1,i1){
      p2.forEach(function(o2,i2){
        if(p1[i1].PID === p2[i2].PID){
          p.push(p1[i1]);
        }
      });
    });

    apply(p);
  }

  var apply = function(o){
    $scope.$apply(function(){
      $scope.data = o;
    });
  }
}]);
