var express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  RouterDoc = require('./lib/RouterDoc.js'),
  logger = require('./lib/logger.js'),
  apiTokens = require('./lib/APITokens.js')(),
  confLoader = require('./lib/ConfLoader.js')(),
  ChatworkAPI = require('./lib/ChatworkAPI.js');

var sendRes = function(item, req, res) {
  item.status = item.status || 200;
  logger.log(req.url, 'status:' + item.status, JSON.stringify(item.message));
  res.status(item.status);
  res.send(item.message);
};

var send = function(params, req, res) {
  var err = [];
  if(!apiTokens.contains(params.apitoken)) {
    err.push('APITOKENが無効');
  }
  if(!params.body) {
    err.push('メッセージ本文がない、または、Content-Typeが合ってない');
  }
  if(err.length > 0) {
    sendRes({ status:400, message: err }, req, res);
    return;
  }

  chatwork.room(params.room).messages().create(params.body, function(err, msg) {
    if(err) {
      sendRes({ status: 400, message: err }, req, res);
    } else {
      sendRes({ message: 'OK' }, req, res);
    }
  });
};

var recieveReloadTokens = function(req, res){
  apiTokens.reload();
  res.send('reload');
};

var recieveSendMessageByPost = function(req, res){
  send({
    apitoken: req.params.api,
    room: req.params.room,
    body: req.body.body || req.body
  }, req, res);
};

var recieveSendMessageByGet = function(req, res){
  send({
    apitoken: req.params.api,
    room: req.params.room,
    body: req.query.body
  }, req, res);
};

var validChatworkConf = function(chatworkConf) {
  if(!chatworkConf.chatwork_api_token || chatworkConf.chatwork_api_token == 'xxxx') {
    throw 'chatwork_api_token not found in ./config/chatwork.conf';
  }
};

// ----------
// main
// ----------
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
routerDoc.get('/ctrl/reload', recieveReloadTokens     , 'APITokenを更新する');
routerDoc.post('/:api/:room', recieveSendMessageByPost, 'POSTでメッセージを送信する');
routerDoc.get('/:api/:room' , recieveSendMessageByGet , 'GETでメッセージを送信する');
routerDoc.listen(process.argv[2] || 3000);

logger.log('## START CHATWORK PROXY ##');
routerDoc.print();

require('fs').writeFileSync('stop.sh', 'kill -9 ' + process.pid);
