// http://jsfiddle.net/bY5qe/
angular.module('app')
.directive('resize', [ '$window', function ($window) {
  return function (scope, element, attrs) {
    var el           = $(element[0]),
        navbarHeight = $('.navbar').outerHeight(),
        pTop         = parseInt(el.css('padding-top')),
        pRight       = parseInt(el.css('padding-right')),
        pBottom      = parseInt(el.css('padding-bottom')),
        pLeft        = parseInt(el.css('padding-left'));

    var viewportSizeUpdated = function() {
      scope.width = $window.innerWidth - pLeft - pRight;
      scope.height = ($window.innerHeight - navbarHeight - pTop - pBottom);
      scope.orientation = $window.innerHeight > $window.innerWidth ? 'vertical' : 'horizontal';

      el.removeClass('vertical horizontal');
      el.addClass(scope.orientation);

      if(attrs.resize === 'width'){
        el.css('width', scope.width);
      }
      else if(attrs.resize === 'height'){
        el.css('height', scope.height);
      }
      else{
        el.css('width', scope.width);
        el.css('height', scope.height);
      }
    }

    viewportSizeUpdated();

    angular.element($window).bind('resize', function () {
      scope.$apply(function () {
        viewportSizeUpdated();
      });
    });
  };
}]);
