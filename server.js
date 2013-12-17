var http = require("http");
var multiparty = require("multiparty");
var fs = require("fs");
var smoothe = require("./smoother").smoothe;
var xml2js = require("xml2js");

function sendNegativeResponse(response)
{
    response.writeHead(400, {"Content-Type": "text/plain"});
    response.write("you didn't send a file or something went wrong");
    response.end();
}

function onRequest(request, response) {
  if(request.method == "POST")
  {
    var form = new multiparty.Form();
    var file = "";

    form.on('part', function(part)
    {
      if(part.filename)
      {
        part.on('data', function(buffer){
          file += buffer;
        });
      }
    });

    form.on('close', function(){
      xml2js.parseString(file, function (err, result)
      {
        if(err)
        {
          sendNegativeResponse(response);
          return;
        }
        
        var smoothedData = smoothe(result, response);
        if(smoothedData != null)
        { 
          var xmlBuilder = new xml2js.Builder();
          var xml = xmlBuilder.buildObject(smoothedData);
          response.writeHead(200, {
            "Content-Type": "text/xml",
            "Content-Disposition" : "attachment; filename=smoothed_gps.tcx"
          });
          response.write(xml);
          response.end();
        }
        else
          sendNegativeResponse(response);
      });
    });

    form.parse(request);
  }
  else
    sendNegativeResponse(response);
}

http.createServer(onRequest).listen(8888);
console.log("Server has started.");