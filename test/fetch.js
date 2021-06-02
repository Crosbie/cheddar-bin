//filesystem library
var fs = require('fs');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
/* Nodejs SQLServer driver, info available here: 
http://tediousjs.github.io/tedious/getting-started.html
*/
var tedious = require('tedious');
var db;


var Connection = tedious.Connection;

var config = {
  server: "192.168.1.210", // or "localhost"
  options: {},
  authentication: {
    type: "default",
    options: {  
      userName: "test",
      password: "test",
    }
  }
};

console.log('test');

// get day number
/*
var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay);
console.log('Day of year: ' + day);
*/


// db = new sqlite3.Database('./Glanbia_Cheese.db', fetch);

var connection = new Connection(config);

  // Setup event handler when the connection is established. 
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error Connecting to DB: ', err)
    } else {
      fetch();
    }
  });
  // Initialize the connection.
  console.log('opening DB connection');
  connection.connect();


function fetch(){

  async.waterfall([

    // Fetch the Good and Bad directories from DB
    function fetchDir(cb){

      return cb(null,{url:"testing/good"})
    },


    function doRead(dir, cb){
      var fileDir = dir.url || __dirname;

      fs.readdir(__dirname, function(readErr,files){
        if(readErr){
          return cb(readErr);
        }
        console.log('FILES:',files);
        var bmps = [];
        for(var i=0;i<files.length;i++){
          if(files[i].indexOf('.bmp') > 0 && files[i].indexOf('.DONE') < 0){
            bmps.push(files[i]);
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
    console.log('DONE');
    db.all("SELECT Cheese_ID FROM cheese_blocks", function(selectErr, data){
      if(selectErr){
        console.log('Select Error:',selectErr);
      } else {
        console.log('Data', data);
      }
    })
  })
}

function noop(){}

function convert(filepath, cb){
  const Jimp = require("jimp");
  
  console.log("convert bmp to jpg");

  Jimp.read(filepath + ".bmp", function (err, image) {
    if (err) {
      console.log(err);
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
      return console.error('Error reading cheese file: ', err);
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
    var val_string = "";
    db.run("INSERT INTO cheese_blocks VALUES (?,?,?,?,?,?,?,?)",
    [
      entry.id,
      entry.created,
      entry.day,
      entry.year,
      entry.plant,
      entry.pallet,
      entry.prod,
      entry.xray
    ],['test'],
    function(err){
      if(err){
        console.error('Error on Insert', err);
        cb(err);
      } else {
        console.log('Insert successful');
        cb();
      }
      
    });
  })
}