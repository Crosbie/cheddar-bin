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
  server: "localhost", // or "localhost"
  options: {
    // port: 1433,
    encrypt: false,
    database: 'Glanbia_Ireland_Cheese'
  },
  authentication: {
    type: "default",
    options: {  
      userName: "sa",
      password: "Password1#",
    }
  }
};

/*
 For windows login:
 authentication: {
    type: "ntlm",
    options: {  
      userName: "sa",
      password: "Password1#",
      domain: "billy-PC"
      tdsVersion: "7_3_B" // for SQL Server 2018R2
    }
  }

  config.options.encrypt = false
*/


// get day number
/*
var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay);
console.log('Day of year: ' + day);
*/

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
        'SELECT Dir_Type, Dir_Path FROM Directories;',
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
      db.all("SELECT Cheese_ID FROM cheese_blocks", function(selectErr, data){
        if(selectErr){
          console.log('Select Error:',selectErr);
        } else {
          console.log('Data', data);
        }
      })  
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
    '[Year_Code],' +
    '[Plant_Code],' +
    '[Day_Number],' +
    '[Prod_Date],' +
    '[Prod_Time],' +
    '[Upload_Date],' +
    '[Upload_Time],' +
    '[Upload_Dir],' +
    '[Upload_File],' +
    '[Pallet],' +
    '[Block],' +
    '[Pass_Fail],' +
    '[Block_Image])' +
    'VALUES'+
        '(@yearCode, @plantCode, @dayNum, @prodDate, @prodTime, @UploadDate, @uploadTime, @uploadDir, @uploadFile, @pallet, @block, @passFail, @blockImage)';
  const request = new Request(sql, (err, rowCount) => {
    if (err) {
      console.error('Insert Error:',err);
      return cb(err);
    }
    console.log('rowCount: ', rowCount);
    console.log('input parameters success!');
    return cb(null);
  });

  // Table Schema
  // CREATE TABLE [dbo].[Cheese_Blocks](
  //   [Block_ID] [uniqueidentifier] NOT NULL,
  //   [Year_Code] [char](1) NOT NULL,
  //   [Plant_Code] [char](1) NOT NULL,
  //   [Day_Number] [numeric](3, 0) NOT NULL,
  //   [Prod_Date] [date] NOT NULL,
  //   [Prod_Time] [time](7) NOT NULL,
  //   [Upload_Date] [date] NULL,
  //   [Upload_Time] [time](7) NULL,
  //   [Upload_Dir] [nvarchar](100) NULL,
  //   [Upload_File] [nvarchar](100) NULL,
  //   [Pallet] [numeric](18, 0) NULL,
  //   [Block] [numeric](18, 0) NULL,
  //   [Pass_Fail] [char](1) NOT NULL,
  //   [Block_Image] [image] NULL,

  var prodDate = file.split(' ')[1].split('_').join('/');
  prodDate = new Date(prodDate);

  var prodTime = file.split(' ')[1].split('_').join('/');
  prodTime += ' ' + file.split(' ')[2].split('.jpg')[0].split('_').join(':');
  prodTime = new Date(prodTime);

  // Setting values to the variables. Note: first argument matches name of variable above.
  request.addParameter('yearCode', TYPES.Char, getYearCode());
  request.addParameter('plantCode', TYPES.Char, 'C');
  request.addParameter('dayNum', TYPES.Int, getDayCode());
  request.addParameter('prodDate', TYPES.Date, prodDate);
  request.addParameter('prodTime', TYPES.Time, prodTime);
  request.addParameter('uploadDate', TYPES.Date, new Date());
  request.addParameter('uploadTime', TYPES.Time, new Date());
  request.addParameter('uploadDir', TYPES.NVarChar, file);
  request.addParameter('uploadFile', TYPES.NVarChar, file);
  request.addParameter('pallet', TYPES.Numeric, 100);
  request.addParameter('block', TYPES.Numeric, 100);
  request.addParameter('passFail', TYPES.Char, 1);
  request.addParameter('blockImage', TYPES.Image, content);


  connection.execSql(request);
  })
}

// return this years predefined code
function getYearCode(){
  var d = new Date().getFullYear();
  var years = {
    2020: 'L',
    2021: 'M',
    2022: 'N',
    2023: 'O',
    2024: 'P',
    2025: 'Q'
  };
  return years[d];
}

console.log(getYearCode());

function getDayCode(){
  return 100;
}

// docker run -e 'HOMEBREW_NO_ENV_FILTERING=1' -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Password1#' -p 1433:1433 -d microsoft/mssql-server-linux
// sqlcmd -S 127.0.0.1 -U sa -P Password1# -d SampleDB -i ./CreateTestData.sql