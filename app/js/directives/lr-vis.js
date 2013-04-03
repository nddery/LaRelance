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

        labels: ['COMPARER', 'ANALYSER'],

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

          // UNIVERSITY & PROGRAM LABEL
          var labels = HUD.hud.append('svg:g')
            .style('fill', '#fff')
            .style('font-size', 20)
            .style('stroke-width', 0);

          labels.append('svg:text')
            .style('font-size', 30)
            .attr('x', function(){ console.log(HUD.d.name.getComputedTextLenght); return this.getComputedTextLenght / 2; })
            .attr('y', -235)
            .attr('dy', '.35em')
            .text(HUD.d.UNAMEL);

          labels.append('svg:text')
            .style('font-size', 25)
            .attr('x', function(){ console.log(HUD.d.name.getComputedTextLenght); return this.getComputedTextLenght / 2; })
            .attr('y', -200)
            .attr('dy', '.35em')
            .text(HUD.d.PNAME);

          // ARCS LABEL
          labels.append('svg:text')
            .attr('x', -100)
            .attr('y', -80)
            .text(HUD.labels[0]);

          labels.append('svg:text')
            .attr('x', 85)
            .text(HUD.labels[1]);

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
        .gravity(0.5)
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
          .attr('height', height);
      var loadingText = loading.append('text')
        .attr('class', 'loadingIndicator')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text('chargement');

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
            loading.remove();

            reveal(angular.element(svg[0]));

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
            // Open children
            d._children = d.children;
            d.children  = null;

            // Position the clicked item in the center of the screen.
            // d.attr('cx', width / 2);
            // d.attr('cy', height / 2);
            // d.fixed = true;
          }
          else{
            // Close children.
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

      function getRadius(d){
        return Math.sqrt(d.salaireHebdoBrut) / 1.5 || 25;
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

        // OUTER CIRCLE
        group.append('circle')
          .attr('r', function(d){ return getRadius(d) } )
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

        var innerGroup = group.append('g')
          .attr('transform', 'translate(0,-8)');

        // LABEL
        innerGroup.append('foreignObject')
          .attr('width', 100)
          .attr('height', 100)
          .attr('transform', function(d) {
            var x = -50,
                y = !d.image ? 0 : 10;
            return 'translate('+ x + ',' + y +')';
          })
          .append("xhtml:div")
            .attr('class', 'innerText')
            .style("font", "14px 'Helvetica Neue'")
            .html(function(d) { return d.name } );

        // IMAGE
        innerGroup.append('image')
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
          update();
        }
      });
    }
  };
}]);
