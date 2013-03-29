// http://stackoverflow.com/a/12631074/2077298
// http://jsfiddle.net/p3ZMR/3/
angular.module('app')
.directive('activeLink', ['$location', function(location) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      // var anchor = angular.element(element.children()[0]);
      var clazz = attrs.activeLink;
      var path = angular.element(element.children()[0]).attr('href');
      path = path.substring(1); // path does not return including hashbang
      scope.location = location;
      scope.$watch('location.path()', function(newPath) {
        if (path === newPath) {
          element.addClass(clazz);
        } else {
          element.removeClass(clazz);
        }
      });
    }
  };
}]);
