'use strict';


var app = angular.module('app', []);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'partials/main.html',   controller: 'AppCtrl'}).
    when('/vis', {templateUrl: 'partials/vis.html',   controller: 'VisCtrl'}).
    when('/vis/sunburst', {templateUrl: 'partials/vis-sunburst.html', controller: 'VisSunburstCtrl'}).
    otherwise({redirectTo: '/'});
}]);

// Load the data.
(function(){
  data = {};
  data.init();
})();
