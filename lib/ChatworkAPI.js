HTTPS = require('https');
var ChatworkAPI = function(token) {
  var get = function(path, body, callback) { return request("GET", path, body, callback); };
  var post = function(path, body, callback) { return request("POST", path, body, callback); };
  var put = function(path, body, callback) { return request("PUT", path, body, callback); };

  var request = function(method, path, body, callback) {
    var headers, options, request;
    headers = {
      "Host": 'api.chatwork.com',
      "X-ChatWorkToken": token
    };
    options = {
      "agent": false,
      "host": 'api.chatwork.com',
      "port": 443,
      "path": "/v1" + path,
      "method": method,
      "headers": headers
    };
    body = new Buffer(body);
    options.headers["Content-Length"] = body.length;
    options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    request = HTTPS.request(options, function(response) {
      var data;
      data = "";
      response.on("data", function(chunk) { return data += chunk });
      response.on("end", function() {
        var e, json;
        if (response.statusCode >= 400) {
          switch (response.statusCode) {
            case 401:
              throw new Error("Invalid access token provided");
              break;
            default:
              console.error("Chatwork HTTPS status code: " + response.statusCode);
              console.error("Chatwork HTTPS response data: " + data);
          }
        }
        if (callback) {
          json = (function() {
            try {
              return JSON.parse(data);
            } catch (_error) {
              e = _error;
              return data || {};
            }
          })();
          return callback(null, json);
        }
      });
      return response.on("error", function(err) {
        console.error("Chatwork HTTPS response error: " + err);
        return callback(err, {});
      });
    });
    request.end(body, 'binary');
    return request.on("error", function(err) {
      return console.error("Chatwork request error: " + err);
    });
  };

  // ChatworkAPI Result
  return {
    my: function() {
      return {
        status: function(callback) {
          return get("/my/status", "", callback);
        },
        tasks: function(opts, callback) {
          var body, params;
          params = [];
          if (opts.assignedBy != null) {
            params.push("assigned_by_account_id=" + opts.assignedBy);
          }
          if (opts.status != null) {
            params.push("status=" + opts.status);
          }
          body = params.join('&');
          return get("/my/tasks", body, callback);
        }
      }
    },

    room: function(roomId) {
      var baseUrl = "/rooms/" + roomId;
      return {
        messages: function() {
          return {
            create: function(text, callback) {
              var body = "body=" + text;
              return post("" + baseUrl + "/messages", body, callback);
            }
          }
        }
      }
    }

  };
};

module.exports = ChatworkAPI;
