var fs = require('fs');

var allFileMap = (function() {
  var allFiles = [];
  var findAll = function(basePath) {
    var files = fs.readdirSync(basePath);
    files.forEach(function(file) {
      if(file.indexOf('.') == 0) return;
      file = basePath + '/' + file;
      if(fs.statSync(file).isFile()) {
        allFiles.push(file);
      } else {
        findAll(file);
      }
    });
  };
  findAll(process.cwd() + '/lib');
  // console.log(allFiles);

  var result = {};
  allFiles.forEach(function(file) {
    result[file.slice(file.lastIndexOf('/') + 1)] = file;
  });

  return result;
})();

var find = function(name) {
  return allFileMap[name];
};

var _require = function(name) {
  return require(find(name));
};

module.exports = {
  find: find,
  require: _require
};
