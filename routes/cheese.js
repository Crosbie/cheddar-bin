var express = require('express');
var router = express.Router();
var tedious = require('tedious');

var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

var config = {
  server: "localhost",
  options: {
    // port: 1433,
    encrypt: false,
    database: 'Glanbia_Ireland_Cheese'
  },
 authentication: {
    type: "default",
    options: {  
      userName: "sa",
      // password: "Wjac23052208#sa",
      password: "Password1#",
    }
  }
};

var connection = new Connection(config);

  function noop(){}; // end function call


/* GET users listing. */
router.get('/list', function(req, res, next) {
  connection = new Connection(config);
  // 
  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error Connecting to DB: ', err)
    } else {
      console.log('Connected to DB...');
      readCheese(function(err,data){
        connection.close();
        if(err){
          return res.error('Error reading cheese:',err);
        } else {
          return res.json(data);
        }
      })
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
});

function readCheese(cb){
  console.log('Reading rows from the CheeseBlocks Table...');
  var columns = [
    "cb_id",
    "cb_plant_code",
    "cb_prod_date",
    "cb_prod_time",
    "cb_upload_date",
    "cb_upload_time",
    "cb_upload_dir",
    "cb_upload_file",
    "cb_target_dir",
    "cb_pass_fail"
  ];

      // Read all rows from table
      request = new Request(
        "SELECT "+ columns.join(',') +" FROM Cheese_Blocks",
        function(err, rowCount, rows) {
        if (err) {
            console.error('DB Read error:',err);
        } else {
            console.log(rowCount + ' row(s) returned');
        }
      });

      // Print the rows read
      var result = [];
      request.on('row', function(columns) {
        var rowObj = {}
          columns.forEach(function(column) {
              if (column.value === null) {
                  // console.log('NULL');
              } else {
                  rowObj[column.metadata.colName] =column.value;
              }
          });
          result.push(rowObj);
      });
      
      // return CB function on end of request
      // this ends the fetchDir function
      request.on('requestCompleted',function(){
        console.log('result',result);
        return cb(null,result);
      });

      // Execute SQL statement
      connection.execSql(request);
}

module.exports = router;
