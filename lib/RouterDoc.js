var RouterDoc = function(app, logger) {
  logger = logger || console;
  var result = [];
  var listenPort;

  var spacefill = function(str, spaces) {
    return (str + Array(spaces).join(' ')).slice(0, spaces);
  };

  return {
    get: function(path, action, comment) {
      result.push({method: 'GET', path: path, comment: comment});
      app.get(path, action);
    },
    post: function(path, action, comment) {
      result.push({method: 'POST', path: path, comment: comment});
      app.post(path, action);
    },
    listen: function(port) {
      listenPort = port;
      app.listen(port);
    },
    print: function() {
      var maxMethodLength = 0;
      var maxPathLength = 0;
      result.forEach(function(v) {
        maxMethodLength = Math.max(v.method.length, maxMethodLength);
        maxPathLength = Math.max(v.path.length, maxPathLength);
      });

      logger.log('');
      logger.log('SERVER STATUS');
      logger.log('URL: localhost:' + listenPort);
      logger.log('----------------');
      result.forEach(function(v) {
        logger.log(spacefill(v.method, maxMethodLength), spacefill(v.path, maxPathLength), v.comment || '');
      });
      logger.log('----------------');
    }
  }
};
module.exports = RouterDoc;
