var http = require("http");
var multiparty = require("multiparty");
var fs = require("fs");
var smoothe = require("./smoother").smoothe;
var xml2js = require("xml2js");

function filesArrayProperlyFormed(files)
{
  return files != null && files["tcx_file"] != null 
  && files["tcx_file"].length == 1 && files["tcx_file"][0].path != null;
}

function sendNegativeResponse(response)
{
    response.writeHead(400, {"Content-Type": "text/plain"});
    response.write("you didn't send a file or something went wrong");
    response.end();
}

function onRequest(request, response) {
  if(request.method == "POST")
  {
    var form = new multiparty.Form({uploadDir: "/tmp/tcx_files"});
    form.parse(request, function(err, fields, files)
    {
      if(err != null || !filesArrayProperlyFormed(files))
      {
        sendNegativeResponse(response);
        return;
      }

      fs.readFile(files["tcx_file"][0].path, 'utf8', function(err, data)
      {
        fs.unlink(files["tcx_file"][0].path);
        if(err)
        {
          sendNegativeResponse(response);
          return
        }
        xml2js.parseString(data, function (err, result)
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
    });
  }
  else
    sendNegativeResponse(response);
}

http.createServer(onRequest).listen(8888);
console.log("Server has started.");