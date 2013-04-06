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
    {
      "id" : "enEmploi"
      ,"name" : "En emploi (%)"
      ,"min" : "0.0"
      ,"max" : "100.0"
    }
    ,{
      "id" : "auxEtudes"
      ,"name" : "Aux études (%)"
      ,"min" : "0.0"
      ,"max" : "100.0"
    }
    ,{
      "id" : "emploiTempsPlein"
      ,"name" : "Emploi à temps plein (%)"
      ,"min" : "0.0"
      ,"max" : "100.0"
    }
    ,{
      "id" : "dureeDeRecherche"
      ,"name" : "Durée de recherche (semaine)"
      ,"min" : "1"
      ,"max" : "52"
    }
    ,{
      "id" : "salaireHebdoBrut"
      ,"name" : "Salaire hebdomadaire brut"
      ,"min" : "414"
      ,"max" : "2625"
    }
    ,{
      "id" : "emploiEnRapport"
      ,"name" : "Emploi en rapport (%)"
      ,"min" : "0.0"
      ,"max" : "100.0"
    }
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
