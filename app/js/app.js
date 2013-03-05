'use strict';

var app = angular.module('app', []);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'views/main.html',   controller: 'AppCtrl'}).
    when('/vis', {templateUrl: 'views/vis.html',   controller: 'VisCtrl'}).
    when('/vis/sunburst', {templateUrl: 'views/vis-sunburst.html', controller: 'VisSunburstCtrl'}).
    otherwise({redirectTo: '/'});
}]);
