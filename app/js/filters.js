/**
 * Filter that only returns programs that has currently selected universities.
 *
 */
app.filter('selectedUniversities', ['idb', 'bucket', function (idb, bucket) {
  return function (items) {
    bucket.U = [];
    angular.forEach(idb.U, function(value,key){
      if(value.checked)
        bucket.U.push(value.data.UID);
    });

    // Bail out early if no universities selected, do no filter.
    if(bucket.U.length === 0)
      return items;

    // Start filtering for each selected universities.
    var filtered = $.extend({}, idb.P);
    angular.forEach(bucket.U, function(value,key){
      angular.forEach(filtered, function(value2,key2){
        // If programs does not belong to one of the chosen universities.
        if(value2.universities.indexOf(value) === -1){
          delete filtered[key2];
        }
      });
    });

    return filtered;
  };
}]);


/**
 * Filter that only returns universities that has currently selected programs.
 *
 */
app.filter('selectedPrograms', ['idb', 'bucket', function (idb, bucket) {
  return function (items) {
    bucket.P = [];
    angular.forEach(idb.P, function(value,key){
      if(value.checked)
        bucket.P.push(value.data.PID);
    });

    // Bail out early if no universities selected, do no filter.
    if(bucket.P.length === 0)
      return items;

    // Start filtering for each selected universities.
    var filtered = $.extend({}, idb.U);
    angular.forEach(bucket.P, function(value,key){
      angular.forEach(filtered, function(value2,key2){
        // If programs does not belong to one of the chosen programs.
        if(value2.programs.indexOf(value) === -1){
          delete filtered[key2];
        }
      });
    });

    return filtered;
  };
}]);
