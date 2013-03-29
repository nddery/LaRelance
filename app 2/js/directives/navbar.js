angular.module('app')
.directive('navbar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: 'views/navbar.html'
  }
});
