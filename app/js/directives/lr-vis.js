'use strict';
angular.module('app')
.directive('lrVis', ['$rootScope', 'stdData', function($rootScope, stdData) {
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
      var width  = window.innerWidth,
          height = window.innerHeight - 40,
          radius = Math.min(width, height) / 2,
          twoPI  = 2 * Math.PI,
          color  = d3.scale.category20c(),
          closed = false,
          PI     = Math.PI,
          node, link, data;

      function conceal(elem){
        elem.css('display', 'none');
      }

      function reveal(elem){
        elem.css('display', 'block');
      }

      // HUD, display the HUD around a node.
      var HUD = {
        d: null,
        i: null,
        visible: false,

        hud: null,
        arc1: d3.svg.arc()
          .innerRadius(50)
          .outerRadius(200)
          .startAngle(45 * (PI / 180)) // degs to radians
          .endAngle(135 * (PI / 180)),
        arc2: d3.svg.arc()
          .innerRadius(50)
          .outerRadius(160)
          .startAngle(135 * (PI / 180))
          .endAngle(225 * (PI / 180)),
        arc3: d3.svg.arc()
          .innerRadius(50)
          .outerRadius(180)
          .startAngle(225 * (PI / 180))
          .endAngle(405 * (PI / 180)),

        setHUD: function(hud){
          HUD.hud = hud;
          HUD.hud.style('fill', '#000');
        },

        setNode: function(d,i){
          HUD.d = d;
          HUD.i = i;
        },

        display: function(){
          HUD.hud
            .attr('fill', '#141414')
            .attr('stroke', '#5e1111');

          HUD.hud.append('svg:path')
            .attr('d', HUD.arc1);

          HUD.hud.append('svg:path')
            .attr('d', HUD.arc2);

          HUD.hud.append('svg:path')
            .attr('d', HUD.arc3);

          HUD.hud.attr('transform', function(){ return "translate("+ HUD.d.x +","+ HUD.d.y +")"; });

          console.log(elem);

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

      // Update the force layout.
      function update(){
        console.log('update');
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
          .attr('r', function(d) { return Math.sqrt(d.salaireHebdoBrut) / 2 || 20; })
          .attr('class', color)
          .style('stroke', function(d){
            if(typeof d.image !== 'undefined'){
              return "#fff";
            }
            else{
              return '#b42121';
            }
          })
          .style('stroke-width', '0.5');

        group.append('text')
          .attr('dx', 30)
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
          console.log('allo');
          update();
        }
      });
    }
  };
}]);
