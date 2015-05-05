var BasicAuth = function(isTrust) {
  if(isTrust.id && isTrust.pass) {
    var authId = isTrust.id;
    var authPass = isTrust.pass;
    isTrust = function(id, pass) {
      return id == authId && pass == authPass;
    };
  }

  var requestAuth = function(res) {
    res.status(401);
    res.set('WWW-Authenticate', 'Basic realm="SECRET AREA"');
    res.end();
  }

  var valid = function(callback) {
    return function(req, res, next) {
      if(!req.headers['authorization']) {
        requestAuth(res);
        return;
      }

      var encoded = req.headers['authorization'].split(' ')[1];
      var row = new Buffer(encoded, 'base64').toString('utf8').split(':');
      var id = row[0];
      var pass = row[1];

      if(!isTrust(id.trim(), pass.trim())) {
        console.log('untrust');
        requestAuth(res);
        return;
      }

      callback(req, res, next);
    }
  };

  return {
    valid: valid
  };
};

module.exports = BasicAuth;
