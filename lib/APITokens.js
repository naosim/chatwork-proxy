var requireLib = require(__dirname + '/./util/FindLib.js').require;
var confLoader = requireLib('ConfLoader.js')();

var APITokens = function() {
  var confPath = __dirname + '/../config/allowTokens.conf';

  var apiTokens = confLoader.load(confPath);
  return {
    reload: function() {
      apiTokens = confLoader.load(confPath);
    },
    contains: function(v) {
      return apiTokens[v];
    }
  };
};
module.exports = APITokens;
