'use strict';
angular.module('app')
.directive('lrVis', ['$rootScope', 'stdData', function($rootScope, stdData) {
  // Constants
  var width  = window.innerWidth,
      height = window.innerHeight - 40,
      radius = Math.min(width, height) / 2,
      twoPI  = 2 * Math.PI,
      color  = d3.scale.category20c(),
      closed = false;

  function conceal(elem){
    elem.css('display', 'none');
  }

  function reveal(elem){
    elem.css('display', 'block');
  }

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
      var PI = Math.PI;

      // HUD, display the HUD around a node.
      var HUD = {
        d: null,
        i: null,
        visible: false,

        hud: null,
        arc1: d3.svg.arc()
          .innerRadius(50)
          .outerRadius(200)
          .startAngle(35 * (PI / 180)) // degs to radians
          .endAngle(215 * (PI / 180)),
        arc2: d3.svg.arc()
          .innerRadius(50)
          .outerRadius(200)
          .startAngle(215 * (PI / 180))
          .endAngle(395 * (PI / 180)),

        setHUD: function(hud){
          HUD.hud = hud;
        },

        setNode: function(d,i){
          HUD.d = d;
          HUD.i = i;
        },

        display: function(){
          HUD.hud.append('svg:path')
            .attr('d', HUD.arc1)
            .attr('fill', '#0f0f0f')
            .attr('stroke', '#fff');

          HUD.hud.append('svg:path')
            .attr('d', HUD.arc2)
            .attr('fill', '#0f0f0f')
            .attr('stroke', '#fff');

          HUD.hud.attr('transform', function(){ return "translate("+ HUD.d.x +","+ HUD.d.y +")"; });

          HUD.visible = true;
        },

        move: function(){
          if(HUD.visible){
            HUD.hud.attr('transform', function(){ return "translate("+ HUD.d.x +","+ HUD.d.y +")"; });
          }
        },

        remove: function(){
          HUD.hud.remove();
          HUD.visible = false;
        }
      };

      var force = d3.layout.force()
        .on('tick', tick)
        .charge(-2000)
        .linkDistance(height / 4)
        .size([width, height]);

      // Set up the initial svg, full width and height.
      var svg = d3.select(elem[0])
        .append('svg')
          .attr('width', width)
          .attr('height', height);

      conceal(angular.element(svg[0]));

      var loading = d3.select(elem[0])
        .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('text')
            .attr('class', 'loadingIndicator')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle');

      function tick(tick){
        HUD.move();

        link
          .attr('x1', function(d){ return d.source.x; })
          .attr('y1', function(d){ return d.source.y; })
          .attr('x2', function(d){ return d.target.x; })
          .attr('y2', function(d){ return d.target.y; });

        node
          .attr('transform', function(d){ return "translate("+ d.x +","+ d.y +")"; });

        // "Notification" when it is almost done.
        if(!closed){
          if(tick.alpha < 0.08){
            reveal(angular.element(svg[0]));
            loading.remove();
            closeAll();
            closed = true;
          }
        }
      }

      function closeAll(){
        angular.forEach(data.children, function(v,k){
          if(v.children){
            v._children = v.children;
            v.children  = null;
          }
        });
        update();
      }

      // Color leaf nodes orange, and packages white or blue.
      function color(d){
        return d._children ? 'red1' : d.children ? 'red2' : 'green';
      }

      // Toggle children on click.
      function click(d, i){
        // If HUD is NOT visible.
        if(!HUD.visible){
          var shouldClose = true;
          // If we clicked on a program.
          if(d.hasOwnProperty("UID")){
            HUD.setHUD(svg.insert('g', 'node'));
            HUD.setNode(d, i);
            HUD.display();
            shouldClose = false;
          }

          if(d.children){
            d._children = d.children;
            d.children  = null;
          }
          else{
            if(shouldClose) closeAll();
            d.children  = d._children;
            d._children = null;
          }

          update();
        }
        else{
          HUD.remove();
        }
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
      //   .endAngle(355 * (PI / 180));

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
          .attr('x1', function(d){ return d.source.x; })
          .attr('y1', function(d){ return d.source.y; })
          .attr('x2', function(d){ return d.target.x; })
          .attr('y3', function(d){ return d.target.y; });

        // Exit any old links.
        link.exit().remove();

        // Update the nodes.
        node = svg.selectAll('g.node')
          .data(nodes, function(d){ return d.id; });

        var group = node.enter().append('g')
          .attr('class', function(d, i){
            var c = 'node';
            if(d.name === 'root'){
              c += ' hidden';
            }
            return c;
          })
          .attr('transform', function(d){ return "translate("+ d.x +","+ d.y +")"; })
          .call(force.drag)
          .on('click', click);

        group.append('circle')
          .attr('r', function(d) { return Math.sqrt(d.salaireHebdoBrut) / 2 || 15; })
          .attr('class', color)
          .style('stroke-width', '5');

        group.append('text')
          .attr('dx', 20)
          .attr('dy', '.35em')
          .text(function(d) { return d.name });

        group.append('image')
          .attr('xlink:href', function(d){
            if(typeof d.image !== 'undefined'){
              return d.image;
            }
            else{
              return 'img/U/_pixel.gif';
            }
          })
          .attr('x', -8)
          .attr('y', -8)
          .attr('width', 16)
          .attr('height', 16);

        // Exit any old nodes.
        node.exit().remove();
      }

      // Whenever the bound 'exp' expression changes, execute this
      scope.$watch('bind', function (newData, oldData) {
        // Bail out early if no new data.
        if(!newData){
          return;
        }
        else{
          data = newData;
          console.log(data);
          update();
        }
      });
    }
  };
}]);
