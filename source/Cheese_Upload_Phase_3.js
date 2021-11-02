//filesystem library
var fs = require('fs');
var async = require('async');
/* Nodejs SQLServer driver, info available here: 
http://tediousjs.github.io/tedious/getting-started.html
*/
var tedious = require('tedious');
var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

var config = require('../dbConfig.json');

var storedProcedure = '[dbo].[test_proced]'; // TODO: insert SP Name

var connection = new Connection(config);

  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error Connecting to DB: ', err)
    } else {
      console.log('Connected to DB...')
      run(); // start process
    }
  });
  connection.on('error', function(err) {
    console.log('Error2: ', err)
  });
  connection.on('debug', function(err) {
    console.log('debug: ', err)
  });

  // Initialize the connection.
  connection.connect();


function run(){
  var request = new Request(storedProcedure, (err) => {
    if (err) {
      throw err;
    }

    console.log('DONE!');
    connection.close();
  });

  // request.addParameter('inputVal', TYPES.VarChar, 'hello world');
  // request.addOutputParameter('outputCount', TYPES.Int);

  request.on('returnValue', (paramName, value, metadata) => {
    console.log(paramName + ' : ' + value);
  });

  connection.callProcedure(request);
}