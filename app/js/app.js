'use strict';

var app = angular.module('app', []);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {templateUrl: 'views/main.html',   controller: 'AppCtrl'}).
    when('/bucket', {templateUrl: 'views/bucket-mode.html',   controller: 'BucketModeCtrl'}).
    when('/bucket/u/:u', {templateUrl: 'views/bucket-mode.html',   controller: 'BucketModeCtrl'}).
    when('/bucket/u/:u/p/:p', {templateUrl: 'views/bucket-mode.html',   controller: 'BucketModeCtrl'}).

    otherwise({redirectTo: '/'});
}]);
