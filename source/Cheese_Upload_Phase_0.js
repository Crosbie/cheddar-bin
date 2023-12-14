//filesystem library
var fs = require('fs');
var async = require('async');
var path = require('path');
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


// start function exposed to external calls
module.exports.start = function(callback){
  console.log('Phase_0 starting...');
  connection = new Connection(config);
  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error Connecting to DB: ', err)
    } else {
      readDirs("X", function(err,dirs){
        if(err){
          return console.error('Error reading Dirs:',err);
        } else {
          // Start Process
          console.log('Found %s XRAY directories',dirs.length);
          if(dirs.length === 0){
            console.log('Done, no XRAY dirs found');
            connection.close();
            return callback();
          }
          async.eachSeries(dirs,function(dir,done) {
            run(dir,done);
          },function(){
            // Done
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
        var bmps = [];
        for(var i=0;i<files.length;i++){
          if(files[i].indexOf('.bmp') > 0 && files[i].indexOf('.DONE') < 0){
            bmps.push(workingDir + '/' + files[i]);
          }
        }
        // console.log('BMPS',bmps)
        cb(null, bmps);
      })
    },

    // function doConvert(files, cb){
    //   async.each(files,function(file,done) {
    //     file = file.replace('.bmp','');
    //     convert(file,done)
    //   }, function(convertErr){
    //     cb(convertErr, files);
    //   });
    // },

    // function doCleanup(files, cb){
    //   async.each(files,function(file,done) {
    //     // rename BMP file
    //     file = file.replace('.bmp','.jpg');
    //     // fs.rename(file,file+'.DONE',noop); // save file as .jpg.DONE
    //     file = file.replace('.jpg','.bmp');
    //     fs.unlink(file,done); // delete .bmp file
    //   }, function(deleteErr){
    //     cb(deleteErr,files);
    //   });
    // },

    // Move Xray bmps from Xray dir to available Source dir
    function doMove(files, cb){
      // if no files, skip
      if(files.length ===0){
        return cb(null,[]);
      }
      
      // get Source dirs from DB
      readDirs("S",function(err,dirs){
        if (err){
          return cb(err);
        } else {
          var SOURCE = "";
          var movedFiles = [];

          // Use pass/fail SOURCE dir depending on which XRAY dir we are using
          for(var i=0;i<dirs.length;i++){
            if(dirs[i].cd_pass_fail === thisDirPassFail){
              SOURCE = dirs[i].cd_path;
            }
          }

          if (SOURCE===""){
            console.warn("\n No SOURCE folder found, leaving images in Xray dir \n");
            return cb(null,files);
          } else {
            // console.log('SOURCE DIR', SOURCE);
          }

          // move each image to SOURCE and collect array of new file locations to pass to next function
          async.each(files, function(image,done){
            var filename = image.replace(/^.*(\\|\/|\:)/, '');

            var newPath = SOURCE + '/' + filename;
            

            newPath = path.normalize(newPath);

            // rename doesn't work on Wexford server, need to do copy & remove instead
            /*
            fs.rename(image, newPath, function (err) {
                if (err) throw err
                // console.log('Successfully moved image!');
                movedFiles.push(newPath);
                done();
              })
            */
            
            fs.copyFile(image, newPath, function(err){
              if(err) throw err;

              movedFiles.push(newPath);
              fs.rm(image, done);
            }, function(moveErr){
              cb(moveErr,movedFiles);
            })
          })
        }
      })
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

function convert(filepath, cb){
  const Jimp = require("jimp");
  
  // console.log("convert bmp to jpg", filepath);

  Jimp.read(filepath + ".bmp", function (err, image) {
    if (err) {
      console.log('Convert Error:',err);
      cb(err);
    } else {
      // image.quality(60); // reduce quality to 60%
      image.write(filepath +".jpg");
      cb(null);
    }
  })
}

//  sourceTarget values {"S", "T", "X"}
function readDirs(sourceTarget, cb){
  console.log('Reading rows from the Directories Table...');

      // Read all rows from table
      request = new Request(
        "SELECT * FROM Cheese_Directories WHERE cd_source_target = '"+sourceTarget+"' AND cd_active = 'Y' ORDER BY cd_sort_order;",
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
