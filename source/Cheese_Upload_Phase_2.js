//filesystem library
var fs = require('fs');
var async = require('async');
var path = require('path');
/* Nodejs SQLServer driver, info available here: 
http://tediousjs.github.io/tedious/getting-started.html
*/

var DEV_FLAG = false;
console.log('\n\n*****************');
console.log('DEV_FLAG:',DEV_FLAG);
console.log('*****************\n\n');

var tedious = require('tedious');

var thisDirPassFail = ""; // current working dir PassFail status
var workingDir = "";

var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = tedious.TYPES;

var config = require('../dbConfig.json');

var connection = new Connection(config);

// start function exposed to external calls
module.exports.start = function(callback){
  connection = new Connection(config);
  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error Connecting to DB: ', err)
    } else {
      console.log('Connected to DB...');
      readDirs("S",function(err,dirs){
        if(err){
          return console.error('Error reading Dirs:',err);
        } else {
          // Start Process
          console.log('Found %s directories',dirs.length);
          async.eachSeries(dirs,function(dir,done) {
            run(dir,done);
          }, function(){
            connection.close();
            return callback();
          })
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
}

function run(dir,callback){

  async.waterfall([

    function doRead(cb){
      workingDir = dir.cd_path;
      thisDirPassFail = dir.cd_pass_fail

      if(DEV_FLAG){
        workingDir = "./test/";
      }
      
      console.log("workingDir:", workingDir);

      fs.readdir(workingDir, function(readErr,files){
        if(readErr){
          console.log('HERE',readErr);
          return cb(readErr);
        }
        console.log('FILES:',files);
        var images = [];
        for(var i=0;i<files.length;i++){
          if(files[i].indexOf('.jpg') > 0 ){
            images.push(workingDir + '/' + files[i]);
          }
        }
        console.log('FILES To Insert',images)
        cb(null, images);
      })
    },

    // Move files from Source to Target dir
    function moveFiles(images, cb){
      
      // get Target dirs from DB
      readDirs("T",function(err,dirs){
        if (err){
          return cb(err);
        } else {
          var TARGET = "";
          var movedFiles = [];

          // Use pass/fail target dir depending on which source dir we are using
          for(var i=0;i<dirs.length;i++){
            if(dirs[i].cd_pass_fail === thisDirPassFail){
              TARGET = dirs[i].cd_path;
            }
          }

          if (TARGET===""){
            console.warn("\n No Target folder found, leaving images in source \n");
            return cb(null,images);
          } else {
            console.log('TARGET DIR', TARGET);
          }

          // move each image to Target and collect array of new file locations to pass to next function
          async.each(images, function(image,done){
            var filename = image.replace(/^.*(\\|\/|\:)/, '');

            var newPath = TARGET + '/' + filename;

            // FOR TESTING
            if(DEV_FLAG){
              var dir = image.replace(filename,"");
              var newPath = dir + '/files/' + filename;
            }
            

            newPath = path.normalize(newPath);
            
            fs.rename(image, newPath, function (err) {
              if (err) throw err
              console.log('Successfully moved image!');
              movedFiles.push(newPath);
              done();
            })
          }, function(moveErr){
            console.log('movedFiles',movedFiles);
            cb(moveErr,movedFiles);
          })
        }
      })
    },

    function doInsert(files, cb){
      async.eachSeries(files,function(file,done) {
        insert(file, done);
      }, function(insertErr){
        cb(insertErr,files);
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


function insert(file, cb){
  fs.readFile(file, function(err, content){
    if(err){
      return console.error('Insert:Error reading cheese file: ', err);
    }

    var filename = file.replace(/^.*(\\|\/|\:)/, '');
    var dir = file.replace(filename, "");

    // filename
    // 0_12832230 2018_03_23 21_20_15.bmp
    // 0_00000009_2021_01_18_13_34_29.bmp

    var filenameSections = filename.split('.')[0].split('_'); // [0,0000009,2021,01,18,13,34,29]
    var filenameDate = filenameSections.slice(2,5).join('/');
    var filenameTime = filenameSections.slice(5,8).join(':');

    console.log('insert cheese');

    const sql = 'INSERT INTO Cheese_Blocks (' +
    '[cb_plant_code],' +
    '[cb_prod_date],' +
    '[cb_prod_time],' +
    '[cb_upload_date],' +
    '[cb_upload_time],' +
    '[cb_upload_dir],' +
    '[cb_upload_file],' +
    '[cb_pass_fail],' +
    '[cb_block_image],' +
    '[cb_target_dir])' +
    'VALUES '+
        '(@plantCode, @prodDate, @prodTime, @UploadDate, @uploadTime, @uploadDir, @uploadFile, @passFail, @blockImage, @targetDir)';
  const request = new Request(sql, (err, rowCount) => {
    if (err) {
      console.error('Insert Error:',err);
      return cb(err);
    }
    console.log('input success!', filename);
    return cb(null);
  });


  var prodDate = new Date(filenameDate);
  var UTCDate = new Date(prodDate.getTime() - (prodDate.getTimezoneOffset() * 60000));

  console.log('\n\n*******')
  console.log('filename',filenameDate);
  console.log('prodDate',prodDate);
  console.log('UTC Date',UTCDate);
  console.log('*******')
  console.log('*******\n\n')
  
  // format date as YYYYMMDD
  // var formatedDate = prodDate.getYear() + ("0" + (prodDate.getMonth() + 1)).slice(-2) + ("0" + prodDate.getDate()).slice(-2)

  var time = filenameDate + ' ' + filenameTime;
  prodTime = new Date(time);
  // format time as HH:MM:SS
  var formatedTime = prodTime.getHours() + ":" + prodTime.getMinutes() + ":" + prodTime.getSeconds();

  // Setting values to the variables. Note: first argument matches name of variable above.
  request.addParameter('plantCode', TYPES.Char, 'C');
  request.addParameter('prodDate', TYPES.Date, UTCDate);
  request.addParameter('prodTime', TYPES.NVarChar, formatedTime);
  request.addParameter('uploadDate', TYPES.Date, new Date());
  request.addParameter('uploadTime', TYPES.DateTime, new Date());
  request.addParameter('uploadDir', TYPES.NVarChar, workingDir);
  request.addParameter('uploadFile', TYPES.NVarChar, filename);
  request.addParameter('passFail', TYPES.Char, thisDirPassFail);
  request.addParameter('blockImage', TYPES.Image, content);
  request.addParameter('targetDir', TYPES.NVarChar, dir);

  connection.execSql(request);
  })
}

function readDirs(sourceTarget,cb){
  console.log('Reading rows from the Directories Table...');

      // Read all rows from table
      request = new Request(
        "SELECT * FROM Cheese_Directories WHERE cd_source_target = '"+
         sourceTarget + "' AND cd_active = 'Y' ORDER BY cd_sort_order;",
        function(err, rowCount, rows) {
        if (err) {
            console.error('DB Read error:',err);
            // return cb(err);
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
}

// docker run -e 'HOMEBREW_NO_ENV_FILTERING=1' -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Password1#' -p 1433:1433 -d microsoft/mssql-server-linux
// sqlcmd -S 127.0.0.1 -U sa -P Password1#  -i ./scripts/SP_FILTER_CHEESE_BLOCKS.sql