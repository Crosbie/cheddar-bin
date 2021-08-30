//filesystem library
var fs = require('fs');
var async = require('async');
/* Nodejs SQLServer driver, info available here: 
http://tediousjs.github.io/tedious/getting-started.html
*/
var tedious = require('tedious');

var fileDirs = []; // boolean array to flag when a Dir has been processed
// eg. [true,false,false]
// Only process one Dir in a single pass
// In this case index 1 will be processed next [true, *false*, false]
var thisDirPassFail = ""; // current working dir PassFail status


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

  async.waterfall([

    // Fetch the Good and Bad directories from DB
    function fetchDir(cb){
      console.log('Reading rows from the Directories Table...');

      // Read all rows from table
      request = new Request(
        'SELECT * FROM Cheese_Directories ORDER BY cd_sort_order;',
        function(err, rowCount, rows) {
        if (err) {
            cb(err);
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
                  console.log('NULL');
              } else {
                  rowObj[column.metadata.colName] =column.value;
              }
          });
          result.push(rowObj);
          console.log(result);
      });
      
      // return CB function on end of request
      // this ends the fetchDir function
      request.on('requestCompleted',function(){
        return cb(null,result);
      });

      // Execute SQL statement
      connection.execSql(request);
    },

    function doRead(dirs, cb){
      var workingDir = __dirname;
      // TODO: uncomment for live dir selection
      // if(!fileDirs[0]){
      //   workingDir = dirs[0].cd_path;
      //   fileDirs[0] = true;
      //   thisDirPassFail = dirs[0].cd_pass_fail
      // } else {
      //   workingDir = dirs[1].cd_path;
      //   thisDirPassFail = dirs[1].cd_pass_fail
      //   fileDirs[1] = true;
      // }
      console.log("workingDir:", workingDir);

      fs.readdir(workingDir, function(readErr,files){
        if(readErr){
          return cb(readErr);
        }
        console.log('FILES:',files);
        var bmps = [];
        for(var i=0;i<files.length;i++){
          if(files[i].indexOf('.bmp') > 0 && files[i].indexOf('.DONE') < 0){
            bmps.push(workingDir + '/' + files[i]);
          }
        }
        console.log('BMPS',bmps)
        cb(null, bmps);
      })
    },

    function doConvert(files, cb){
      async.each(files,function(file,done) {
        file = file.replace('.bmp','');
        convert(file,done)
      }, function(convertErr){
        cb(convertErr, files);
      });
    },

    function doCleanup(files, cb){
      async.each(files,function(file,done) {
        // rename BMP file
        file = file.replace('.bmp','.jpg');
        fs.rename(file,file+'.DONE',noop); // save file as .jpg.DONE
        file = file.replace('.jpg','.bmp');
        fs.unlink(file,done); // delete .bmp file
      }, function(deleteErr){
        cb(deleteErr,files);
      });
    }
  ], function(err,result){
    if(err){
      console.error('ERROR Occurred during batch function:',err);
    } else {
      console.log('DONE');
        }
      })  
    }

function noop(){}

function convert(filepath, cb){
  const Jimp = require("jimp");
  
  console.log("convert bmp to jpg", filepath);

  Jimp.read(filepath + ".bmp", function (err, image) {
    if (err) {
      console.log('Convert Error:',err);
      cb(err);
    } else {
      image.write(filepath +".jpg");
      cb(null);
    }
  })
}