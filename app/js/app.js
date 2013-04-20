'use strict';
var app = angular.module('app', ['ngSanitize', 'ui.bootstrap', 'd3js.directives']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {templateUrl: 'views/main.html',   controller: 'AppCtrl'})

    .when('/vis', {templateUrl: 'views/vis.html',   controller: 'VisCtrl'})

    .otherwise({redirectTo: '/'});
}]);


angular.module('app')
.run(['$route', '$rootScope', function($route, $rootScope) {
  $rootScope.page_title = 'La Relance';
  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.page_title = $route.current.$route.title;
    $rootScope.controller = $route.current.$route.controller;
  });
}]);


angular.module('app')
.value('stdData', {
  "dataType" : [
    {
      "id" : "enEmploi"
      ,"name" : "En emploi"
      ,"definition" : "Sont dites &laquo; en emploi &raquo; les personnes diplômées visées par l&apos;enquête qui ont déclaré travailler à leur compte ou pour autrui, sans étudier à temps plein."
      ,"type" : "%"
      ,"content" : "d3js-directives/areachart.html"
      ,"min" : "0.0"
      ,"max" : "100.0"
    }
    ,{
      "id" : "emploiTempsPlein"
      ,"name" : "Emploi à temps plein"
      ,"definition" : "Sont dites &laquo; à temps plein &raquo; les personnes diplômées en emploi qui travaillent, de façon générale, 30 heures ou plus par semaine."
      ,"type" : "%"
      ,"content" : "d3js-directives/areachart.html"
      ,"min" : "0.0"
      ,"max" : "100.0"
    }
    ,{
      "id" : "auxEtudes"
      ,"name" : "Aux études"
      ,"definition" : "Sont dites &laquo; aux études &raquo; les personnes diplômées visées par l&apos;enquête qui ont déclaré soit étudier à temps plein, soit étudier à temps partiel sans avoir d’emploi."
      ,"type" : "%"
      ,"content" : "d3js-directives/areachart.html"
      ,"min" : "0.0"
      ,"max" : "100.0"
    }
    ,{
      "id" : "dureeDeRecherche"
      ,"name" : "Durée de recherche"
      ,"definition" : "Nombre moyen de semaines, calculé à partir de la fin des études, qu&apos;ont pris les travailleuses et les travailleurs à temps plein pour trouver un premier emploi qu&apos;ils jugent comme un emploi d&apos;importance. À partir de 2009, la méthode de calcul diffère de celle des enquêtes précédentes. Les personnes diplômées qui ont obtenu leur premier emploi dès la fin de leurs études sont désormais incluses dans le calcul."
      ,"type" : "semaine(s)"
      ,"content" : "d3js-directives/areachart.html"
      ,"min" : "1"
      ,"max" : "52"
    }
    ,{
      "id" : "salaireHebdoBrut"
      ,"name" : "Salaire hebdomadaire brut"
      ,"definition" : "Salaire brut moyen gagné par les travailleuses et les travailleurs à temps plein au cours d&apos;une semaine normale de travail. Ces données concernent uniquement les personnes diplômées qui travaillent pour autrui."
      ,"type" : "$"
      ,"content" : "d3js-directives/areachart.html"
      ,"min" : "414"
      ,"max" : "2625"
    }
    ,{
      "id" : "emploiEnRapport"
      ,"name" : "Emploi en rapport"
      ,"definition" : "Sont dits avoir un emploi &laquo; en rapport avec leur formation &raquo; les travailleurs et les travailleuses à temps plein qui jugent que leur travail correspond à leurs études."
      ,"type" : "%"
      ,"content" : "d3js-directives/areachart.html"
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
