var requireLib = require(__dirname + '/../util/findLib.js').require;

var apiTokens = requireLib('APITokens.js')(),
  confLoader = requireLib('ConfLoader.js')(),
  ChatworkAPI = requireLib('ChatworkAPI.js'),
  SendMessageService = requireLib('SendMessageService.js'),
  SendMessageAPI = requireLib('SendMessageAPI.js'),
  ReloadAPITokenAPI = requireLib('ReloadAPITokenAPI.js'),
  isDebug = requireLib('isDebug.js'),
  fs = require('fs');

  var ShowLogAPI = function() {
    var showLog = function(req, res) {
      fs.readFile('./nohup.out', function(err, data) {
        res.set('Content-Type', 'text/plain');
        res.send(err || data);
      });
    };

    return { action: showLog };
  };

var setupAPI = function() {
  var validChatworkConf = function(chatworkConf) {
    if(isDebug()) return;
    if(!chatworkConf.chatwork_api_token || chatworkConf.chatwork_api_token == 'xxxx') {
      throw 'chatwork_api_token not found in ./config/chatwork.conf';
    }
  };

  var chatworkConf = confLoader.load('./config/chatwork.conf');
  validChatworkConf(chatworkConf);
  var chatwork = ChatworkAPI(chatworkConf.chatwork_api_token);
  var sendMessageService = SendMessageService(chatwork, apiTokens);
  var sendMessageAPI = SendMessageAPI(sendMessageService);
  var reloadAPITokenAPI = ReloadAPITokenAPI(apiTokens);
  var showLogAPI = ShowLogAPI();

  return {
    sendMessageAPI: sendMessageAPI,
    reloadAPITokenAPI: reloadAPITokenAPI,
    showLogAPI: showLogAPI
  };
};

module.exports = setupAPI;
