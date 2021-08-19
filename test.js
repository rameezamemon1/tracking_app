var request = require("request"),
  zlib = require("zlib");

module.exports = requestWithEncoding = function (options, callback) {
  var req = request.get(options);

  req.on("response", function (res) {
    var chunks = [];
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers["content-encoding"];
      if (encoding == "gzip") {
        zlib.gunzip(buffer, function (err, decoded) {
          callback(err, decoded && decoded.toString());
        });
      } else if (encoding == "deflate") {
        zlib.inflate(buffer, function (err, decoded) {
          callback(err, decoded && decoded.toString());
        });
      } else {
        callback(null, buffer.toString());
      }
    });
  });

  req.on("error", function (err) {
    callback(err);
  });
};
