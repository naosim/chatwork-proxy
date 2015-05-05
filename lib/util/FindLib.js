var execSync = require('exec-sync');
var cmd = 'find ./lib -name ';

var find = function(name) {
  return process.cwd() + '/' + execSync(cmd + name).split('\n')[0].trim();
};

var _require = function(name) {
  return require(find(name));
};

module.exports = {
  find: find,
  require: _require
};
