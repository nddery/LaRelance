//
// ui.js
//
// This file is responsible of the rendering the UI.
//
(function(){
  // This is the first file included, define App.
  App = {};
  App.ui = {};
  App.ui.init = function() {
    console.log('init the ui');
  };

  App.ui.updateStatusBar = function( status ) {
    console.log('Status updated: ' + status);
  }


  /*
   * Show an error on the screen.
   *
   * @param   String  errorString   The error to display if one is received.
   * @return  void
   */
  App.ui.browserNotSupported = function( e ) {
    e = typeof e == 'string' ? e : 'Your browser is not supported.';
    App.ui.updateStatusBar( e );
    console.log( e );
  };
})();
