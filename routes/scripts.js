var express = require('express');
var router = express.Router();
var CronJob = require('cron').CronJob;
var phase1script = require('../source/Cheese_Upload_Phase_1.js');
var phase2script = require('../source/Cheese_Upload_Phase_2.js');
var phase3script = require('../source/Cheese_Upload_Phase_3.js');

function noop() {};

router.get('/phase1', function(req, res, next) {
  phase1script.start(noop);
  res.json({"status": "Phase 1 job started..."});
});

router.get('/phase2', function(req, res, next) {
  phase2script.start(noop);
  res.json({"status": "Phase 2 job started..."});
});

router.get('/phase3', function(req, res, next) {
  phase3script.start(noop);
  res.json({"status": "Phase 3 job started..."});
});


// https://crontab.guru for cron time examples

// runs at 00:00 everynight
var phase1_job = new CronJob('0 0 * * *', function() {
  console.log('Phase1 job starting');
  phase1script.start(noop);
}, null, true, "Europe/Dublin", null, null);
phase1_job.start();

// runs at 00:15 everynight
var phase2_job = new CronJob('15 0 * * *', function() {
  console.log('Phase2 job starting');
  phase2script.start(noop);
}, null, true, "Europe/Dublin", null, null);
phase2_job.start();

// runs at 00:45 everynight
var phase3_job = new CronJob('45 0 * * *', function() {
  console.log('Phase3 job starting');
  phase3script.start(noop);
}, null, true, "Europe/Dublin", null, null);
phase3_job.start();

console.log('Set up nightly jobs schedule... DONE');

module.exports = router;
