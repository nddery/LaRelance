'use strict';
angular.module('app')
.directive('bucketMode', ['$rootScope', 'bucket', function($rootScope, bucket){
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

        // Method for dragging related stuff.
        var dragstart = function(d,i){
          $('#right-menu').css('z-index', '-1');
          force.stop();
        }

        var dragend = function(d,i){
          var $bucket      = $('#bucket'),
              targetTopLeft = $bucket.offset(),
              targetBottomRight = {bottom:($bucket.outerHeight() + targetTopLeft.top), right:($bucket.outerWidth() + targetTopLeft.left)};

          // http://codegolf.stackexchange.com/a/8661
          // If in correct x position.
          if((d3.event.sourceEvent.clientX-targetTopLeft.left^d3.event.sourceEvent.clientX-targetBottomRight.right)<0){
            // If in correct y position.
            if((d3.event.sourceEvent.clientY-targetTopLeft.top^d3.event.sourceEvent.clientY-targetBottomRight.bottom)<0){
              // console.log('X & Y');
              // console.log(d3.event);
              bucket.items.push(d);
              console.log(bucket.items);
              $rootScope.$broadcast('bucketItemsUpdated');
            }
          }

          $('#right-menu').css('z-index', '0');
          force.resume();
          tick();
        }

        var dragmove = function(d,i){
          // Move along with the mouse.
          d.px += d3.event.dx;
          d.py += d3.event.dy;
          d.x += d3.event.dx;
          d.y += d3.event.dy;
          // And tick.
          tick();
        }

        var tick = function() {
          node.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
          });
        };

        force.nodes(newData)
          .links([])
          .start();

        var node_drag = d3.behavior.drag()
          .on('dragstart', dragstart)
          .on('drag',      dragmove)
          .on('dragend',   dragend);

        var node = svg.selectAll('.node')
          .data(newData)
          .enter().append('g')
          .attr('class', 'node')
          .call(node_drag);

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

        force.on('tick', tick);
      });
    }
  };
}]);
