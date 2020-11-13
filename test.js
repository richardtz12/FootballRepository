
d3.csv("TeamData.csv", function(d) {
  temp = []
  temp.push({
  	axis: "PointsScored";
  	value: d.PointsScored;
  });
  temp.push({
  	axis: "Int";
  	value: d.Int;
  });
  
  return {
    name : d.Team,
    axes : temp
  };
}).then(function(data) {
  console.log(data[0]);
});