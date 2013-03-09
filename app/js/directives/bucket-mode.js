'use strict';
angular.module('app')
.directive('bucketMode', function(){
  // Constants
  var margin      = 20,
      width       = window.innerWidth,
      height      = window.innerHeight - (margin * 2),
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
        .charge(-120)
        .linkDistance(40)
        .size([width, height]);

      // Set up the initial svg, full width and height.
      var svg = d3.select(elem[0])
        .append('svg')
          .attr('width', width)
          .attr('height', height);

      var group = svg.append('g');

      // Whenever the bound 'exp' expression changes, execute this
      scope.$watch('data', function (newData, oldData) {
        // Exit if no new data.
        if (!newData) {
          return;
        }

        force
          .nodes(newData)
          .links([])
          .start();

        // var link = group.selectAll(".link")
        //   .data(graph.links)
        //   .enter().append("line")
        //     .attr("class", "link")
        //     .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = group.selectAll('.node')
          .data(newData)
          .enter().append('circle')
            .attr('class', function(d) {
              return d.fixed ? 'node fixed' : 'node not-fixed';
            })
            .attr('r', 10);

        // attach the standard force drag to all but the fixed node
        group.selectAll('.not-fixed')
          .call(force.drag);

        // attach a different drag handler to the fixed node
        var groupDrag = d3.behavior.drag()
          .on('drag', function(d) {
            // mouse pos offset by starting node pos
            var x = d3.event.x - 200,
                y = d3.event.y - 200;
            group.attr('transform', function(d) { return 'translate(' + x + ',' + y + ')'; });
          });

        group.call(groupDrag)

        node.append('title')
          .text(function(d) { return d.name; });

        force.on('tick', function() {
          node.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });
        });
      });
    }
  };
});
