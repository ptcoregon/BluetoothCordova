
  var WalksTable, store, syncContext, client;

  function startAzure(){
    alert("Starting Azure");
    //code from https://shellmonger.com/tag/azure-mobile-apps/
    // Create a reference to the Azure App Service
    // WindowsAzure = require('azure-mobile-apps-client');
    client = new WindowsAzure.MobileServiceClient('https://walksmart1.azurewebsites.net');

    store = new WindowsAzure.MobileServiceSqliteStore('store.db');

    store.defineTable({
      name: 'Walks',
      columnDefinitions: {
          id: 'string',
          ModuleID: 'int',
          Distance: 'int',
          Duration: 'int',
          deleted: 'boolean',
          Date: 'date'
      }
    }).then(function () {
          // Initialize the sync context
          alert("getting sync context");
          syncContext = client.getSyncContext();
          syncContext.pushHandler = {
              onConflict: function (serverRecord, clientRecord, pushError) {
                  window.alert('Push Conflict: ' + pushError.getError());
                  alert('ServerRecord: ModuleID=' + serverRecord.ModuleID);
                  alert('ClientRecord: ' + clientRecord);
              },
              onError: function(pushError) {
                  window.alert('Push Error: ' + pushError);
              }
          };
          return syncContext.initialize(store);
      }).then(function () {
          // I can now get a reference to the table
          alert("Getting WalksTable from client");
          WalksTable = client.getSyncTable('Walks');

          //refreshData();
          addData();

          // $('#add-item').submit(addItemHandler);
          // $('#refresh').on('click', refreshData);
      });

  }

  function refreshData() {
    //code from https://shellmonger.com/tag/azure-mobile-apps/
    alert('Loading data from Azure');
    syncContext.push().then(function () {
        var query = new WindowsAzure.Query('Walks').where({ 'ModuleID': 100 });
        return syncContext.pull(query);
    }).then(function () {
      alert("success refresh");
        // alert("Read Local Table");
        // WalksTable
        //     .where({ 'ModuleID': 100 })
        //     //.orderBy(Date)
        //     .read()
        //     .then(showData(data), handleError(error));
    }, function (error){
      alert("Pull Error: " + error);
    });
  }

  function readLocalData()
  {
    // WalksTable
    //     // .where({ 'ModuleID': 100 })
    //     //.orderBy(Date)
    //     .read()
    //     .then(function(data){
    //       alert("Local Data: " + data);
    //       console.log(data);
    //       console.log(data.innerHTML);
    //       alert("Local Data.innerHTML: " + data.innerHTML);
    //     }, handleError(error));
    WalksTable.read().then(function(data){
      console.log(data);
      console.log(data[0]);
      alert("local data: " + data);
      alert("local data: " + data[0]);
      alert("local data: " + data[0].ModuleID + " " + data[0].Distance + " " + data[0].Duration);
      refreshData();
    });
  }

  function showData(data)
  {
    alert("Local Data: " + data);
    console.log(data);
    console.log(data.innerHTML);
    alert("Local Data.innerHTML: " + data.innerHTML);
  }

  function handleError(error)
  {
    alert("refresh error: " + error);
  }

  function addData(){
    alert("addData");
    WalksTable.insert({'ModuleID':100,'Distance':11,'Duration':9}) //id can be null
      .then(function()
      {
        alert('successfully added data');
        //refreshData();
        readLocalData();
      }, function(error)
      {
        alert(error);
      });
  }
