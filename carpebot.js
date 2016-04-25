/**
 *     _____          _____  _____  ______ ____   ____ _______ 
 *    / ____|   /\   |  __ \|  __ \|  ____|  _ \ / __ \__   __|
 *   | |       /  \  | |__) | |__) | |__  | |_) | |  | | | |   
 *   | |      / /\ \ |  _  /|  ___/|  __| |  _ <| |  | | | |   
 *   | |____ / ____ \| | \ \| |    | |____| |_) | |__| | | |   
 *    \_____/_/    \_\_|  \_\_|    |______|____/ \____/  |_|   
 *
 *           Your Slack servant for daily committing
 */

require('./env.js');
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var WebClient = require('@slack/client').WebClient;

var DEBUG_LEVEL = 'info'; // 'debug', 'info', 'verbose'

var token = process.env.SLACK_API_TOKEN || '';

var rtm = new RtmClient(token, {logLevel: DEBUG_LEVEL});
var web = new WebClient(token);

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(data) {
  var command = data['text'];
  var client_id = '<@' + rtm.activeUserId + '>';
  console.log(client_id);
  console.log(command.substring(0, client_id.length));
  if (command.substring(0, client_id.length) == client_id) {
    command = command.substring(client_id.length + 1).trim();
    
    console.log(command);
    console.log('Message:', data);
    fetchDM(data['user'], rtm);
  }
});

var fetchDM = function(user, rtm) {
  web.im.open(user, function imOpenCb(err, info) {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('IM Info:', info);
      rtm.sendMessage('test', info['channel']['id']);
    }
  });
}

rtm.start();