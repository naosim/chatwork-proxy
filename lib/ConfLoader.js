var fs = require('fs');
var ConfLoader = function() {
  var load = function(file) {
    var text = '{' + ('' + fs.readFileSync(file))
      .trim()
      .split('\n')
      .filter(function(v) {
        // not empty, not comment
        return v.trim(v).length > 0 && v.indexOf('#') == -1;
      })
      .map(function(v) {
        var a = v.split('=');
        return '"' + a[0].trim() + '":' + a.slice('1').join('=')
      })
      .join(',') + '}';
      // console.log(text);
    return JSON.parse(text);
  };

  return {
    load: load
  };
};
module.exports = ConfLoader;
