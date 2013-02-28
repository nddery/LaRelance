// http://stackoverflow.com/a/13782311
// http://jsfiddle.net/BinaryMuse/aSjwk/2/
app.directive('backImg', function(){
  return function(scope, element, attrs){
    attrs.$observe('backImg', function(value) {
      element.css({
        'background-image': 'url(' + value +')',
        'background-size' : 'cover'
      });
    });
  };
});
