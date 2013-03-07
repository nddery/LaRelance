'use strict';
angular.module('app')
.directive('lrBucketMode', function(){
  // Constants
  var margin = 20,
      width  = window.innerWidth,
      height = window.innerHeight - (margin * 2),
      radius = Math.min(width, height) / 2,
      color  = d3.scale.category20c();

  var total         = c.length,
      workingHeight = App.ui.height - ( App.ui.margins * 2 ),
      twoPI         = 2 * Math.PI,
      angle         = 360 / total,
      currentAngle  = 0;

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

      // Set up the initial svg, full width and height.
      var svg = d3.select(elem[0])
        .append('svg')
          .attr('width', width)
          .attr('height', height)
        .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height * .52 + ')');

      // Whenever the bound 'exp' expression changes, execute this
      scope.$watch('data', function (newData, oldData) {
        // Clear the elements inside of the directive.
        svg.selectAll('*').remove();

        // Exit if no new data.
        if (!newData) {
          return;
        }

        var partition = d3.layout.partition()
          .sort(null)
          .size([2 * Math.PI, radius * radius])
          .value(function(d) { return 1; });


          console.log(JSON.stringify(newData));
        var path = svg.datum(newData).selectAll('path')
            .data(partition.nodes)
          .enter().append('path')
            .attr('display', function(d) { return d.depth ? null : 'none'; }) // hide inner ring
            .attr('d', arc)
            .style('stroke', '#fff')
            .style('fill', function(d) { return color((d.children ? d : d.parent).name); })
            .style('fill-rule', 'evenodd')
            .each(stash);

        d3.selectAll('input').on('change', function change() {
          var value = this.value === 'count'
              ? function() { return 1; }
              : function(d) { console.log(d); return d.size; };

          path
              .data(partition.value(value).nodes)
            .transition()
              .duration(1500)
              .attrTween('d', arcTween);
        });
      });
    }
  };
});
