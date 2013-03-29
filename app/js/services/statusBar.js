angular.module('app')
.service('statusBar', ['$rootScope', function($rootScope) {
  var statusBar = {
    status : '',
    type   : '',
    update : function(s, t){
      statusBar.status = typeof s === 'undefined' ? ''       : s;
      statusBar.type   = typeof t === 'undefined' ? 'notice' : t;
      $rootScope.$broadcast('statusUpdated');

      if ( t === 'error' ) {
        console.error('Error: ' + statusBar.status);
        console.log(statusBar.status);
      }
      else {
        console.log('Status updated: ' + statusBar.status);
      }
    }
  };

  return statusBar;
}]);
