'use strict';
angular.module('app')
.directive('bucketMode', ['bucket', function(bucket){
  // Constants
  var margin      = 20,
      width       = window.innerWidth,
      height      = window.innerHeight,
      radius      = Math.min(width, height) / 2,
      twoPI       = 2 * Math.PI,
      color       = d3.scale.category20c();

  return {
    // The directive can only be invoked by using tag in the template.
    restrict: 'E',
    // Attributes bound to the scope of the directive.
    scope: {
      data: '='
    },
    link: function (scope, elem, attrs) {
      // Initialization, done once per my-directive tag in template.
      // If my-directive is within an ng-repeat-ed template then it will be
      // called every time ngRepeat creates a new copy of the template.
      var force = d3.layout.force()
        .charge(-300)
        .size([(width -  angular.element('#right-menu').width()), height]);

      // Set up the initial svg, full width and height.
      var svg = d3.select(elem[0])
        .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g');

      // Whenever the bound 'exp' expression changes, execute this
      scope.$watch('data', function (newData, oldData) {
        // Exit if no new data.
        if(!newData){
          return;
        }

        force.nodes(newData)
          .links([])
          .start();

        var node = svg.selectAll('.node')
          .data(newData)
          .enter().append('g')
          .attr('class', 'node')
          .call(force.drag);

        node.append('image')
          .attr('xlink:href', function(d){
            return 'img/' + d.UNAME.toLowerCase() + '.ico';
          })
          .attr('x', -8)
          .attr('y', -8)
          .attr('width', 16)
          .attr('height', 16);

        node.append('text')
          .attr('dx', 12)
          .attr('dy', '.35em')
          .text(function(d) { return d.name });

        force.on('tick', function() {
          node.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
          });
        });
      });
    }
  };
}]);
