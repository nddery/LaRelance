'use strict';
angular.module('app')
.directive('lrVisSBar', ['$rootScope', 'stdData', function($rootScope, stdData) {
  return {
    // The directive can only be invoked by using tag in the template.
    restrict: 'E',
    // Attributes bound to the scope of the directive.
    scope: {
      bind: '='
    },
    link: function (scope, elem, attrs) {
      // Initialization, done once per my-directive tag in template.
      // If my-directive is within an ng-repeat-ed template then it will be
      // called every time ngRepeat creates a new copy of the template.
      // Constants
      console.log(elem);
      var width  = elem[0].innerWidth,
          height = elem[0].innerHeight - 40,
          data;

      function update(){
        //
      }

      // Whenever the bound 'exp' expression changes, execute this
      scope.$watch('bind', function (newData, oldData) {
        // Bail out early if no new data.
        if(!newData){
          return;
        }
        else{
          data = newData;
          update();
        }
      });
    }
  };
}]);
