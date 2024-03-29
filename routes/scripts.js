var express = require('express');
var router = express.Router();
var CronJob = require('cron').CronJob;
var phase0script = require('../source/Cheese_Upload_Phase_0.js');
var phase1script = require('../source/Cheese_Upload_Phase_1.js');
var phase2script = require('../source/Cheese_Upload_Phase_2.js');
var phase3script = require('../source/Cheese_Upload_Phase_3.js');
var phase4script = require('../source/Cheese_Upload_Phase_4.js');

function noop() {};

router.get('/phase0', function(req, res, next) {
  phase0script.start(noop);
  res.json({"status": "Phase 0 job started..."});
});

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

router.get('/phase4', function(req, res, next) {
  phase4script.start(noop);
  res.json({"status": "Phase 4 job started..."});
});



/********** Nightly Jobs **********/
// https://crontab.guru for cron time examples

// runs every hour on the hour
var phase0_job = new CronJob('0 * * * *', function() {
  console.log('Phase0 job starting');
  phase0script.start(noop);
}, null, true, "Europe/Dublin", null, null);
phase0_job.start();

// runs at 01:15 everynight
var phase1_job = new CronJob('15 1 * * *', function() {
  console.log('Phase1 job starting');
  phase1script.start(noop);
}, null, true, "Europe/Dublin", null, null);
phase1_job.start();

// runs at 01:30 everynight
var phase2_job = new CronJob('30 1 * * *', function() {
  console.log('Phase2 job starting');
  phase2script.start(noop);
}, null, true, "Europe/Dublin", null, null);
phase2_job.start();

// runs at 02:00 everynight
var phase3_job = new CronJob('0 2 * * *', function() {
  console.log('Phase3 job starting');
  phase3script.start(noop);
}, null, true, "Europe/Dublin", null, null);
phase3_job.start();

// runs at 03:00 everynight
var phase4_job = new CronJob('0 3 * * *', function() {
  console.log('Phase4 job starting');
  phase4script.start(noop);
}, null, true, "Europe/Dublin", null, null);
phase4_job.start();


console.log('Set up nightly jobs schedule... DONE');

/******************************/

module.exports = router;
