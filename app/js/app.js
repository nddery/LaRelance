'use strict';

var app = angular.module('app', ['d3js.directive']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'views/main.html',   controller: 'AppCtrl'}).
    when('/s:step', {templateUrl: 'views/main.html',   controller: 'AppCtrl'}).

    when('/bucket', {templateUrl: 'views/bucket-mode.html',   controller: 'BucketModeCtrl'}).
    when('/bucket/u/:u', {templateUrl: 'views/bucket-mode.html',   controller: 'BucketModeCtrl'}).
    when('/bucket/u/:u/p/:p', {templateUrl: 'views/bucket-mode.html',   controller: 'BucketModeCtrl'}).

    when('/bucket/u/:u/p/:p/d/:d', {templateUrl: 'views/vis-timeline.html',   controller: 'VisMode'}).

    when('/vis/areachart', {templateUrl: 'views/vis-areachart.html',   controller: 'VisAreaChartCtrl'}).



    otherwise({redirectTo: '/'});
}]);

app.value('stdData', {
  "visType" : [
    { "id" : "timeline", "name" : "Timeline" }
    ,{ "id" : "sunburst", "name" : "Sunburst" }
  ],
  "dataType" : [
    { "id" :  "nVisees", "name" :           "nVisees" }
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
