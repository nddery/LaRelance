//
// ui.js
//
// This file is responsible of the rendering the UI.
//
// We will be dealing with callback all over the place because of the asynch nature
// of IndexedDB. Probably not the best design pattern but IDB is kind of a pita.
//
(function(){
  // This is the first file included, define App.
  App = {};
  App.ui = {};
  App.ui.d3 = {};

  App.ui.svg         = d3.select( 'svg' );
  App.ui.width       = window.innerWidth;
  App.ui.height      = window.innerHeight;
  App.ui.margins     = 50;
  App.ui.bubbleWidth = 20;

  App.ui.init = function() {
    // Set the width and height.
    App.ui.svg.attr( 'width',  App.ui.width )
              .attr( 'height', App.ui.height );

    App.data.retrieveAllUniversities( App.ui.createBubbleView );

    // App.ui.test();
  }; // end App.ui.init()


  /**
   * Renders a "bubble" view on the screen with a collection of item.
   *
   * @param   {Object}  c   The object collection
   */
  App.ui.createBubbleView = function( c ) {
    var total         = c.length,
        workingHeight = App.ui.height - ( App.ui.margins * 2 ),
        twoPI         = 2 * Math.PI,
        angle         = 360 / total,
        currentAngle  = 0;

    // var arc = d3.svg.arc()
    //   .innerRadius(function(d,i){console.log('i: ' + i); return (5-i)*35;})
    //   .outerRadius(function(d,i){return (5-i)*35+30;})
    //   .startAngle(0)
    //   .endAngle(2 * Math.PI);

    var arc = d3.svg.arc()
      .startAngle( 0 )
      .endAngle( twoPI )
      .innerRadius( 20 )
      .outerRadius( 25 );

    var groups = App.ui.svg
      .selectAll( 'g' )
      .data( c ).enter()
      .append( 'g' )
        .attr( 'transform', function(d,i){
          var cx = App.ui.width / 2,
              cy = App.ui.height / 2,
              a  = i * angle
              d  = total * 12;

          var t = 'translate(' + cx + ',' + ( cy + d ) + ')';
          var r = 'rotate(' +  a + ', 0, -' + d + ')';
          return t + r;
        } );

    // var text = App.ui.svg
    //   .append( 'g' )
    //   .attr("id","thing")
    //   .style("fill","navy")
    //   .attr("class", "label");

    var arcs = groups
      .append( 'path' )
        .attr( 'fill', 'red' )
        .attr( 'id', function(d,i){ console.log('i(2): ' + i); return 's'+i; } )
        .attr( 'd', arc );

        // d returns undefined
    // text.append("text")
    //   .style("font-size",20)
    //   .append("textPath")
    //     .attr("textLength",function(d,i){return 90-i*5 ;})
    //     .attr("xlink:href",function(d,i){return "#s"+i;})
    //     .attr("startOffset",function(d,i){return 3/20;})
    //     .attr("dy","-1em")
    //     .text(function(d){console.log(d); return d.UNAME_SHORT;})



    // var radius = Math.min(App.ui.height, App.ui.width) / 2;
  }


  /**
   * Draw a "bubble" (node) on the screen.
   *
   * @param   {Object}  b   The object to draw.
   * @param   {Object}  p   The angle
   */
  App.ui.renderBubble = function( b, a, i ) {
    var twoPI = Math.PI * 2,
        xPos = 0,
        yPos = 200;

        console.log(a);
        console.log(i);
        console.log(a * i);

    // Set Y position.
    //

    // Set X position.
    //

    // Create an arc that is the right size.
    var bubble = d3.svg.arc()
      .startAngle( 0 )
      .endAngle( twoPI )
      .innerRadius( App.ui.bubbleWidth )
      .outerRadius( App.ui.bubbleWidth + ( App.ui.bubbleWidth / 4 ) );

    // Translate to the center so it is easier to work.
    var c = App.ui.svg
      .append( 'g' )
        .attr( 'class', 'center' )
        // .attr( 'transform', 'rotate(' + a * i + ', 0,0)' )
        .attr( 'transform', 'translate(' + App.ui.width / 2 + ',' + App.ui.height / 2 + ')' );

    // And add it to a group, which is himself translated into place.
    var g = c
      .append( 'g' )
        .attr( 'class', 'bubble' )
        .attr( 'transform', 'translate(' + xPos + ',' + yPos + ')' )
        .append( 'path' )
          .attr( 'd', bubble );
  }


  /**
   *
   *
   */
  App.ui.test = function( data ) {
    var twoPi = 2 * Math.PI;

    var arc = d3.svg.arc()
        .startAngle( 0 )
        .endAngle( twoPi )
        .innerRadius( 200 )
        .outerRadius( 250 ); // 20 / 25 c'est beau!

    // "g" is for "grouping" svg elements together
    var g = App.ui.svg
      .append( 'g' )
      .attr( 'class', 'arc' )
      .attr( 'transform', 'translate(' + App.ui.width / 2 + ',' + App.ui.height / 2 + ')' )
      .append( 'path' )
        .attr( 'd', arc );
        // .transition().duration( 1000 )
        // .attrTween( 'd', App.ui.d3.tweenArc( { value : twoPi } ) );

  }; // end App.ui.createView()

  /**
   * Helper method to update the text in #statusbar.
   *
   * @param   {String}  status  The text to display.
   * @param   {String}  type    The type of status.
   */
  App.ui.updateStatusBar = function( status, type ) {
    var status = typeof status === 'undefined' ? ''       : status;
    var type   = typeof type   === 'undefined' ? 'notice' : type;

    if ( type === 'error' )
      console.error('Status updated: ' + status);
    else
      console.log('Status updated: ' + status);
  }; // end App.ui.updateStatusBar()


  /*
   * Show an error on the screen.
   *
   * @param   String  errorString   The error to display if one is received.
   * @return  void
   */
  App.ui.browserNotSupported = function( e ) {
    e = typeof e === 'string' ? e : 'Your browser is not supported.';
    App.ui.updateStatusBar( e, 'error' );
  }; // end App.ui.browserNotSupported()
})();
