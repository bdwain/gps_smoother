

function smoothe(tcxFile, response){
  console.log("smoothe was called.");


  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(querystring.parse(postData).text);
  response.end();
}

exports.smoothe = smoothe;