function smoothe(tcxFile, response){
  var activities = tcxFile["TrainingCenterDatabase"]["Activities"];
  
  
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(JSON.stringify(activities));
  response.end();
}

exports.smoothe = smoothe;