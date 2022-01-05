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

var storedProcedure = '[dbo].[SP_UPLOAD_PHASE_3]';

var connection = new Connection(config);


module.exports.start = function(callback){
  connection = new Connection(config);
  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error Connecting to DB: ', err)
    } else {
      console.log('Connected to DB...')
      run(function(){
        connection.close();
        return callback();
      });
    }
  });
  connection.on('error', function(err) {
    console.log('Error2: ', err)
  });

  // Initialize the connection.
  connection.connect();
}


function run(cb){
  var request = new Request(storedProcedure, (err) => {
    if (err) {
      throw err;
    }

    console.log('DONE!');
    connection.close();
  });

  // request.addParameter('inputVal', TYPES.VarChar, 'hello world');
  // request.addOutputParameter('outputCount', TYPES.Int);


  request.on('requestCompleted',function(){
    return cb();
  });

  connection.callProcedure(request);
}