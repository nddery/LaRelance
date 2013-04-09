angular.module('app')
.service('idbInit', ['$rootScope', 'statusBar', function($rootScope, statusBar) {
  var objectstores = [
    { name: 'LARELANCE',
      keyPath: 'id',
      indexes: ['UNIQ', 'UID', 'PID', 'TYPE'],
      autoIncrement: true,
      data_source: 'http://proj.nddery.dev/la-relance/app/data/larelance.json',
      data: '' }
  ];

  var indexedDB   = window.indexedDB,
      filesLoaded = 0,
      filesToLoad = objectstores.length,
      db          = null,
      DB_NAME     = 'larelance-test',
      DB_VERSION  = 136;

  if ( ! indexedDB ) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. Latest version of Chrome and Firefox will work.");
  }

  /**
   * Pre-fetch all data.
   *
   * @param   {function}  cb  Function to callback when everything is done.
   * @return  void
   */
  var preFetchAll = function() {
    statusBar.update( 'fetching data' );

    objectstores.forEach( function( o ) {
      statusBar.update( 'fetching data for ' + o.name );
      var data = fetchDataFromURL( o );
    });
  }; // end preFetchAll()


  /**
   * Fetch content from a file and add it to an object 'data' property.
   *
   * @param   {Object}  o   Object containing a 'data_source' attribute.
   * @return   void
   */
  var fetchDataFromURL = function( o ) {
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', o.data_source, true );
    xhr.onload = function( event ) {
      if( xhr.status == 200 ) {
        console.log('*** XHR successful');
        o.data = JSON.parse( xhr.response );
        dataFetched();
      }
      else{
        console.error("fetchDataFromURL error:", xhr.responseText, xhr.status);
      }
    };
    xhr.send();
  }; // end fetchDataFromURL()


  /**
   * This method is called every time we successfully fetched a file content.
   * When we have fetched all files, open the database.
   *
   * @return  void
   */
  var dataFetched = function() {
    filesLoaded++;
    console.log('FILES LOADED: ' + filesLoaded + "\t\tFILES TO LOAD: " + filesToLoad );
    if ( filesLoaded === filesToLoad )
      openDatabase();
  } // end data.dataFetched()

  /**
   * Attempt to open the database.
   * If the version has changed, deleted known object stores and re-create them.
   * If we are re-creating the stores, also add the data.
   *
   */
  var openDatabase = function() {
    statusBar.update( 'initializing database' );

    // Everything is done through requests and transactions.
    var request = window.indexedDB.open( DB_NAME, DB_VERSION );

    // We can only create Object stores in a onupgradeneeded transaction.
    request.onupgradeneeded = function( e ) {
      statusBar.update( 'database update required' );
      db = e.target.result;

      e.target.transaction.onerror = handleError;

      // Delete all object stores not to create confusion.
      statusBar.update( 'updating database schema' );
      objectstores.forEach( function( o ) {
        if ( db.objectStoreNames.contains( o.name ) ) {
          statusBar.update( 'Deleting the ' + o.name + ' object store' );
          db.deleteObjectStore( o.name );
        }

        statusBar.update( 'Creating the ' + o.name + ' object store' );
        var store = db.createObjectStore(
          o.name,
          { keyPath: o.keyPath, autoIncrement: o.autoIncrement }
        );

        // And add index on the keyPath
        o.indexes.forEach(function(index){
          store.createIndex(index, index, { unique: false });
        });

        statusBar.update( 'Adding data in the ' + o.name + ' object store' );
        o.data.forEach( function( json, i ) {
          var request = store.add( json );
          request.onsuccess = function ( event ) { /* success, continue */ };
          request.onerror = handleError;
        });
        o.data = null;
      });
    }; // end request.onupgradeneeded()

    request.onsuccess = function( e ) {
      db = e.target.result;
      statusBar.update( 'Database initialized' );
      $rootScope.$broadcast('idbInitialized');
    }; // end request.onsuccess()

    request.onerror = handleError;
  }; // end open()


  /**
   * Handle all IndexedDB related errors.
   *
   */
  handleError = function( e ) {
    statusBar.update( e, 'error' );
  }; // end handleError()


  // Start pre-fetching.
  preFetchAll();

  return {
    indexedDB: indexedDB,
    DB_NAME: DB_NAME,
    DB_VERSION: DB_VERSION,
    U: {},
    P: {}
  };
}]);
