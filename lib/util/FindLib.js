var fs = require('fs');

var allFileMap = (function() {
  var findAll = function(basePath, filters) {
    filters = filters || [];
    var result = [];
    var _findAll = function(basePath) {
      var files = fs.readdirSync(basePath);
      files.forEach(function(file) {
        for(var i = 0; i < filters.length; i++) if(!filters[i](file)) return;
        file = basePath + '/' + file;
        if(fs.statSync(file).isFile()) {
          result.push(file);
        } else {
          _findAll(file);
        }
      });
    };

    _findAll(basePath);
    return result;
  };
  var ignoreHiddenDir = function(file) { return file.indexOf('.') != 0; };
  var ignoreNodeModules = function(file) { return file != 'node_modules'; };

  var allFiles = findAll(process.cwd(), [ignoreHiddenDir, ignoreNodeModules]);

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
