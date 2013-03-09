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

      // The arc we'll use over and over.
      var arc = d3.svg.arc()
        .startAngle(0)
        .endAngle(twoPI)
        .innerRadius(20)
        .outerRadius(25);

      // Whenever the bound 'exp' expression changes, execute this
      scope.$watch('data', function (newData, oldData) {
        // Exit if no new data.
        if (!newData) {
          return;
        }

        // Clear the elements inside of the directive.
        /* svg.selectAll('*').remove(); */

        // Set up the initial svg, full width and height.
        var svg = d3.select(elem[0])
          .append('svg')
            .attr('width', width)
            .attr('height', height);

        var total = newData.length,
            angle = 360 / total;

        var groups = svg
          .selectAll('g')
          .data(newData).enter()
          .append('g')
            .attr('transform', function(d,i){
              var cx = width / 2,
                  cy = height / 2,
                  a  = i * angle,
                  d  = total * 12;

              d = Math.min(Math.max(parseInt(d), 250), (radius - (margin * 2)));

              var t = 'translate(' + cx + ',' + ( cy + d ) + ')';
              var r = 'rotate(' +  a + ', 0, -' + d + ')';
              return t + r;
            });

        var text = groups
          .append('text')
            .text( function(d) { return d.name; } )
            .attr('opacity', 0)
            .attr('transform', function(d,i){
              var cx = width / 2,
                  cy = height / 2,
                  a  = i * angle,
                  d  = total * 12;

              d = Math.min(Math.max(parseInt(d), 250), (radius - (margin * 2)));

              // console.log(cx);
              // console.log(cy);
              // var t = 'translate(' + cx + ',' + ( cy ) + ')';
              var t = 'translate(' + (cx - 785) + ',' + (cy + 60) + ')';
              // var t = 'translate(0,0)';
              var r = 'rotate(-' +  a + ', 0, -' + d + ')';
              return t + r;
            });

        var drag = d3.behavior.drag()
          .origin(Object)
          .on('drag', dragmove);

        var arcs = groups
            .call(drag)
          .append('path')
            .attr('fill', 'red')
            .attr('id', function(d,i){ return 's'+i; })
            .attr('data-UID', function(d){ return d.UID; })
            .attr('data-UNAME_SHORT', function(d){ return d.UNAME_SHORT; })
            .attr('d', arc);

        var dragmove = function(d) {
          d3.select(this)
            .attr("cx", d.x = Math.max(radius, Math.min(width - radius, d3.event.x)))
            .attr("cy", d.y = Math.max(radius, Math.min(height - radius, d3.event.y)));
        }
      });
    }
  };
});
