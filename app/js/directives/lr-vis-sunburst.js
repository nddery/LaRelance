angular.module('app').directive('lrVisSunburst', function(){
  // Constants
  var margin = 20,
      width  = window.innerWidth,
      height = window.innerHeight - (margin * 2),
      radius = Math.min(width, height) / 2,
      color  = d3.scale.category20c();

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

  // Stash the old values for transition.
  var stash = function(d) {
    console.log(d);
    d.x0 = d.x;
    d.dx0 = d.dx;
  }

  // Interpolate the arcs in data space.
  var arcTween = function(a) {
    var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    return function(t) {
      var b = i(t);
      a.x0 = b.x;
      a.dx0 = b.dx;
      return arc(b);
    };
  }


        // Exit if no new data.
        if (!newData) {
          return;
        }

        var partition = d3.layout.partition()
          .sort(null)
          .size([2 * Math.PI, radius * radius])
          .value(function(d) { return 1; });

        var arc = d3.svg.arc()
          .startAngle(function(d) { return d.x; })
          .endAngle(function(d) { return d.x + d.dx; })
          .innerRadius(function(d) { return Math.sqrt(d.y); })
          .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

        d3.json("data/flare.json", function(error, root) {
          var path = svg.datum(root).selectAll("path")
              .data(partition.nodes)
            .enter().append("path")
              .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
              .attr("d", arc)
              .style("stroke", "#fff")
              // .style("fill", function(d) { return color(d.name); })
              .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
              .style("fill-rule", "evenodd")
              .each(stash);

          d3.selectAll("input").on("change", function change() {
            var value = this.value === "count"
                ? function() { return 1; }
                : function(d) { return d.size; };

            path
                .data(partition.value(value).nodes)
              .transition()
                .duration(1500)
                .attrTween("d", arcTween);
          });
        });
      });
    }
  };
});
