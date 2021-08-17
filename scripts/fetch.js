//filesystem library
var fs = require('fs');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
/* Nodejs SQLServer driver, info available here: 
http://tediousjs.github.io/tedious/getting-started.html
*/
var tedious = require('tedious');
var db;

var fileDirs = []; // boolean array to flag when a Dir has been processed
// eg. [true,false,false]


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
      fetch(); // start process
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

function fetch(){

  async.waterfall([

    // Fetch the Good and Bad directories from DB
    function fetchDir(cb){
      console.log('Reading rows from the Directories Table...');

      // Read all rows from table
      request = new Request(
        'SELECT cd_path FROM Cheese_Directories ORDER BY cd_sort_order;',
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
      //   workingDir = dirs[0].Dir_Path;
      //   fileDirs[0] = true;
      // } else {
      //   workingDir = dirs[1].Dir_Path;
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

    function doInsert(files, cb){
      async.each(files,function(file,done) {
        file = file.replace('.bmp','.jpg');
        insert(file, done);
      }, function(insertErr){
        cb(insertErr,files);
      });
    },

    function doCleanup(files, cb){
      async.each(files,function(file,done) {
        // rename BMP file
        fs.rename(file,file+'.DONE',noop);
        file = file.replace('.bmp','.jpg');
        fs.unlink(file,done); // delete file
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

function insert(file, cb){
  fs.readFile(file, function(err, content){
    if(err){
      return console.error('Insert:Error reading cheese file: ', err);
    }

    console.log('insert cheese');
    var entry = {
      id: null,
      created: file.split(' ')[1],
      day: file.split(' ')[1],
      year: file.split(' ')[1],
      plant: 'C',
      pallet: null,
      prod: file.split(' ')[0].replace('0_',''),
      xray: content
    };

    const sql = 'INSERT INTO Cheese_Blocks (' +
    '[cb_plant_code],' +
    '[cb_prod_date],' +
    '[cb_prod_time],' +
    '[cb_upload_date],' +
    '[cb_upload_time],' +
    '[cb_upload_dir],' +
    '[cb_upload_file],' +
    '[cb_pass_fail],' +
    '[cb_block_image])' +
    'VALUES '+
        '(@plantCode, @prodDate, @prodTime, @UploadDate, @uploadTime, @uploadDir, @uploadFile, @passFail, @blockImage)';
  const request = new Request(sql, (err, rowCount) => {
    if (err) {
      console.error('Insert Error:',err);
      return cb(err);
    }
    console.log('rowCount: ', rowCount);
    console.log('input parameters success!');
    return cb(null);
  });

  var prodDate = file.split(' ')[1].split('_').join('/');
  prodDate = new Date(prodDate);

  var prodTime = file.split(' ')[1].split('_').join('/');
  prodTime += ' ' + file.split(' ')[2].split('.jpg')[0].split('_').join(':');
  prodTime = new Date(prodTime);

  // Setting values to the variables. Note: first argument matches name of variable above.
  request.addParameter('plantCode', TYPES.Char, 'C');
  request.addParameter('prodDate', TYPES.Date, prodDate);
  request.addParameter('prodTime', TYPES.Time, prodTime);
  request.addParameter('uploadDate', TYPES.Date, new Date());
  request.addParameter('uploadTime', TYPES.Time, new Date());
  request.addParameter('uploadDir', TYPES.NVarChar, file);
  request.addParameter('uploadFile', TYPES.NVarChar, file);
  request.addParameter('passFail', TYPES.Char, 1);
  request.addParameter('blockImage', TYPES.Image, content);

  connection.execSql(request);
  })
}

// docker run -e 'HOMEBREW_NO_ENV_FILTERING=1' -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Password1#' -p 1433:1433 -d microsoft/mssql-server-linux
// sqlcmd -S 127.0.0.1 -U sa -P Password1# -d SampleDB -i ./CreateTestData.sql