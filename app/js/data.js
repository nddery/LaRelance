//
// data.js
//
// This file is responsible of the IndexedDB database.
// Importing all the rows and setting up indexes.
// It is also with this class that we get data out.
//
(function(){
  App.data = {};

  App.data.filesLoaded = 0;
  App.data.filesToLoad = 0;
  // These will hold the data for each store.
  App.data.objectstores = [
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
  // App.data.objectstores = [
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
  App.data.indexedDB    = {};
  App.data.indexedDB.db = null
  App.data.DB_NAME      = 'test02';
  App.data.DB_VERSION   = 3;

  /**
   * This is the entry point for the database system.
   * Either open or create the database and if need be, retrieve the data and
   * add it to the database.
   *
   */
  App.data.init = function() {
    console.log('---------');
    App.ui.updateStatusBar( 'Initializing...' );
    // Pre-fetch all data to avoid DOM IDBDatabase Exception 11 and all.
    App.data.filesToLoad = App.data.objectstores.length;
    App.data.preFetchAll();
  }; // end App.data.init()


  /**
   * Pre-fetch all data.
   *
   * @param   {function}  cb  Function to callback when everything is done.
   * @return  void
   */
  App.data.preFetchAll = function() {
    App.ui.updateStatusBar( 'Fetching data...' );

    App.data.objectstores.forEach( function( o ) {
      App.ui.updateStatusBar( 'Fetching data for ' + o.name +'...' );
      var data = App.data.fetchDataFromURL( o );
    });
  } // end App.data.preFetchAll()


  /**
   * Fetch content from a file and add it to an object 'data' property.
   *
   * @param   {Object}  o   Object containing a 'data_source' attribute.
   * @return   void
   */
  App.data.fetchDataFromURL = function( o ) {
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', o.data_source, true );
    xhr.onload = function( event ) {
      if( xhr.status == 200 ) {
        console.log('*** XHR successful');
        o.data = JSON.parse( xhr.response );
        App.data.dataFetched();
        // json.forEach( function( o, i ){
        //   App.data.indexedDB.addItem( store, o );
        // });
      }
      else{
        console.error("fetchDataFromURL error:", xhr.responseText, xhr.status);
      }
    };
    xhr.send();
  }; // end App.data.fetchDataFromURL()


  /**
   * This method is called every time we successfully fetched a file content.
   * When we have fetched all files, open the database.
   *
   * @return  void
   */
  App.data.dataFetched = function() {
    App.data.filesLoaded++;
    console.log('FILES LOADED: ' + App.data.filesLoaded + "\t\tFILES TO LOAD: " + App.data.filesToLoad );
    if ( App.data.filesLoaded === App.data.filesToLoad )
      App.data.indexedDB.open();
  } // end App.data.dataFetched()


  /**
   * Attempt to open the database.
   * If the version has changed, deleted known object stores and re-create them.
   * If we are re-creating the stores, also add the data.
   *
   */
  App.data.indexedDB.open = function() {
    App.ui.updateStatusBar( 'Initializing database...' );

    // Everything is done through requests and transactions.
    var request = window.indexedDB.open( App.data.DB_NAME, App.data.DB_VERSION );

    // We can only create Object stores in a onupgradeneeded transaction.
    request.onupgradeneeded = function( e ) {
      App.ui.updateStatusBar( 'Database update required...' );
      App.data.indexedDB.db = e.target.result;
      var db = App.data.indexedDB.db;

      // Not sure what this does here... Transaction here ?
      e.target.transaction.onerror = App.data.indexedDB.onerror;

      // Delete all object stores not to create confusion.
      App.ui.updateStatusBar( 'Updating database schema...' );
      App.data.objectstores.forEach( function( o ) {
        if ( db.objectStoreNames.contains( o.name ) ) {
          App.ui.updateStatusBar( 'Deleting the ' + o.name + ' object store...' );
          db.deleteObjectStore( o.name );
        }

        App.ui.updateStatusBar( 'Creating the ' + o.name + ' object store...' );
        var store = db.createObjectStore(
          o.name,
          { keyPath: o.keyPath, autoIncrement: o.autoIncrement }
        );

        App.ui.updateStatusBar( 'Adding data in the ' + o.name + ' object store...' );
        o.data.forEach( function( json, i ) {
          var request = store.add( json );
          request.onsuccess = function ( event ) { /* success, continue */ };
          request.onerror = App.data.indexedDB.onerror;
        });
      });
    }; // end request.onupgradeneeded()

    request.onsuccess = function( e ) {
      App.data.indexedDB.db = e.target.result;
      App.ui.updateStatusBar( 'Database initialized...' );
      App.ui.updateStatusBar( 'Initializing UI...' );
      App.ui.init();
    }; // end request.onsuccess()

    request.onerror = App.data.indexedDB.onerror;
  }; // end App.data.indexedDB.open()


  /**
   * Retrieves all Universities.
   *
   * @param   {function}  cb  The callback method.
   */
  App.data.retrieveAllUniversities = function( cb ){
    var objectStore = App.data.indexedDB.db.transaction("UNIVERSITIES").objectStore("UNIVERSITIES");
    var universities = [];
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        universities.push(cursor.value);
        cursor.continue();
      }
      else {
        cb( universities );
        // return universities;
        console.log(universities);
      }
    };
  }


  App.data.indexedDB.addItem = function( store, item ) {
    var store = App.data.indexedDB.getObjectStore( store, 'readwrite' );
    var req;
    try{
      req = store.add( item );
    }
    catch( e ){
      if( e.name == 'DataCloneError' )
        App.ui.updateStatusBar( "This engine doesn't know how to clone a Blob, " + "use Firefox" );
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
  }; // end App.data.indexedDB.addItem()


  /**
   * Handle all IndexedDB related errors.
   *
   */
  App.data.indexedDB.onerror = function( e ) {
    App.ui.updateStatusBar( e, 'error' );
  }; // end App.data.indexedDB.onerror()


  /**
   * Helper method to retrieve an object store from the currently opened DB
   *
   * @param   {string}  store   The name of the object store to retrieve.
   * @param   {string}  mode    Either 'readonly' or 'readwrite'.
   */
  App.data.indexedDB.getObjectStore = function( store, mode ) {
    var trn = App.data.indexedDB.db.transaction( store, mode );

    console.log('TRN');
    console.log(trn);

    trn.onsuccess = function( evt ) {
      console.log("transaction ok");
    }
    // trn.onerror = App.data.indexedDB.onerror();
    trn.onerror = function ( e ) {
      console.log(e);
    }

    return trn.objectStore( store );
  }; // end App.data.indexedDB.getObjectStore()


  /**
   * Helper method to delete all object in an object store.
   *
   * @param   {string}  store   The name of the object store.
   */
  App.data.indexedDB.clearObjectStore = function( store ) {
    var store = App.data.indexedDB.getObjectStore( store, 'readwrite' );
    var req   = store.clear();
    req.onsuccess = function( event ) {
      App.ui.updateStatusBar( store + ' successfully cleared...' );
    }
    req.onerror = App.data.indexedDB.onerror;
  }; // end App.data.indexedDB.clearObjectStore()
})();
