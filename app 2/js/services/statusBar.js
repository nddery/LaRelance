angular.module('app')
.service('statusBar', function() {
  return {
    update : function(status, type){
      var status = typeof status === 'undefined' ? ''       : status;
      var type   = typeof type   === 'undefined' ? 'notice' : type;

      if ( type === 'error' ) {
        console.error('Error: ' + status);
        console.log(status);
      }
      else {
        console.log('Status updated: ' + status);
      }
    }
  };
});
