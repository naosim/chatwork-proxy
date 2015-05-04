var express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  RouterDoc = require('./lib/RouterDoc.js'),
  logger = require('./lib/logger.js'),
  apiTokens = require('./lib/APITokens.js')(),
  confLoader = require('./lib/ConfLoader.js')(),
  ChatworkAPI = require('./lib/ChatworkAPI.js');

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

/**
  chatworkにメッセージを送信する
  params:
    {
      apitoken: <string> ChatworkAPIToken,
      room: <string> Room ID,
      body: <string> 本文
    }
  sres: <SimpleResponse>
*/
var send = function(params, sres) {
  var err = [];
  if(!apiTokens.contains(params.apitoken)) {
    err.push('APITOKENが無効');
  }
  if(!params.body) {
    err.push('メッセージ本文がない、または、Content-Typeが合ってない');
  }
  if(err.length > 0) {
    sres.send({ status:400, message: err });
    return;
  }
  if(isDev) {
    sres.send({ message: params });
    return;
  }
  chatwork.room(params.room).messages().create(params.body, function(err, msg) {
    if(err) {
      sres.send({ status: 400, message: err });
    } else {
      sres.send({ message: 'OK' });
    }
  });
};

var recieveReloadTokens = function(req, res){
  apiTokens.reload();
  res.send('reload');
};

var recieveSendMessage = function(req, res) {
  var messageItem = getMessageItem(req);
  var sres = SimpleResponse(req, res);
  send(messageItem, sres);
}

var validChatworkConf = function(chatworkConf) {
  if(isDev) return;
  if(!chatworkConf.chatwork_api_token || chatworkConf.chatwork_api_token == 'xxxx') {
    throw 'chatwork_api_token not found in ./config/chatwork.conf';
  }
};

// ----------
// main
// ----------
var isDev = process.argv[3] == 'dev';
var chatworkConf = confLoader.load('./config/chatwork.conf');
validChatworkConf(chatworkConf);
var chatwork = ChatworkAPI(chatworkConf.chatwork_api_token);
console.log(chatworkConf);
var app = express();
app.use('*', function(req, res, next){
  // Content-Typeに合わせて
  // パースを変える
  var getParseAction = function(contentType) {
    if(!contentType) {// GET (no body)
      return bodyParser();
    } else if(contentType.indexOf('json') != -1) {// JSON
      return bodyParser.json();
    } else if(contentType.indexOf('urlencoded') != -1) {// FORM
      return bodyParser.urlencoded({extended: true});
    } else {// PLANE
      return bodyParser.text();
    }
  };

  getParseAction(req.headers['content-type']).apply(bodyParser, arguments);
});

var routerDoc = RouterDoc(app, logger);
// API
routerDoc.get('/ctrl/reload', recieveReloadTokens     , 'APITokenを更新する');
routerDoc.post('/:api/:room', recieveSendMessage, 'POSTでメッセージを送信する');
routerDoc.get('/:api/:room' , recieveSendMessage , 'GETでメッセージを送信する');
routerDoc.listen(process.argv[2] || 3000);

logger.log('## START CHATWORK PROXY ##');
routerDoc.print();

require('fs').writeFileSync('stop.sh', 'kill -9 ' + process.pid);
