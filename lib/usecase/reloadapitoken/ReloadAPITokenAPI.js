var ReloadAPITokenAPI = function(apiTokens) {
  var recieveReloadTokens = function(req, res){
    apiTokens.reload();
    res.send('reload');
  };

  return { action: recieveReloadTokens};
};
module.exports = ReloadAPITokenAPI;
