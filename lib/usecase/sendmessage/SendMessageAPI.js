var requireLib = require(__dirname + '/../../util/FindLib.js').require;

var logger = requireLib('logger.js');
var SendMessageAPI = function(sendMessageService) {
  var SimpleResponse = function(req, res) {
    return {
      send: function(item) {
        item.status = item.status || 200;
        logger.log(req.url, 'status:' + item.status, JSON.stringify(item.message));
        res.status(item.status);
        res.send(item.message);
      }
    };
  };

  var getMessageItem = function(req) {
    var apitoken = req.params.api;
    var room = req.params.room;
    if(room.indexOf('rid') != -1) room = room.split('rid')[1];
    var body;
    if(req.method == 'GET') {
      body = req.query.body;
    } else {
      body = req.body.body || req.body;
    }
    return {
      apitoken: apitoken, room: room, body: body
    };
  };

  var recieveSendMessage = function(req, res) {
    var messageItem = getMessageItem(req);
    var sres = SimpleResponse(req, res);
    sendMessageService.send(messageItem, sres);
  }

  return {
    action: recieveSendMessage
  }
};

module.exports = SendMessageAPI;
