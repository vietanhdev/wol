var express = require('express');
var router = express.Router();
var config = require('../config.json');

var wol = {}
wol.status = false;
wol.last_command_time = null;
wol.last_client_checking_time = null;
wol.last_wol_time = null;


// Check expired wol command and update status
function refresStatus() {
  if (wol.status == true && wol.last_command_time != null) {

    // Check if the command was expired => disable WOL command
    let current_time = new Date();
    let time_passed_from_last_command = Math.round((current_time - wol.last_command_time) / 1000);
    if (time_passed_from_last_command > config.wol_command_valid_time) {
      wol.status = false;
    }

  }
}

// GET status
router.get('/wol_command', function(req, res, next) {
  wol.last_client_checking_time = new Date();
  refresStatus();
  if (wol.status === true) {
    let response = "WAKE_UP " + config.mac_address; 
    res.send(response);

    // If the client is WOL device, we assume that it could deliver a WOL signal successfully
    if (req.param.client="wol_device") {
      wol.last_wol_time = new Date();
      wol.status = false;
    }

  } else {
    res.send('NULL');
  }
});


// Notify server
// This API is for client to notify server that a wake up signal has been sent
router.get('/notify_server', function(req, res, next) {
  wol.last_wol_time = new Date();
  refresStatus();
  wol.status = false;
  res.send('');
});


// Get status
router.get('/status', function(req, res, next) {
  refresStatus();
  let response = {}
  response.status = wol.status;
  if (wol.last_command_time != null) {
    response.last_command_time = wol.last_command_time.toLocaleString('vi-VN');
  } else {
    response.last_command_time = null;
  }
  if (wol.last_wol_time != null) {
    response.last_wol_time = wol.last_wol_time.toLocaleString('vi-VN');
  } else {
    response.last_wol_time = null;
  }
  if (wol.last_client_checking_time != null) {
    response.last_client_checking_time = wol.last_client_checking_time.toLocaleString('vi-VN');
  } else {
    response.last_client_checking_time = null;
  }
  res.json(response);
});


// Post a command
router.post('/new_wol', function(req, res, next) {
  var input_password = req.body.password;
  if (input_password == config.password) {
    wol.status = true;

    // Save time
    wol.last_command_time =  new Date();

    return res.json({"success": true});
  }
  return res.json({"success": false, "message": "Wrong password!"});
});

module.exports = router;
