'use strict';
angular.module('app')
.directive('lrVisSBar', ['$rootScope', 'stdData', function($rootScope, stdData) {
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
          height = window.innerHeight,
          r = Math.min(width, height) / 1.8,
          s = .09,
          data;

      function update(){
        console.log(data);
        var arc = d3.svg.arc()
          .startAngle(0)
          .endAngle(function(d) {
            return isNaN(d.value) ? 0 : (d.value / 100) * 2 * Math.PI;
          })
          .innerRadius(function(d,i) { return (++i / 10) * r; })
          .outerRadius(function(d,i) { return ((++i / 10) + s) * r; });

        var arcBG = d3.svg.arc()
          .startAngle(function(d) { return isNaN(d.value) ? 0 : (d.value / 100) * 2 * Math.PI; })
          .endAngle(1*2*Math.PI)
          .innerRadius(function(d,i) { return (++i / 10) * r; })
          .outerRadius(function(d,i) { return ((++i / 10) + s) * r; });

        var vis = d3.select(elem[0]).append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        // var g;
        var g = vis.selectAll('g')
          .data(data)
          .enter().append('g');

        g.append('path')
          .style('fill', '93cfeb')
          .attr('d', arc)
          .attr('transform', 'rotate(-90)');

        // g.append('path')
        //   .style('fill', 'c7c7c7')
        //   .attr('d', arcBG)
        //   .attr('transform', 'rotate(-90)');

        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '1em')
          .style('fill', 'white')
          .text(function(d) { return d.value; });

        // Update arcs.
        g.select('text')
          .attr('dy', function(d) { return d.value/100 < .5 ? '-.5em' : '1em'; }) //moves text inside bars
          .attr('transform', function(d,i) {
            return 'rotate(' + 360 * (d.value/100-.25) + ')' + 'translate(0,' + -((++i / 10) + s / 2) * r + ')' + 'rotate(' + (d.value/100 < .5 ? -90 : 90) + ")" //rotate brings text to end of bar,
            //return "rotate(" + 360 * d.value + ")" + "translate(-20," + -((++i / 10) + s / 5) * r + ")" + "rotate(" + (d.value < .5 ? 0 : 90) + ")" //sets text up to run horizontally,
          })
          .text(function(d) { return d.value; });

        // var d= [.45,.45,.29,.29,.25]

        // return [
        //     {value: d[0],  index: .5, text: pText(d[0])},
        //     {value: d[1],  index: .4, text: pText(d[1])},
        //     {value: d[2],    index: .3, text: pText(d[2])},
        //     {value: d[3], index: .2, text: pText(d[3])},
        //     {value: d[4],    index: .1, text: pText(d[4])},
        // ];
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
