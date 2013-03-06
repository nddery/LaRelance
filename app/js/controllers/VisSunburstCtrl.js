'use strict';

angular.module('app')
.controller('VisSunburstCtrl', ['$scope', '$routeParams', 'idb', function VisSunburstCtrl($scope, $routeParams, idb) {
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
          var uniq  = parseInt(university.UID, 10) + parseInt(program.PID, 10),
              index = dStore.index("UNIQ"),
              range = IDBKeyRange.only(uniq.toString());

          index.openCursor(range).onsuccess = function(event){
            var cursor = event.target.result;
            if(cursor){
              // program.children.push({
              //   "name": "UID",
              //   "size": cursor.value.UID});
              // program.children.push({
              //   "name": "PID",
              //   "size": cursor.value.PID});
              // program.children.push({
              //   "name": "TYPE",
              //   "size": cursor.value.TYPE});
              program.children.push({
                "name": "nVisees",
                "size": cursor.value.nVisees});
              program.children.push({
                "name": "tauxDeReponse",
                "size": cursor.value.tauxDeReponse});
              program.children.push({
                "name": "emEmploi",
                "size": cursor.value.emEmploi});
              program.children.push({
                "name": "rechercheEmploi",
                "size": cursor.value.rechercheEmploi});
              program.children.push({
                "name": "auxEtudes",
                "size": cursor.value.auxEtudes});
              program.children.push(
                {"name": "pInactives",
                  "size": cursor.value.pInactives});
              program.children.push({
                "name": "tauxDeChomage",
                "size": cursor.value.tauxDeChomage});
              program.children.push({
                "name": "emploiTempsPlein",
                "size": cursor.value.emploiTempsPlein});
              program.children.push({
                "name": "dureeDeRecherche",
                "size": (parseInt(cursor.value.dureeDeRecherche, 10)) * 100});
              program.children.push({
                "name": "salaireHebdoBrut",
                "size": (parseInt(cursor.value.salaireHebdoBrut, 10) * 100)});
              program.children.push({
                "name": "emploiEnRapport",
                "size": (parseInt(cursor.value.emploiEnRapport, 10) * 100)});
              program.children.push({
                "name": "enRapport",
                "size": cursor.value.enRapport});

              cursor.continue();
            }
            else{
              // Delete programs with no children (data)
              if(program.children.length === 0) {
                university.children.splice(pIndex, pIndex);
              }
              else {
                console.log(program.children.length);
              }

              if(uCount === uIndex && pCount === pIndex) {
                data.children = universities;
                $scope.$apply(function(scope){
                  scope.data = data;
                });
              }
            }
          }
        }); // end university.children.forEach()
      }); // end universities.forEach()
    } // end retrieveDonnees();
  }; // end request.onsuccess()
}]);
