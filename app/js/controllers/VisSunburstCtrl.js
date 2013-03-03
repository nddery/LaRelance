'use strict';

angular.module('app').controller('VisSunburstCtrl', ['$scope', '$routeParams', 'idb', function VisSunburstCtrl($scope, $routeParams, idb) {
  // Get our data.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db   = e.target.result,
        trn  = db.transaction(["UNIVERSITIES", "PROGRAMS", "DATA"]),
        data = {"name": "sunburst", "children": []};

    var uStore = trn.objectStore("UNIVERSITIES");
    var pStore = trn.objectStore("PROGRAMS");
    var dStore = trn.objectStore("DATA");

    // Loop through all retrieved universities
    uStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        // Create the children array for the university.
        cursor.value.children = [];
        data.children.push(cursor.value);
        cursor.continue();
      }
      // Universities collected.
      else {
        // Get the programs.
        var programs = [];
        pStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
            programs.push(cursor.value);
            cursor.continue();
          }
          // Done retrieving programs.
          else {
            // Loop through universities and add all programs.
            data.children.forEach(function(university){
              // Add the programs.
              university.children = programs;

              // Get all data pertaining to current university.
              var universityData = [];
              var i = dStore.index("UID");
              var r = IDBKeyRange.only(university.UID);
              i.openCursor(r).onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                  universityData.push(cursor.value);
                  cursor.continue();
                }
                // Done getting data for current university.
                else {
                  // Loop through the programs and add the data.
                  university.children.forEach(function(currentProgram){
                    // Loop through universityData and add it if it is for the
                    // current program.
                    // currentProgram.children = [];
                    universityData.forEach(function(currentData){
                      if (currentData.PID === currentProgram.PID) {
                        if (!currentProgram.hasOwnProperty("chidlren"))
                          currentProgram.children = [];

                        currentProgram.children.push(currentData);
                      }
                    });

                    // If the program children array is empty, delete it.
                    // if (currentProgram.children.length === 0) {
                    //   delete currentProgram.children;
                    // }
                  });
                }
              };
            });

            $scope.data = data;
            // @TODO: Once stringified, seems like we loose DATA...
            console.log(data);
            console.log(JSON.stringify(data));
          }
        }
      }
    };
  }; // end request.onsuccess()
}]);
