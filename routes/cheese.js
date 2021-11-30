var express = require('express');
var router = express.Router();
var tedious = require('tedious');

var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

var config = require('../dbConfig.json');

var connection = new Connection(config);

function noop(){}; // end function call


router.post('/filter', function(req, res){
  connection = new Connection(config);
  var payload = req.body;
  console.log('payload',payload);
  // 
  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error Connecting to DB: ', err)
    } else {
      console.log('Connected to DB...');
      filterCheese(payload,function(err,data){
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

  // Initialize the connection.
  connection.connect();
})


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
    "cb_day_number",
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

// Call Stored Procedure in DB
function filterCheese(data,cb){
  var request = new Request("[dbo].[SP_FILTER_CHEESE_BLOCKS]", (err) => {
    if (err) {
      throw err;
    }

    console.log('DONE!');
    connection.close();
  });

  console.log('plantcode',data["cb_prod_date"])

  /* Accepted fields:
  @year_code_n  CHAR(1), @year_code_1  CHAR(1),      @year_code_2  CHAR(1),
  @plant_code_n CHAR(1), @plant_code_1 CHAR(1),      @plant_code_2 CHAR(1),
  @day_number_n CHAR(1), @day_number_1 NUMERIC(3,0), @day_number_2 NUMERIC(3,0),
  @pallet_n     CHAR(1), @pallet_1     INT,          @pallet_2     INT,
  @block_n      CHAR(1), @block_1      INT,          @block_2      INT,
  @prod_date_n  CHAR(1), @prod_date_1  DATE,         @prod_date_2  DATE,
  @prod_time_n  CHAR(1), @prod_time_1  TIME,         @prod_time_2  TIME,
  @pass_fail_n  CHAR(1), @pass_fail_1  CHAR(1),      @pass_fail_2  CHAR(1),
  @order_by     NVARCHAR(200) */

  request.addParameter('year_code_n', TYPES.VarChar, null);
  request.addParameter('year_code_1', TYPES.VarChar, data["cb_year_code"] || null);
  request.addParameter('year_code_2', TYPES.VarChar, data["cb_year_code2"] || null);
  request.addParameter('plant_code_n', TYPES.VarChar, null);
  request.addParameter('plant_code_1', TYPES.VarChar, data["cb_plant_code"] || null);
  request.addParameter('plant_code_2', TYPES.VarChar, data["cb_plant_code"] || null);
  request.addParameter('day_number_n', TYPES.VarChar, null);
  request.addParameter('day_number_1', TYPES.VarChar, data["cb_day_code"] || null);
  request.addParameter('day_number_2', TYPES.VarChar, data["cb_day_code2"] || null);
  request.addParameter('pallet_n', TYPES.VarChar, null);
  request.addParameter('pallet_1', TYPES.VarChar, data["cb_pallet"] || null);
  request.addParameter('pallet_2', TYPES.VarChar, data["cb_pallet"] || null);
  request.addParameter('block_n', TYPES.VarChar, null);
  request.addParameter('block_1', TYPES.VarChar, data["cb_block"] || null);
  request.addParameter('block_2', TYPES.VarChar, data["cb_block"] || null);
  request.addParameter('prod_date_n', TYPES.VarChar, null);
  request.addParameter('prod_date_1', TYPES.Date, data["cb_prod_date"] || null);
  request.addParameter('prod_date_2', TYPES.Date, data["cb_prod_date2"] || null);
  request.addParameter('prod_time_n', TYPES.VarChar, null);
  request.addParameter('prod_time_1', TYPES.NVarChar, data["cb_prod_time"] || null);
  request.addParameter('prod_time_2', TYPES.NVarChar, data["cb_prod_time2"] || null);
  request.addParameter('pass_fail_n', TYPES.VarChar, null);
  request.addParameter('pass_fail_1', TYPES.VarChar, data["cb_pass_fail"] || null);
  request.addParameter('pass_fail_2', TYPES.VarChar, null);
  request.addParameter('order_by', TYPES.VarChar, null);
  

  // request.addOutputParameter('id', TYPES.Int);


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

  request.on('requestCompleted',function(){
    console.log('result',result);
    return cb(null,result);
  });

  connection.callProcedure(request);
}

module.exports = router;
