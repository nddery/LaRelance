'use strict';

var app = angular.module('app', ['ui.bootstrap']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'views/main.html',   controller: 'AppCtrl'}).

    when('/vis', {templateUrl: 'views/vis.html',   controller: 'VisCtrl'}).

    otherwise({redirectTo: '/'});
}]);

app.value('stdData', {
  "dataType" : [
    { "id" :  "enEmploi", "name" :          "En emploi (%)" }
    ,{ "id" :  "auxEtudes", "name" :         "Aux études (%)" }
    ,{ "id" :  "emploiTempsPlein", "name" :  "Emploi à temps plein (%)" }
    ,{ "id" :  "dureeDeRecherche", "name" :  "Durée de recherche (semaine)" }
    ,{ "id" :  "salaireHebdoBrut", "name" :  "Salaire hebdomadaire brut" }
    ,{ "id" :  "emploiEnRapport", "name" :   "Emploi en rapport (%)" }
  ]
});


    // { "id" :   "nVisees", "name" :           "nVisees" }
    // ,{ "id" :  "tauxDeReponse", "name" :     "Taux de réponse" }
    // ,{ "id" :  "enEmploi", "name" :          "En emploi" }
    // ,{ "id" :  "rechercheEmploi", "name" :   "À la recherche d'un emploi" }
    // ,{ "id" :  "auxEtudes", "name" :         "Aux études" }
    // ,{ "id" :  "pInactives", "name" :        "Personnes inactives" }
    // ,{ "id" :  "tauxDeChomage", "name" :     "Taux de chomage" }
    // ,{ "id" :  "emploiTempsPlein", "name" :  "Emploi à temps plein" }
    // ,{ "id" :  "dureeDeRecherche", "name" :  "Durée de recherche" }
    // ,{ "id" :  "salaireHebdoBrut", "name" :  "Salaire hebdomadaire brut" }
    // ,{ "id" :  "emploiEnRapport", "name" :   "Emploi en rapport (%)" }
    // ,{ "id" :  "enRapport", "name" :         "enRapport" }
