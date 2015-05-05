var requireLib = require(__dirname + '/../../util/FindLib.js').require;
var isDebug = requireLib('isDebug.js');

var SendMessageService = function(chatwork, apiTokens) {
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
    if(isDebug()) {
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

  return {send: send};
};

module.exports = SendMessageService;
