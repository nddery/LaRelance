(function(){
  // Retrieve the content of the database.
  App.data.retrieveData(
    App.data.store.universite,
    'http://mysites.dev/nddery.ca_www/larelance/data/universite.json'
  );

  App.data.retrieveData(
    App.data.store.programmes,
    'http://mysites.dev/nddery.ca_www/larelance/data/programmes.json'
  );

  App.data.retrieveData(
    App.data.store.donnees,
    'http://mysites.dev/nddery.ca_www/larelance/data/donnees.json'
  );
})();
