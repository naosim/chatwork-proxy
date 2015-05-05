var apiTokens = require(__dirname + '/../APITokens.js')(),
  confLoader = require(__dirname + '/../ConfLoader.js')(),
  ChatworkAPI = require(__dirname + '/../ChatworkAPI.js'),
  SendMessageService = require(__dirname + '/sendmessage/SendMessageService.js'),
  SendMessageAPI = require(__dirname + '/sendmessage/SendMessageAPI.js'),
  ReloadAPITokenAPI = require(__dirname + '/reloadapitoken/ReloadAPITokenAPI.js'),
  isDebug = require(__dirname + '/../isDebug.js');

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

  return {
    sendMessageAPI: sendMessageAPI,
    reloadAPITokenAPI: reloadAPITokenAPI
  };
};

module.exports = setupAPI;
