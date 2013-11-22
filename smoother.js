function processPoints(points)
{

}

function smoothe(tcxFile, response){
  var activities = tcxFile["TrainingCenterDatabase"]["Activities"][0]["Activity"];

  activities.forEach(function(activity)
  {
    //first get all points from every lap as one single array
    var trackPointCounts = new Array(); //used to remember how many points to put back in each lap
    var points = new Array();
    activity["Lap"].forEach(function(lap)
    {
      var curLapPoints = lap["Track"][0]["Trackpoint"];
      trackPointCounts.push(curLapPoints.length);
      points = points.concat(curLapPoints);
    });

    //smooth them out
    processPoints(points);
    
    //now put them back in the file
    activity["Lap"].forEach(function(lap)
    {
      lap["Track"][0]["Trackpoint"] = points.splice(0, trackPointCounts.shift());
    });
  });

  return tcxFile;
}

exports.smoothe = smoothe;