var http = require("http");
var multiparty = require("multiparty");
var fs = require("fs");
var parseXml = require("xml2js").parseString;
var smoothe = require("./smoother").smoothe;

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
        parseXml(data, function (err, result)
        {
          if(err)
          {
            sendNegativeResponse(response);
            return;
          }
          
          smoothe(result, response);
        });
      });
    });
  }
  else
    sendNegativeResponse(response);
}

http.createServer(onRequest).listen(8888);
console.log("Server has started.");