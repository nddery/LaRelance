'use strict';

angular.module('app').controller('VisSunburstCtrl', ['$scope', '$routeParams', 'idb', function VisSunburstCtrl($scope, $routeParams, idb) {
  // Will hold the data retrieved from the database.
  var universities = [], programs = [], donnees = [];
  var streamRetrieved = 0;

  // Get our data.
  var request = idb.indexedDB.open( idb.DB_NAME, idb.DB_VERSION );
  request.onsuccess = function( e ) {
    var db   = e.target.result,
        trn  = db.transaction(["UNIVERSITIES", "PROGRAMS", "DATA"]),
        data = {"name": "sunburst", "children": []},
        universities = [], programs = [], donnees = [];

    var uStore = trn.objectStore("UNIVERSITIES");
    var pStore = trn.objectStore("PROGRAMS");
    var dStore = trn.objectStore("DATA");

    // Retrieve all universities and store them in the respective array.
    uStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if ( cursor ) {
        // Already add the children array for universities.
        cursor.value.children = [];
        cursor.value.name = cursor.value.UNAME;
        universities.push(cursor.value);
        cursor.continue();
      }
      else {
        retrievePrograms();
      }
    }

    var retrievePrograms = function(){
      // Retrieve all programs and store them in the respective array.
      pStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if ( cursor ) {
          cursor.value.children = [];
          cursor.value.name = cursor.value.PNAME;
          programs.push(cursor.value);

          cursor.continue();
        }
        else {
          associateProgramsToUniversities();
        }
      }
    } // end retrievePrograms();

    var associateProgramsToUniversities = function(){
      var length = universities.length - 1;
      universities.forEach(function(university, uIndex){
        university.children = programs;

        if ( length === uIndex )
          associateDonnees();
      });
    } // end associateProgramesToUniversities()

    // Associate the data to each university program.
    var associateDonnees = function(){
      var uCount = universities.length - 1,
          pCount = universities[0].children.length - 1;

      // For each universities, go through each program.
      universities.forEach(function(university, uIndex){
        university.children.forEach(function(program, pIndex){
          // Query the data object store on the UNIQ field.
          // UNIQ === UID + PID (+ as in addition)
          // The index will either return 0, 1, or 2 result(s).
          // 0 if no row matched, 1 or 2 depending on if there is data for both
          // undergrad and master.
          var uniq  = parseInt("975000") + parseInt("5102");

          var index = dStore.index("UNIQ");
          var range = IDBKeyRange.only(uniq.toString());

          index.openCursor(range).onsuccess = function(event){
            var cursor = event.target.result;
            var obj = {};
            if(cursor){
              console.log(typeof(cursor.value.UNIQ));
              program.children.push({"name": "UID", "size": cursor.value.UID});
              program.children.push({"name": "PID", "size": cursor.value.PID});
              program.children.push({"name": "TPYE", "size": cursor.value.TYPE});
              program.children.push({"name": "nVisees", "size": cursor.value.nVisees});
              program.children.push({"name": "tauxDeReponse", "size": cursor.value.tauxDeReponse});
              program.children.push({"name": "emEmploi", "size": cursor.value.emEmploi});
              program.children.push({"name": "rechercheEmploi", "size": cursor.value.rechercheEmploi});
              program.children.push({"name": "auxEtudes", "size": cursor.value.auxEtudes});
              program.children.push({"name": "pInactives", "size": cursor.value.pInactives});
              program.children.push({"name": "tauxDeChomage", "size": cursor.value.tauxDeChomage});
              program.children.push({"name": "emploiTempsPlein", "size": cursor.value.emploiTempsPlein});
              program.children.push({"name": "dureeDeRecherche", "size": cursor.value.dureeDeRecherche});
              program.children.push({"name": "salaireHebdoBrut", "size": cursor.value.salaireHebdoBrut});
              program.children.push({"name": "emploiEnRapport", "size": cursor.value.emploiEnRapport});
              program.children.push({"name": "enRapport", "size": cursor.value.enRapport});

              cursor.continue();
            }
            else{
              // console.log(program.children);
            }
          }

          if(uCount === uIndex && pCount === pIndex) {
              data.children = universities;
            // console.log(JSON.stringify(data));
            $scope.$apply(function(scope){
              scope.data = data;
            });
          }
        }); // end university.children.forEach()
      }); // end universities.forEach()

      // // Retrieve all donnees and store them in the respective array.
      // dStore.openCursor().onsuccess = function(event) {
      //   var cursor = event.target.result;
      //   if ( cursor ) {
      //     donnees.push(cursor.value);
      //     cursor.continue();
      //   }
      //   else {
      //     console.log(universities);
      //     console.log(donnees);
      //   }
      // }
    } // end retrieveDonnees();
  }; // end request.onsuccess()


    // // Loop through all retrieved universities
    // uStore.openCursor().onsuccess = function(event) {
    //   var cursor = event.target.result;
    //   if (cursor) {
    //     // Create the children array for the university.
    //     cursor.value.children = [];
    //     data.children.push(cursor.value);
    //     cursor.continue();
    //   }
    //   // Universities collected.
    //   else {
    //     // Get the programs.
    //     var programs = [];
    //     pStore.openCursor().onsuccess = function(event) {
    //       var cursor = event.target.result;
    //       if (cursor) {
    //         programs.push(cursor.value);
    //         cursor.continue();
    //       }
    //       // Done retrieving programs.
    //       else {
    //         var universityCount = 0;
    //         // Loop through universities and add all programs.
    //         data.children.forEach(function(university){
    //           // Add the programs.
    //           university.children = programs;

    //           // Get all data pertaining to current university.
    //           var universityData = [];
    //           var i = dStore.index("UID");
    //           var r = IDBKeyRange.only(university.UID);
    //           i.openCursor(r).onsuccess = function(event) {
    //             var cursor = event.target.result;
    //             if (cursor) {
    //               universityData.push(cursor.value);
    //               cursor.continue();
    //             }
    //             // Done getting data for current university.
    //             else {
    //               // Loop through the programs and add the data.
    //               var programCount    = 0;
    //               university.children.forEach(function(currentProgram){
    //                 // Loop through universityData and add it if it is for the
    //                 // current program.
    //                 currentProgram.children = [];
    //                 universityData.forEach(function(currentData){
    //                   if (currentData.PID === currentProgram.PID) {
    //                     currentProgram.children.push(currentData);
    //                   }
    //                 });

    //                 // If the program children array is empty, delete it.
    //                 if (currentProgram.children.length === 0) {
    //                   console.log(university.UNAME + ' : ' + currentProgram.PNAME);
    //                   delete currentProgram;
    //                   // delete currentProgram.children;
    //                 }

    //                 // If we are done this university.children loop.
    //                 if(programCount === university.children.length) {
    //                   universityCount++;
    //                 }
    //                 else{
    //                   programCount++;
    //                 }

    //                 if ( universityCount === ( data.children.length - 1 ) ) {
    //                   console.log('ALL DONE');
    //                   // Ca fonctionne!
    //                   $scope.$apply(function(scope){
    //                     scope.data = data;
    //                   });
    //                 }
    //               });
    //             }
    //           };
    //         });

    //         // @TODO: Once stringified, seems like we loose DATA...
    //         // console.log(data);
    //         // console.log(JSON.stringify(data));
    //       }
    //     }
    //   }
    // };
}]);
