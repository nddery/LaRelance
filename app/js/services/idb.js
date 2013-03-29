'use strict';
angular.module('app')
.service('idb', ['$rootScope', 'idbInit', 'statusBar', function($rootScope, idbInit, statusBar) {
  // This service extends the idb service and returns the same information.
  // However, U and P are filled out.
  var idb = idbInit;
  var setUniversities = function(){
    // Get our data.
    var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
    request.onsuccess = function( e ) {
      statusBar.update('updating universities');
      var db    = e.target.result,
          trn   = db.transaction(["LARELANCE"]),
          store = trn.objectStore("LARELANCE"),
          objs  = [];

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
            idb.U[cursor.value.UID]["children"] = [];
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
                  value.children.push(cursor.value);
                }
                // console.log(cursor.value);
                cursor.continue();
              }
            }
          });

          setPrograms();
        }
      } // end index.openCursor();
    } // end request.onsuccess();
  } // end setUniverrsities();

  var setPrograms = function(){
    var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
    request.onsuccess = function( e ) {
      statusBar.update('updating programs');
      var db    = e.target.result,
          trn   = db.transaction(["LARELANCE"]),
          store = trn.objectStore("LARELANCE"),
          objs  = [];

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
            idb.P[cursor.value.PID]["children"] = [];
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
                  value.children.push(cursor.value);
                }
                cursor.continue();
              }
            }
          });
          $rootScope.$broadcast('appReady');
          statusBar.update('enjoy!');
        }
      } // end index.openCursor();
    } // end request.onsuccess();
  } // end setPrograms();

  $rootScope.$on('idbInitialized', function(){
    statusBar.update('updating database service');
    setUniversities();
  });

  return idb;
}]);
