var http = require("http");

function start(smoothe) {
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
}

exports.start = start;