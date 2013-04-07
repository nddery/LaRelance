angular.module('app')
.service('debounce', function() {
  return {
    debounce: function( func , timeout ) {
      var timeoutID , timeout = timeout || 100;
        return function () {
        var scope = this , args = arguments;
        clearTimeout( timeoutID );
        timeoutID = setTimeout( function () {
          func.apply( scope , Array.prototype.slice.call( args ) );
        } , timeout );
      }
    }
  };
});
