(function(){
  // Create or open the database.
  App.data.init();

  // Ensure the SVG element is has big has it can be.
})();


// Create a module for the custom AngularJS directives.
var larelance = angular.module('larelance', []);

// The controller.
larelance.controller( 'AppCtrl', function AppCtrl ($scope) {
  $scope.data = App.data.retrieveAllUniversities();
  console.log($scope.data);
});


// The directive for d3-Visualization.
larelance.directive( 'd3Visualization', function () {
  // Constants
  var margin = 20,
      width = 960,
      height = 500 - .5 - margin,
      color = d3.interpolateRgb( '#e77', '#77e' );

  return {
    // The directive can only be invoked by using tag in the template.
    restrict: 'E',
    // Attributes bound to the scope of the directive.
    scope: {
      val: '=',
      grouped: '='
    },
    link: function (scope, elem, attrs) {
      // Initialization, done once per my-directive tag in template.
      // If my-directive is within an ng-repeat-ed template then it will be
      // called every time ngRepeat creates a new copy of the template.

      // Set up the initial svg.
      var vis = d3.select(elem[0])
        .append('svg')
          .attr('width', width)
          .attr('height', height + margin + 100);

      // Whenever the bound 'exp' expression changes, execute this
      scope.$watch('val', function (newVal, oldVal) {

      })
    }
  }
});
