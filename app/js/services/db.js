app.service('db', function() {
  var objectstores = [
    { name: 'UNIVERSITIES',
      keyPath: 'UID',
      autoIncrement: false,
      data_source: 'http://proj.nddery.dev/larelance/app/data/universite.json',
      data: '' },

    { name: 'PROGRAMS',
      keyPath: 'PID',
      autoIncrement: false,
      data_source: 'http://proj.nddery.dev/larelance/app/data/programmes.json',
      data: '' },

    { name: 'DATA',
      keyPath: 'id',
      autoIncrement: true,
      data_source: 'http://proj.nddery.dev/larelance/app/data/donnees.json',
      data: '' },
  ];

  // data.objectstores = [
  //   { name: 'UNIVERSITIES',
  //     keyPath: 'UID',
  //     autoIncrement: false,
  //     data_source: 'http://proj.nddery.ca/larelance/data/universite.json',
  //     data: '' },

  //   { name: 'PROGRAMS',
  //     keyPath: 'PID',
  //     autoIncrement: false,
  //     data_source: 'http://proj.nddery.ca/larelance/data/programmes.json',
  //     data: '' },
  //   { name: 'DATA',
  //     keyPath: 'id',
  //     autoIncrement: true,
  //     data_source: 'http://proj.nddery.ca/larelance/data/donnees.json',
  //     data: '' },
  // ];

  var filesLoaded = 0,
      filesToLoad = objectstores.length,
      db          = null,
      DB_NAME     = 'larelance',
      DB_VERSION  = 1;

  /**
   * Pre-fetch all data.
   *
   * @param   {function}  cb  Function to callback when everything is done.
   * @return  void
   */
  var preFetchAll = function() {
    updateStatusBar( 'Fetching data...' );

    objectstores.forEach( function( o ) {
      updateStatusBar( 'Fetching data for ' + o.name +'...' );
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
    updateStatusBar( 'Initializing database...' );

    // Everything is done through requests and transactions.
    var request = window.indexedDB.open( DB_NAME, DB_VERSION );

    // We can only create Object stores in a onupgradeneeded transaction.
    request.onupgradeneeded = function( e ) {
      updateStatusBar( 'Database update required...' );
      db = e.target.result;

      e.target.transaction.onerror = handleError;

      // Delete all object stores not to create confusion.
      updateStatusBar( 'Updating database schema...' );
      objectstores.forEach( function( o ) {
        if ( db.objectStoreNames.contains( o.name ) ) {
          updateStatusBar( 'Deleting the ' + o.name + ' object store...' );
          db.deleteObjectStore( o.name );
        }

        updateStatusBar( 'Creating the ' + o.name + ' object store...' );
        var store = db.createObjectStore(
          o.name,
          { keyPath: o.keyPath, autoIncrement: o.autoIncrement }
        );

        updateStatusBar( 'Adding data in the ' + o.name + ' object store...' );
        o.data.forEach( function( json, i ) {
          var request = store.add( json );
          request.onsuccess = function ( event ) { /* success, continue */ };
          request.onerror = handleError;
        });
      });
    }; // end request.onupgradeneeded()

    request.onsuccess = function( e ) {
      db = e.target.result;
      updateStatusBar( 'Database initialized...' );
    }; // end request.onsuccess()

    request.onerror = handleError;
  }; // end open()


  /**
   * Insert an item in an object store.
   *
   * @param   {Object}  store   The object store
   * @param   {Object}  item    The item to add
   */
  insertItem = function( store, item ) {
    var store = getObjectStore( store, 'readwrite' );
    var req;
    try{
      req = store.add( item );
    }
    catch( e ){
      if( e.name == 'DataCloneError' )
        updateStatusBar( "This engine doesn't know how to clone a Blob, " + "use Firefox" );
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
      // displayActionSuccess();
      // displayPubList(store);
    };
    req.onerror = function() {
      console.error("addPublication error", this.error);
    };
  }; // end insertItem()


  /**
   * Helper method to retrieve an object store from the currently opened DB
   *
   * @param   {string}  store   The name of the object store to retrieve.
   * @param   {string}  mode    Either 'readonly' or 'readwrite'.
   */
  getObjectStore = function( store, mode ) {
    var trn = db.transaction( store, mode );

    console.log('TRN');
    console.log(trn);

    trn.onsuccess = function( evt ) {
      console.log("transaction ok");
    }
    trn.onerror = function ( e ) {
      console.log(e);
    }

    return trn.objectStore( store );
  }; // end getObjectStore()


  /**
   * Handle all IndexedDB related errors.
   *
   */
  handleError = function( e ) {
    updateStatusBar( e, 'error' );
  }; // end handleError()


  /**
   * Helper method to update the text in #statusbar.
   *
   * @param   {String}  status  The text to display.
   * @param   {String}  type    The type of status.
   */
  var updateStatusBar = function( status, type ) {
    var status = typeof status === 'undefined' ? ''       : status;
    var type   = typeof type   === 'undefined' ? 'notice' : type;

    if ( type === 'error' )
      console.error('Status updated: ' + status);
    else
      console.log('Status updated: ' + status);
  }

  preFetchAll();

  return {
    retrieveAllUniversities: function( cb ){
      var objectStore = db.transaction("UNIVERSITIES").objectStore("UNIVERSITIES");
      var universities = [];
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          universities.push(cursor.value);
          cursor.continue();
        }
        else {
          cb( universities );
          // console.log(universities);
          // return universities;
        }
      };
    },

    fetchAll: function(controller){
    }
    // Add all methods to be used here.
  };
});
