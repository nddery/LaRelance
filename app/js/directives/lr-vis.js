'use strict';
angular.module('app')
.directive('lrVis', ['$rootScope', 'stdData', function($rootScope, stdData) {
  // Constants
  var width       = window.innerWidth,
      height      = window.innerHeight - 40,
      radius      = Math.min(width, height) / 2,
      twoPI       = 2 * Math.PI,
      color       = d3.scale.category20c();

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
      var node, link, data;

      var force = d3.layout.force()
        .on('tick', tick)
        .size([width, height]);

      // Set up the initial svg, full width and height.
      var svg = d3.select(elem[0])
        .append('svg:svg')
          .attr('width', width)
          .attr('height', height);

      function tick(){
        link
          .attr("x1", function(d){ return d.source.x; })
          .attr("y1", function(d){ return d.source.y; })
          .attr("x2", function(d){ return d.target.x; })
          .attr("y2", function(d){ return d.target.y; });

        node
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; });
      }

      // Color leaf nodes orange, and packages white or blue.
      function color(d){
        return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
      }

      // Toggle children on click.
      function click(d){
        if(d.children){
          d._children = d.children;
          d.children  = null;
        }
        else{
          d.children  = d._children;
          d._children = null;
        }

        update();
      }

      // Returns a list of all nodes under the root.
      function flatten(root){
        var nodes = [],
            i     = 0;

        function recurse(node){
          if(node.children) node.children.forEach(recurse);
          if(!node.id) node.id = ++i;
          nodes.push(node);
        }

        recurse(root);
        return nodes;
      }

      // Update the force layout.
      function update(){
        var nodes = flatten(data),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
          .nodes(nodes)
          .links(links)
          .start();

        // Update the links.
        link = svg.selectAll('line.link')
          .data(links, function(d){ return d.target.id; });

        // Enter any new links.
        link.enter().insert('svg:line', '.node')
          .attr('class', 'link')
          .attr("x1", function(d){ return d.source.x; })
          .attr("y1", function(d){ return d.source.y; })
          .attr("x2", function(d){ return d.target.x; })
          .attr("y3", function(d){ return d.target.y; })

        // Exit any old links.
        link.exit().remove();

        // Update the nodes.
        node = svg.selectAll('circle.node')
          .data(nodes, function(d){ return d.id; })
          .style('fill', color);

        // Enter any new nodes.
        node.enter().append('svg:circle')
          .attr('class', 'node')
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return Math.sqrt(d.salaireHebdoBrut) / 10 || 4.5; })
          .style('fill', color)
          .on('click', click)
          .call(force.drag);
          // .attr("r", function(d) { return Math.sqrt(d.salaireHebdoBrut) / 4 || 18; })

        // Exit any old nodes.
        node.exit().remove();
      }

      // // Whenever the bound 'exp' expression changes, execute this
      // scope.$watch('bind', function (newData, oldData) {
      //   // Bail out early if no new data.
      //   if(!newData){
      //     return;
      //   }
      //   else{
      //     data = newData;
      //     update();
      //   }
      // });

      d3.json("data/test 2.json", function(json) {
        data = json;
        update();
      });
    }
  };
}]);
