var express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  RouterDoc = require('./lib/RouterDoc.js'),
  logger = require('./lib/logger.js'),
  setupAPI = require('./lib/usecase/SetupAPI.js'),
  CycleLogCopy = require('./lib/CycleLogCopy.js');

var app = express();

// Switch parse method by Content-Type
app.use('*', function(req, res, next){
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

// API
var routerDoc = RouterDoc(app, logger);
var api = setupAPI();
routerDoc.get( '/ctrl/reload', api.reloadAPITokenAPI.action, 'APITokenを更新する');
routerDoc.post('/:api/:room' , api.sendMessageAPI.action   , 'POSTでメッセージを送信する');
routerDoc.get( '/:api/:room' , api.sendMessageAPI.action   , 'GETでメッセージを送信する');
routerDoc.listen(process.argv[2] || 3000);

logger.log('## START CHATWORK PROXY ##');
routerDoc.print();

// create stop.sh
fs.writeFileSync('stop.sh', 'kill -9 ' + process.pid);

// log
CycleLogCopy().runByDay();
