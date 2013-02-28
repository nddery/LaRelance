//
// data.js
//
// This file is responsible of the IndexedDB database.
// Importing all the rows and setting up indexes.
// It is also with this class that we get data out.
//
(function(){
  data = {};
  data.filesLoaded = 0;
  data.filesToLoad = 0;
  // These will hold the data for each store.
  data.objectstores = [
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

  // Some information pertaining to the DB.
  data.indexedDB    = {};
  data.indexedDB.db = null
  data.DB_NAME      = 'test02';
  data.DB_VERSION   = 3;

  /**
   * This is the entry point for the database system.
   * Either open or create the database and if need be, retrieve the data and
   * add it to the database.
   *
   */
  data.init = function() {
    console.log('---------');
    data.updateStatusBar( 'Initializing...' );
    // Pre-fetch all data to avoid DOM IDBDatabase Exception 11 and all.
    data.filesToLoad = data.objectstores.length;
    data.preFetchAll();
  }; // end data.init()


  /**
   * Pre-fetch all data.
   *
   * @param   {function}  cb  Function to callback when everything is done.
   * @return  void
   */
  data.preFetchAll = function() {
    data.updateStatusBar( 'Fetching data...' );

    data.objectstores.forEach( function( o ) {
      // data.updateStatusBar( 'Fetching data for ' + o.name +'...' );
      var data = data.fetchDataFromURL( o );
    });
  } // end data.preFetchAll()


  /**
   * Fetch content from a file and add it to an object 'data' property.
   *
   * @param   {Object}  o   Object containing a 'data_source' attribute.
   * @return   void
   */
  data.fetchDataFromURL = function( o ) {
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', o.data_source, true );
    xhr.onload = function( event ) {
      if( xhr.status == 200 ) {
        console.log('*** XHR successful');
        o.data = JSON.parse( xhr.response );
        data.dataFetched();
        // json.forEach( function( o, i ){
        //   data.indexedDB.addItem( store, o );
        // });
      }
      else{
        console.error("fetchDataFromURL error:", xhr.responseText, xhr.status);
      }
    };
    xhr.send();
  }; // end data.fetchDataFromURL()


  /**
   * This method is called every time we successfully fetched a file content.
   * When we have fetched all files, open the database.
   *
   * @return  void
   */
  data.dataFetched = function() {
    data.filesLoaded++;
    console.log('FILES LOADED: ' + data.filesLoaded + "\t\tFILES TO LOAD: " + data.filesToLoad );
    if ( data.filesLoaded === data.filesToLoad )
      data.indexedDB.open();
  } // end data.dataFetched()


  /**
   * Attempt to open the database.
   * If the version has changed, deleted known object stores and re-create them.
   * If we are re-creating the stores, also add the data.
   *
   */
  data.indexedDB.open = function() {
    data.updateStatusBar( 'Initializing database...' );

    // Everything is done through requests and transactions.
    var request = window.indexedDB.open( data.DB_NAME, data.DB_VERSION );

    // We can only create Object stores in a onupgradeneeded transaction.
    request.onupgradeneeded = function( e ) {
      data.updateStatusBar( 'Database update required...' );
      data.indexedDB.db = e.target.result;
      var db = data.indexedDB.db;

      // Not sure what this does here... Transaction here ?
      e.target.transaction.onerror = data.indexedDB.onerror;

      // Delete all object stores not to create confusion.
      data.updateStatusBar( 'Updating database schema...' );
      data.objectstores.forEach( function( o ) {
        if ( db.objectStoreNames.contains( o.name ) ) {
          data.updateStatusBar( 'Deleting the ' + o.name + ' object store...' );
          db.deleteObjectStore( o.name );
        }

        data.updateStatusBar( 'Creating the ' + o.name + ' object store...' );
        var store = db.createObjectStore(
          o.name,
          { keyPath: o.keyPath, autoIncrement: o.autoIncrement }
        );

        data.updateStatusBar( 'Adding data in the ' + o.name + ' object store...' );
        o.data.forEach( function( json, i ) {
          var request = store.add( json );
          request.onsuccess = function ( event ) { /* success, continue */ };
          request.onerror = data.indexedDB.onerror;
        });
      });
    }; // end request.onupgradeneeded()

    request.onsuccess = function( e ) {
      data.indexedDB.db = e.target.result;
      data.updateStatusBar( 'Database initialized...' );
      data.updateStatusBar( 'Initializing UI...' );
      data.init();
    }; // end request.onsuccess()

    request.onerror = data.indexedDB.onerror;
  }; // end data.indexedDB.open()


  /**
   * Retrieves all Universities.
   *
   * @param   {function}  cb  The callback method.
   */
  data.retrieveAllUniversities = function( cb ){
    var objectStore = data.indexedDB.db.transaction("UNIVERSITIES").objectStore("UNIVERSITIES");
    var universities = [];
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        universities.push(cursor.value);
        cursor.continue();
      }
      else {
        // cb( universities );
        return universities;
        console.log(universities);
      }
    };
  }


  data.indexedDB.addItem = function( store, item ) {
    var store = data.indexedDB.getObjectStore( store, 'readwrite' );
    var req;
    try{
      req = store.add( item );
    }
    catch( e ){
      if( e.name == 'DataCloneError' )
        data.updateStatusBar( "This engine doesn't know how to clone a Blob, " + "use Firefox" );
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
  }; // end data.indexedDB.addItem()


  /**
   * Handle all IndexedDB related errors.
   *
   */
  data.indexedDB.onerror = function( e ) {
    data.updateStatusBar( e, 'error' );
  }; // end data.indexedDB.onerror()


  /**
   * Helper method to retrieve an object store from the currently opened DB
   *
   * @param   {string}  store   The name of the object store to retrieve.
   * @param   {string}  mode    Either 'readonly' or 'readwrite'.
   */
  data.indexedDB.getObjectStore = function( store, mode ) {
    var trn = data.indexedDB.db.transaction( store, mode );

    console.log('TRN');
    console.log(trn);

    trn.onsuccess = function( evt ) {
      console.log("transaction ok");
    }
    // trn.onerror = data.indexedDB.onerror();
    trn.onerror = function ( e ) {
      console.log(e);
    }

    return trn.objectStore( store );
  }; // end data.indexedDB.getObjectStore()


  /**
   * Helper method to delete all object in an object store.
   *
   * @param   {string}  store   The name of the object store.
   */
  data.indexedDB.clearObjectStore = function( store ) {
    var store = data.indexedDB.getObjectStore( store, 'readwrite' );
    var req   = store.clear();
    req.onsuccess = function( event ) {
      data.updateStatusBar( store + ' successfully cleared...' );
    }
    req.onerror = data.indexedDB.onerror;
  }; // end data.indexedDB.clearObjectStore()

  /**
   * Helper method to update the text in #statusbar.
   *
   * @param   {String}  status  The text to display.
   * @param   {String}  type    The type of status.
   */
  data.updateStatusBar = function( status, type ) {
    var status = typeof status === 'undefined' ? ''       : status;
    var type   = typeof type   === 'undefined' ? 'notice' : type;

    if ( type === 'error' )
      console.error('Status updated: ' + status);
    else
      console.log('Status updated: ' + status);
  }; // end data.updateStatusBar()
})();
