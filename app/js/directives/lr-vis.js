'use strict';
angular.module('app')
.directive('lrVis', ['$rootScope', '$dialog', 'stdData', function($rootScope, $dialog, stdData) {
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
          node   = null,
          link   = null,
          data   = null,
          selectedNode = null;

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
            .attr('d', HUD.arc1)
            .on('click', function(){
              console.log('ANALYSER' + "\t" + HUD.d.PNAME + "\t" + HUD.d.UNAME);
              openDialogWindow( 'views/vis-analyser.html', HUD.d, true );
            });

          HUD.hud.append('svg:path')
            .attr('d', HUD.arc2);

          HUD.hud.append('svg:path')
            .attr('d', HUD.arc3)
            .on('click', function(){
              console.log('COMPARER' + "\t" + HUD.d.PNAME);
              openDialogWindow( 'views/vis-comparer.html', HUD.d, false );
            });

          // UNIVERSITY & PROGRAM LABEL
          var labels = HUD.hud.append('svg:g')
            .style('fill', '#fff')
            .style('font-size', 20)
            .style('stroke-width', 0);

        // LABEL
        HUD.hud.append('foreignObject')
          .attr('width', 800)
          .attr('height', 200)
          .attr('transform', function(d) {
            var x = -400,
                y = -240;
            return 'translate('+ x + ',' + y +')';
          })
          .append("xhtml:div")
            .attr('class', 'hudInnerText')
            .style('font-size', 30)
            .html(function(d) { return HUD.d.UNAMEL + "<br /><span>" + HUD.d.PNAME + "</span>" } );

          // ARCS LABEL
          labels.append('svg:text')
            .attr('x', -100)
            .attr('y', -80)
            .text(HUD.labels[0]);

          labels.append('svg:text')
            .attr('x', 85)
            .text(HUD.labels[1]);

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

      var openDialogWindow = function(templateUrl, data, single){
        var d = $dialog.dialog({
          templateUrl: templateUrl,
          controller: 'DialogCtrl',
          data: data,
          single: single
        });

        // We need to apply ourselves!
        if(!scope.$$phase){
          scope.$apply(function(){
            d.open();
          });
        }
        else{
          d.open();
        }
      }

      var force = d3.layout.force()
        .on('tick', tick)
        .gravity(0.5)
        .charge(-5000)
        .linkDistance(height / 3.5 )
        .size([width, height]);

      var draggable = d3.select(elem[0]).append('svg:svg')
        .attr( 'width', width )
        .attr( 'height', height )
        .attr( 'pointer-events', 'all' );

      var svg = draggable.append( 'svg:g' )
          .call( d3.behavior.zoom().on( 'zoom', rescale ) )
          .on( 'dblclick.zoom', null )
          .append( 'svg:g' );

      svg.append( 'svg:rect' )
        .attr( 'width', width )
        .attr( 'height', height )
        .attr( 'fill', 'none' );

      // // Set up the initial svg, full width and height.
      // var svg = d3.select(elem[0])
      //   .append('svg')
      //     .attr('width', width)
      //     .attr('height', height);

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

      function rescale(){
        var trans  = d3.event.translate
            ,scale = d3.event.scale;

        svg.attr( 'transform',
            'translate(' + trans + ')'
            + ' scale(' + scale + ')');
      }

      function tick(tick){
        // HUD.move();

        // var nodes = flatten(data),
        //     q = d3.geom.quadtree(nodes),
        //     i = 0,
        //     n = nodes.length;

        // while (++i < n) {
        //   q.visit(collide(nodes[i]));
        // }

        // link
        //   .attr('x1', function(d){ return d.source.x; })
        //   .attr('y1', function(d){ return d.source.y; })
        //   .attr('x2', function(d){ return d.target.x; })
        //   .attr('y2', function(d){ return d.target.y; });

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

      function collide(node) {
        var r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius;
            if (l < r) {
              l = (l - r) / l * .5;
              node.x -= x *= l;
              node.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2
              || x2 < nx1
              || y1 > ny2
              || y2 < ny1;
        };
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

      function border(d){
            if(typeof d.image !== 'undefined'){
              // console.log(d);
              if(d._children){
                return "#b42121";
              }
              else{
                return "#fff";
              }
            }
            else{
              return '#b42121';
            }
      }

      // Toggle children on click.
      function click(d, i){
        // // If HUD is NOT visible.
        // if(!HUD.visible){
        //   var shouldClose = true;
        //   // If we clicked on a program.
        //   if(d.hasOwnProperty("UID")){
        //     HUD.setHUD(svg.insert('g', 'node'));
        //     HUD.setNode(d, i);
        //     HUD.display();
        //     shouldClose = false;
        //   }

        //   if(d.children){
        //     // Open children
        //     d._children = d.children;
        //     d.children  = null;
        //   }
        //   else{
        //     // Close children.
        //     if(shouldClose) closeAll();
        //     d.children  = d._children;
        //     d._children = null;
        //   }

        //   update();
        // }
        // else{
        //   HUD.remove();
        // }


          var shouldClose = true;
          // If we clicked on a program.
          if(d.hasOwnProperty("UID")){
            // HUD.setHUD(svg.insert('g', 'node'));
            // HUD.setNode(d, i);
            // HUD.display();
            openDialogWindow( 'views/vis-comparer.html', d, false );
            shouldClose = false;
          }
          else {
            if(d.children){
              selectedNode = null;
            }
            else{
              selectedNode = d.id;
            }
          }

          if(d.children){
            // Open children
            d._children = d.children;
            d.children  = null;
          }
          else{
            // Close children.
            if(shouldClose) closeAll();
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

      function getRadius(d){
        if(typeof d.image !== 'undefined'){
          return 25;
        }
        else{
          var r = d.name.length * 2.5;
          return r > 85 ? 85 : r < 40 ? 40 : r;
          // return Math.sqrt(d.salaireHebdoBrut) * 2.5 || 50;
        }

      }

      // Update the force layout.
      function update(){
        var nodes = flatten(data),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
          .nodes(nodes)
          .links([])
          .start();

        // // Update the links.
        // link = svg.selectAll('line.link')
        //   .data(links, function(d){ return d.target.id; });

        // Enter any new links.
        // link.enter().insert('svg:line', '.node')
        //   .attr('class', 'link')
        //   .attr('x1', function(d){ return d.source.x; })
        //   .attr('y1', function(d){ return d.source.y; })
        //   .attr('x2', function(d){ return d.target.x; })
        //   .attr('y3', function(d){ return d.target.y; });

        // // Exit any old links.
        // link.exit().remove();

        // Update the nodes.
        node = svg.selectAll('g.node')
          .data(nodes, function(d){ return d.id; });

        node
          .classed( 'selected', function( d ) { return d.id === selectedNode ? true : false; });

        var group = node.enter().append('g')
          .attr('class', function(d, i){
            var c = [ 'node' ];
            if ( d.name === 'root' )        c.push( 'hidden' );
            return c.join( ' ' );
          })
          .attr('transform', function(d){ return "translate("+ d.x +","+ d.y +")"; })
          .call(force.drag)
          .on('click', click);

        // OUTER CIRCLE
        group.append('circle')
          .attr('r', function(d){ return getRadius(d) } )
          // .attr('r', function(d){ return Math.random(100,150); } )
          .attr('class', color)
          .style('stroke', border)
          .style('stroke-width', '0.5');

        var innerGroup = group.append('g')
          .attr('transform', 'translate(0,-8)');

        // LABEL
        innerGroup.append('foreignObject')
          .attr('width', 180)
          .attr('height', 180)
          .attr('transform', function(d) {
            var x = !d.image ? -75 : -90,
                y = !d.image ? -63 : 10;
            return 'translate('+ x + ',' + y +')';
          })
          .append('xhtml:div')
            .attr('class', function( d ) {
              var c = [ 'aligncenter' ];
              if ( !d.image ) c.push( 'inner' );
              return c.join( ' ' );
            })
            .html(function(d) { return d.name; } );

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
      } // end update()

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
