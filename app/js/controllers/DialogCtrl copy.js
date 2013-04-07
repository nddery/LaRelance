'use strict';
app.controller('DialogCtrl', ['$scope', 'idb', 'stdData', 'dialog', function DialogCtrl($scope, idb, stdData, dialog) {
  // $scope.title    = dialog.options.data.UNAMEL;
  $scope.subtitle = dialog.options.data.PNAME;
  $scope.panes    = stdData.dataType;

  getCurrentData();
  function getCurrentData(){
    var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
    request.onsuccess = function( e ) {
      var db    = e.target.result,
          trn   = db.transaction(["LARELANCE"]),
          store = trn.objectStore("LARELANCE"),
          objs  = [];

          console.log(dialog.options);

      var index  = store.index("PID"),
          range  = IDBKeyRange.only(dialog.options.data.PID),
          values = [];

      index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
          // If we also filter by university
          if(dialog.options.single){
            if(cursor.value.UID === dialog.options.data.UID){
              values.push(cursor.value);
            }
          }
          else{
            values.push(cursor.value);
          }

          cursor.continue();
        }
        else{
          if(values[0]){
            // If we are only showing for 1 university, easy, use item at position
            // 0.
            if(dialog.options.single){
              var stats = angular.copy(stdData.dataType);
              angular.forEach(stats, function(v,k){
                v.value = values[0][v.id];
              });

              apply('stats', stats);
            }
            // We are comparing many universities. We need to have a JJJJJJ
            else{
              //
            }
          }
          // No data.
          else{
            console.log('no value?');
          }
        }
      } // end index.openCursor();
    } // end request.onsuccess();
    request.onerror = function(e){
      console.log(e);
    }
  } // end getCurrentData();

  /* --------------------------------------------------------------------------
   * $apply
   * ------------------------------------------------------------------------ */

  function apply(object, value, broadcast){
    // Prevent trying to $apply when $apply in progress.
    if(!$scope.$$phase){
      $scope.$apply(function(){
        make();
      });
    }
    // But ensure what we are trying to do gets done.
    else{
      make();
    }

    function make(){
      $scope[object] = value;
      if(broadcast) $rootScope.$broadcast(broadcast)
    }
  }

  /* --------------------------------------------------------------------------
   * Dialog callbacks
   * ------------------------------------------------------------------------ */

  $scope.close = function(){
    dialog.close();
  };
}]);
