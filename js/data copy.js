//
// data.js
//
// This file is responsible of the IndexedDB database.
// Importing all the rows and setting up indexes.
// It is also with this class that we get data out.
//
(function(){
  App.data = {};

  // These will hold the data for each store.
  App.data.store = {};
  App.data.store.universite = {};
  App.data.store.programmes = {};
  App.data.store.donnees = {};

  // Keep count of the number of files retrieved.
  App.data.filesRetrieved = 0;

  // Some information pertaining to the DB.
  App.data.DB_NAME    = 'LaRelance';
  App.data.DB_VERSION = 12;
  App.data.db;

  App.data.init = function( dbName ) {
    // Let's initialize an IndexedDB instance.
    // https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB
    var indexedDB      = window.indexedDB;
    var IDBTransaction = window.IDBTransaction;
    var IDBKeyRange    = window.IDBKeyRange;

    if ( ! indexedDB ) {
      // Browser with experimental version of IndexedDB DO pass this test.
      App.ui.browserNotSupported();

      // @TODO Test for experimental version and warn user.
    }
    else {
      // Open up the database, version 1.
      // The open() method returns an IDBOpenDBRequest object,
      // to handle below.
      App.ui.updateStatusBar( 'Opening the database.' );
      var request = indexedDB.open( App.data.DB_NAME, App.data.DB_VERSION );

      //
      // Request handler for opening the database object.
      //
      request.onerror = function( event ) {
        console.log( event );
        App.ui.browserNotSupported( event.target.errorCode );
      };

      request.onsuccess = function( event ) {
        App.ui.updateStatusBar( 'Database opened successfully!' );
        App.data.db = request.result;


        var store = request.result.transaction( App.data.DB_NAME ).objectStore( 'universite');

        store.openCursor().onsuccess = function( event ) {
          var cursor = event.target.result;
          if ( cursor ) {
            alert("Name for SSN " + cursor.key + " is " + cursor.value.UNAME);
            cursor.continue();
          }
          else {
            alert("No more entries!");
          }
        };
      };

      // Here we upgrade (or create) DB entries.
      request.onupgradeneeded = function( event ) {
        App.ui.updateStatusBar( 'Currently adding data to the database.' );

        App.data.db = event.target.result;

        // It is impossible to update an existing object store,
        // so delete it if it exist.
        if( App.data.db.objectStoreNames.contains( 'universite' ) )
          App.data.db.deleteObjectStore( 'universite' );
        if( App.data.db.objectStoreNames.contains( 'programmes' ) )
          App.data.db.deleteObjectStore( 'programmes' );
        if( App.data.db.objectStoreNames.contains( 'donnees' ) )
          App.data.db.deleteObjectStore( 'donnees' );


        // Create the object stores
        var store = App.data.db.createObjectStore(
          'universite',
          { keyPath: 'UID' }
        );
        // Store each object in the object store.
        for ( var o in App.data.store.universite ) {
          store.add( App.data.store.universite[ o ] );
        }

        // Create the object stores
        store = App.data.db.createObjectStore(
          'programmes',
          { keyPath: 'PID' }
        );
        // Store each object in the object store.
        for ( var o in App.data.store.programmes ) {
          store.add( App.data.store.programmes[ o ] );
        }

        // // Create the object stores
        // var store = App.data.db.createObjectStore(
        //   'universite',
        //   { keyPath: 'UID' }
        // );
        // // Store each object in the object store.
        // for ( var o in App.data.store.universite ) {
        //   objectStore.add( App.data.store.universite[ o ] );
        // }
      };
    }
  };


  /**
   * Each time a file is retrieve, this method is called.
   * We know we need to retrieve three files, after 3 times this
   * method is called, call the init on the DB
   *
   */
  App.data.fileHasBeenRetrieved = function() {
    App.data.filesRetrieved += 1;
    console.log(App.data.filesRetrieved);

    if ( App.data.filesRetrieved === 3 )
      App.data.init();
  };


  /*
   * Given a file name, this method will return the file content.
   * Used to retrieve JSON data for each object store.
   *
   * @param   Var     dest      Destination of the retrieved data.
   * @param   String  file      The file the retrieve.
   */
  App.data.retrieveData = function( dest, url ) {
        console.log(dest);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    // http://www.w3.org/TR/XMLHttpRequest2/#the-response-attribute
    xhr.responseType = 'blob';
    xhr.onload = function ( event ) {
      if (xhr.status == 200) {
        console.log(xhr.status);
        console.log(dest);
        dest = xhr.response;
        App.data.fileHasBeenRetrieved();
      }
      else {
        App.ui.updateStatusBar( 'Failed to retrieve data.' );
        console.log(xhr.responseText + ' (' + xhr.status + ')');
      }
    };
    xhr.send();
  };
})();
