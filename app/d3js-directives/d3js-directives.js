'use strict';
var d3js = angular.module('d3js.directives', []);

//
// AREA CHART
//

d3js.directive('d3jsAreachart', [ 'stdData', 'debounce', function (stdData, debounce) {
  return {
    // The directive can only be invoked by using tag in the template.
    restrict: 'E',
    // Attributes bound to the scope of the directive.
    scope: {
      bind: '='
    },
    link: function (scope, elem, attrs) {
      var data;

      // var offset = {top: elem[0].offsetTop, left: elem[0].offsetLeft},
      var offset = {top: 100, left: elem[0].offsetLeft},
          margin = {top: 100, right: 125, bottom: 100, left: 125},
          width  = window.innerWidth - margin.left - margin.right - offset.left,
          height = window.innerHeight - margin.top - margin.bottom - offset.top;

      var dataid   = elem[0].parentElement.getAttribute('data-id'),
          datatype = elem[0].parentElement.getAttribute('data-type'),
          dataname = elem[0].parentElement.parentElement.getAttribute('heading');

      var formatPercent = d3.format('.0%');
      var formatDollar  = d3.format('.0$');
      var formatWeeks   = d3.format('.0%');

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(function(d){
          if(datatype === "$"){
            return datatype + d;
          }
          else if(datatype === "%"){
            return d + datatype;
          }
          else{
            return d + ' ' + datatype;
          }
        });

      var svg = d3.select(elem[0]).append('svg')
        .attr('width', width + margin.left + margin.right + offset.left)
        .attr('height', height + margin.top + margin.bottom + offset.top)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top / 2 + ')');


      function update(){
        data.forEach(function(d){
          d[dataid] = isNaN(d[dataid]) ? 0 : d[dataid];
        });

        // X & Y domain
        x.domain(data.map(function(d) { return d.UNAME; }));
        y.domain([0, d3.max(data, function(d) { return parseInt(d[dataid]); })]);

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(dataname);

        drawBar();
      }

      function drawBar(){
        var rect = svg.selectAll('.bar')
          .data(data)
          .enter().append('g')
            .attr('class', 'bar-group');

        rect.append('clipPath')
          .attr('id', 'clip')
          .append('rect')
            .attr('id', 'clip-rect')
            .attr('x', function(d) { return x(d.UNAME); })
            .attr('y', function(d) { return y(d[dataid]); })
            .attr('width', x.rangeBand())
            .attr('height', function(d) { return height - y(d[dataid]); });

        rect.append('rect')
          .attr('class', 'bar')
          .attr('x', function(d) { return x(d.UNAME); })
          .attr('y', function(d) { return height; })
          .attr('width', x.rangeBand())
          .transition().delay(function (d,i){ return i * 200;})
          .duration(200)
          .attr('height', function(d) { return height - y(d[dataid]); })
          .attr('y', function(d) { return y(d[dataid]); });

        // Enter labels!
        rect.append('g')
          .attr("clip-path", "url(#clip)")
          .append('text')
            .attr('class', 'bar-text')
            .attr('text-anchor', 'end')
            .attr('width', x.rangeBand())
            .attr('x', function(d){
              var width = x.rangeBand();
              return x(d.UNAME) + width + (width / 12);
            })
            .attr('y', function(d) {
              if(d[dataid] === 0){
                return y(d[dataid]);
              }
              else{
                var width = x.rangeBand();
                return y(d[dataid]) + width / 3.5;
              }
            })
            .attr('style', 'opacity:0')
            .transition().delay(function(d,i){ return i * 200;})
            .duration(300)
            .attr('style', 'opacity:1')
            .attr('style', function(d){
              var width = x.rangeBand();
              return 'font-size:' + width / 2 + 'px';
            })
            .text(function(d){ return d[dataid]; });

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

          scope.$on('preSwitchTab', debounce.debounce( function(){
            svg.selectAll('.bar-group').remove();
          }));

          scope.$on('postSwitchTab', debounce.debounce( function(){
            debounce.debounce( drawBar() );
          }));
        }
      });

      // scope.$on('newTabSelected', update() );
    }
  };
}]);
