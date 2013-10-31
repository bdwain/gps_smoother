var http = require("http");
var smoothe = require("./smoother").smoothe;

function onRequest(request, response) {
  var postData = "";
  request.setEncoding("utf8");
  request.addListener("data", function(postDataChunk) {
    postData += postDataChunk;
  });

  request.addListener("end", function() {
    smoothe(postData, response);
  });
}

http.createServer(onRequest).listen(8888);
console.log("Server has started.");