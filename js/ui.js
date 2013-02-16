//
// ui.js
//
// This file is responsible of the rendering the UI.
//
(function(){
  // This is the first file included, define App.
  App = {};
  App.ui = {};
  App.ui.d3 = {};

  App.ui.svg    = d3.select( 'svg' );
  App.ui.width  = window.innerWidth;
  App.ui.height = window.innerHeight;

  App.ui.init = function() {
    // Set the width and height.
    App.ui.svg.attr( 'width',  App.ui.width )
              .attr( 'height', App.ui.height );

    var universities = App.data.retrieveAllUniversities(),
        t = universities.length;

    universities.forEach( function( o, i ) {
      App.ui.createBubble( o, i, t );
    });

    App.ui.test( universities );
  }; // end App.ui.init()


  /**
   * Draw a "bubble" (node) on the screen.
   *
   * @param   {Object}  o   The object to draw.
   * @param   {int}     i   The current object.
   * @param   {int}     t   The total # of object to draw.
   */
  App.ui.createBubble = function( o, i, t ) {
    //
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
