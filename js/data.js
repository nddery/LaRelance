//
// data.js
//
// This file is responsible of the IndexedDB database.
// Importing all the rows and setting up indexes.
// It is also with this class that we get data out.
//
(function(){
  App.data = {};

  App.data.fileLoaded = 0;
  // These will hold the data for each store.
  App.data.objectstores = [
    { name: 'UNIVERSITIES',
      keyPath: 'UID',
      autoIncrement: false,
      data_source: 'http://mysites.dev/nddery.ca_www/larelance/data/universite.json' },

    { name: 'PROGRAMS',
      keyPath: 'PID',
      autoIncrement: false,
      data_source: 'http://mysites.dev/nddery.ca_www/larelance/data/programmes.json' },

    { name: 'DATA',
      keyPath: 'id',
      autoIncrement: true,
      data_source: 'http://mysites.dev/nddery.ca_www/larelance/data/donnees.json' },
  ];

  // Some information pertaining to the DB.
  App.data.indexedDB    = {};
  App.data.indexedDB.db = null
  App.data.DB_NAME      = 'test01';
  App.data.DB_VERSION   = 78;

  /**
   * This is the entry point for the database system.
   * Either open or create the database and if need be, retrieve the data and
   * add it to the database.
   *
   */
  App.data.init = function() {
    console.log('---------');
    App.ui.updateStatusBar( 'Initializing database...' );
    App.data.indexedDB.open();
  }; // end App.data.init()


  /**
   * Attempt to open the database.
   * If the version has changed, deleted known object stores and re-create them.
   * We'll add the data later.
   *
   */
  App.data.indexedDB.open = function() {
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
          App.ui.updateStatusBar( 'Deleting ' + o.name + ' object store...' );
          db.deleteObjectStore( o.name );
        }

        App.ui.updateStatusBar( 'Creating ' + o.name + ' object store...' );
        var store = db.createObjectStore(
          o.name,
          { keyPath: o.keyPath, autoIncrement: o.autoIncrement }
        );

        console.log('+++ Addind data');
        App.data.indexedDB.addDataFromUrl( o.name, o.data_source );
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
   */
  App.data.retrieveAllUniversities = function(){
    var objectStore = App.data.indexedDB.db.transaction("UNIVERSITIES").objectStore("UNIVERSITIES");
    var universities = [];
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        universities.push(cursor.value);
        cursor.continue();
      }
      else {
        console.log(universities);
      }
    };
    return universities;
  }


  App.data.indexedDB.addDataFromUrl = function( store, url ) {
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', url, true );
    // http://www.w3.org/TR/XMLHttpRequest2/#the-response-attribute
    // xhr.responseType = 'blob';
    xhr.onload = function( event ) {
      if( xhr.status == 200 ) {
        console.log('*** XHR successful');
        var json = JSON.parse( xhr.response );

        json.forEach( function( o, i ){
          App.data.indexedDB.addItem( store, o );
        });
      }
      else{
        console.error("addDataFromUrl error:", xhr.responseText, xhr.status);
      }
    };
    xhr.send();
  }; // end App.data.indexedDB.addDataFromUrl()


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
    console.log(e);
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
