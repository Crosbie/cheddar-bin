//filesystem library
var fs = require('fs');
var async = require('async');
/* Nodejs SQLServer driver, info available here: 
http://tediousjs.github.io/tedious/getting-started.html
*/
var tedious = require('tedious');

var DEV_FLAG = false;
// console.log('\n\n*****************');
// console.log('DEV_FLAG:',DEV_FLAG);
// console.log('*****************\n\n');

var fileDirs = []; // boolean array to flag when a Dir has been processed
// eg. [true,false,false]
// Only process one Dir in a single pass
// In this case index 1 will be processed next [true, *false*, false]
var thisDirPassFail = ""; // current working dir PassFail status


var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

var config = require('../dbConfig.json');

var connection = new Connection(config);
var MAX_FILE_AGE = 30;


// start function exposed to external calls
module.exports.start = function(callback){
  connection = new Connection(config);
  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error Connecting to DB: ', err)
    } else {
      console.log('Connected to DB...');
      readDirs(function(err,dirs){
        if(err){
          return console.error('Error reading Dirs:',err);
        } else {
          readCheeseParams(function(cpError,value){
            if(cpError){
              console.error('Error reading Cheese_Parameters:',cpError);
            } // continue running even if error reading Cheese_Parameters, MAX_FILE_AGE will default to 30
            MAX_FILE_AGE = value || 30;
            console.log('Max File Age:',MAX_FILE_AGE);
            
            console.log('Found %s directories',dirs.length);
            async.eachSeries(dirs,function(dir,done) {
              run(dir,done); // Start Process
            },function(){
              // Done
              connection.close();
              return callback();
            })
          })
          
        }
      })
    }
  });
  connection.on('error', function(err) {
    console.log('Error2: ', err)
  });

  // Initialize the connection.
  connection.connect();
}

function run(dir, callback){

  async.waterfall([

    function doRead(cb){
      var workingDir = dir.cd_path;
      thisDirPassFail = dir.cd_pass_fail

      if(DEV_FLAG){
        workingDir = "./test/";
      }
      

      fs.readdir(workingDir, function(readErr,files){
        if(readErr){
          return cb(readErr);
        }
        // console.log('FILES:',files);
        var images = [];
        for(var i=0;i<files.length;i++){
          images.push(workingDir + '/' + files[i]);
        }
        cb(null, images);
      })
    },

    function doCleanup(files, cb){
      async.each(files,function(file,done) {
        
        if(fileAge(file) >= MAX_FILE_AGE){
          // fs.unlink(file,done); // delete image file
        }
        
      }, function(deleteErr){
        cb(deleteErr,files);
      });
    }
  ], function(err,result){
    if(err){
      console.error('ERROR Occurred during batch function:',err);
    } else {
      console.log('DONE');
      return callback();
    }
  })  
}

function noop(){}

function fileAge(file){
  var today = new Date();
  // var creationDate = fs.statSync(file).birthtime; // file creation date
  var creationDate = fs.statSync(file).mtime; // file modified date
  var ageMs = today.getTime() - creationDate.getTime();
  var ageDays = ageMs/ (1000 * 60 * 60 * 24);
  // console.log('file',file);
  // console.log('file age',ageDays);
  return ageDays;
}

function readDirs(cb){
  console.log('Reading rows from the Directories Table...');

      // Read all rows from table
      request = new Request(
        "SELECT * FROM Cheese_Directories WHERE cd_source_target = 'T' AND cd_active = 'Y' ORDER BY cd_sort_order;",
        function(err, rowCount, rows) {
        if (err) {
            cb(err);
        } else {
            // console.log(rowCount + ' row(s) returned');
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
          // console.log(result);
      });
      
      // return CB function on end of request
      // this ends the fetchDir function
      request.on('requestCompleted',function(){
        return cb(null,result);
      });

      // Execute SQL statement
      connection.execSql(request);
}

function readCheeseParams(cb){
  console.log('Reading rows from the Cheese_Parameters Table...');

      // Read all rows from table
      request = new Request(
        "SELECT cp_value FROM Cheese_Parameters WHERE cp_key = 'DAYS_TO_RETAIN_IMAGES';",
        function(err, rowCount, rows) {
        if (err) {
            cb(err);
        }
      });

      // Print the rows read
      var result = [];
      request.on('row', function(data) {
          result = data[0].value;
      });
      
      request.on('requestCompleted',function(){
        return cb(null,result);
      });

      // Execute SQL statement
      connection.execSql(request);
}