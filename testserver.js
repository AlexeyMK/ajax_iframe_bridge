var fs = require('fs');
var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
  if (req.url === "/double") {
    req.addListener("data", function(data) {
      // format of post expected: value=k
      value = parseInt(data.toString().split("=")[1]);
      res.writeHead(200);
      res.end("" + (value * 2));
    });
  } else {
    fs.readFile(req.url.substring(1), function(error, content) {
      if (error) {
        res.writeHead(404);
        res.end("404 file not found");
      } else {
        res.writeHead(200);
        res.end(content);
      }
    });
  }
}).listen(1337, "127.0.0.1", function() {
  //runs when our server is created
  console.log('Server running at http://127.0.0.1:1337/');
});
