'use strict';
app.controller('DialogCtrl', ['$scope', 'idb', 'stdData', 'dialog', function DialogCtrl($scope, idb, stdData, dialog) {
  $scope.title    = 'Title';
  $scope.subtitle = 'Subtitle';

  getCurrentData();
  function getCurrentData(){
    var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
    request.onsuccess = function( e ) {
      var db    = e.target.result,
          trn   = db.transaction(["LARELANCE"]),
          store = trn.objectStore("LARELANCE"),
          objs  = [];

      var index = store.index("UID"),
          range = IDBKeyRange.only(dialog.options.data.U),
          value;
      index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
          if(cursor.value.PID === dialog.options.data.P){
            value = cursor.value;
          }
          cursor.continue();
        }
        else{
          if(value){
            var stats = angular.copy(stdData.dataType);
            angular.forEach(stats, function(v,k){
              v.value = value[v.id];
            });
            if(!$scope.$$phase){
              $scope.$apply(function(){
                $scope.stats = stats;
              });
            }
            else{
              $scope.stats = stats;
            }
          }
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


  $scope.close = function(){
    dialog.close();
  };
}]);
