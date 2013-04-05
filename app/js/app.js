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
    { "id" :   "nVisees", "name" :           "nVisees" }
    ,{ "id" :  "tauxDeReponse", "name" :     "tauxDeReponse" }
    ,{ "id" :  "enEmploi", "name" :          "enEmploi" }
    ,{ "id" :  "rechercheEmploi", "name" :   "rechercheEmploi" }
    ,{ "id" :  "auxEtudes", "name" :         "auxEtudes" }
    ,{ "id" :  "pInactives", "name" :        "pInactives" }
    ,{ "id" :  "tauxDeChomage", "name" :     "tauxDeChomage" }
    ,{ "id" :  "emploiTempsPlein", "name" :  "emploiTempsPlein" }
    ,{ "id" :  "dureeDeRecherche", "name" :  "dureeDeRecherche" }
    ,{ "id" :  "salaireHebdoBrut", "name" :  "salaireHebdoBrut" }
    ,{ "id" :  "emploiEnRapport", "name" :   "emploiEnRapport" }
    ,{ "id" :  "enRapport", "name" :         "enRapport" }
  ]
});
