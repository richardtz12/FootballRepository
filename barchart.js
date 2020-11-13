
//set up canvas and bar sizes
var canvasWidth = 600,
  canvasHeight = 500,
  otherMargins = canvasWidth * 0.1,
  leftMargin = canvasWidth * 0.25,
  maxBarWidth = canvasHeight - - otherMargins - leftMargin
  maxChartHeight = canvasHeight - (otherMargins * 2);

//set up linear scale for data to fit on chart area
var xScale = d3.scale.linear()
              .range([0, maxBarWidth]);

//set up ordinal scale for x variables
var yScale = d3.scale.ordinal();

//add canvas to HTML
var chart = d3.select("body").append("svg")
                          .attr("width",canvasWidth)
                          .attr("height", canvasHeight);

//set up x axis
var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(16); // change this # depending on whether we include preseason, post season

//set up y axis
var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .tickSize(0);

//add in data

d3.xhr("wins.csv").get(function (error, response) {

  //retrieve data
  var dirtyCSV = response.responseText;
  var cleanCSV = dirtyCSV.split('\n').slice(4).join('\n');
  var data = d3.csv.parse(cleanCSV)

  //retrieve title
  var dirtyTitle = dirtyCSV.split('\n').slice(0,1).join('\n');
  var title = dirtyTitle.slice(0,-1);

      //get variable names
      var keys = d3.keys(data[0]);
      var namesTitle = keys[0];     // change index if necessary (depending on where team name is)
      var valuesTitle = keys[1];    // change index depending on where # wins is
      var yearsTitle = keys[2];     // change index if necessary

      //accessing the properties of each object with the variable name through its key
      var values = function(d) {return +d[valuesTitle];};
      var names = function(d) {return d[namesTitle];}

      // find highest value
      var maxValue = d3.max(data, values);

      //set y domain by mapping an array of the variables along x axis
      yScale.domain(data.map(names));

      //set x domain with max value and use .nice() to ensure the y axis is labelled above the max y value
      xScale.domain([0, maxValue]).nice();

//set bar width with rangeBands ([x axis width], gap between bars, gap before and after bars) as a proportion of bar width
yScale.rangeBands([0, maxChartHeight], 0.1, 0.25);

//set up rectangle elements with attributes based on data
var rects = chart.selectAll("rect")
                .data(data)
                .enter()
                .append("rect");

// set up color scale based on team name
// https://teamcolorcodes.com/nfl-team-color-codes/
var colorTeam = d3.scaleOrdinal()
  .domain(["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
  "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
  "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars, Kansas City Chiefs",
  "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings",
  "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets",
  "Oakland Raiders", "Philadelphia Eagles", "Pittsburgh Steelers",
  "San Francisco 49ers", "Seattle Seahawks", "Tampa Bay Buccaneers",
  "Tennessee Titans", "Washington Redskins",
  "St. Louis Rams", "San Diego Chargers"])
  .range(["#97233F", "#A71930" , "#241773", "#C60C30",
  "#0085CA", "#C83803", "#FB4F14", "#FF3C00",
  "#003594", "#FB4F1","#0076B6", "#203731",
  "#03202F", "#A2AAAD", "#006778", "#E31837",
  "#FFC20E", "FFD100", "#008E97", "#4F2683",
  "#002244", "#D3BC8D", "#0B2265", "#125740",
  "#A5ACAF", "#004C54", "#FFB612",
  "#AA0000", "#69BE28", "#D50A0A",
  "#4B92DB", "#773141",
  "#FFD100", "#FFC20E"
  ]); // color corresponds to team

//set up attributes of svg rectangle elements based on attributes
var rectAttributes = rects
                      .attr("x", leftMargin)
                      .attr("y", function (d) {return yScale(d[namesTitle]) + otherMargins; })
                      .attr("width", function (d) {return xScale(d[valuesTitle])})
                      .attr("height", yScale.rangeBand())
                      .attr("fill", function(d, i) {
                        return colorTeam(i)
                      }
                      .on("mouseover", function(d, i) {

                        //change fill
                        d3.select(this)
                              .style("opacity", 0.7);

                        //set up data to show on mouseover
                        var xPosition = (parseFloat(d3.select(this).attr("width")) + leftMargin + 6);
                        var yPosition = parseFloat(d3.select(this).attr("y")) + (parseFloat(d3.select(this).attr("height")) / 2);
                        chart.append("text")
                              .attr("id", "tooltip")
                              .attr("x", xPosition)
                              .attr("y", yPosition)
                              .attr("dy", "0.35em")
                              .attr("text-anchor", "start")
                              .attr("font-family", "sans-serif")
                              .attr("font-size", "12px")
                              .attr("font-weight", "bold")
                              .attr("fill", "black")
                              .text(d[valuesTitle]);
                      })

                      //transition out
                      .on("mouseout", function(d) {
                        d3.select(this)
                          .transition()
                          .duration(250)
                          .style("opacity", 1);
                        d3.select("#tooltip").remove();
                      });

//chart title
chart.append("text")
      .attr("x", canvasWidth / 2)
      .attr("y", otherMargins / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", "black")
      .text(title);

//append x axis
chart.append("g")
      .attr("transform", "translate(" + leftMargin + ", " + (maxChartHeight + otherMargins) + ")")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 1)
      .style("shape-rendering", "crispEdges")
      .call(xAxis)
        .selectAll("text")
        .attr("stroke", "none")
        .attr("fill", "black");

//append y axis
chart.append("g")
      .attr("transform", "translate(" + leftMargin + ", " + otherMargins + ")")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 1)
      .style("shape-rendering", "crispEdges")
      .call(yAxis)
      .selectAll("text")
        //.attr("dx", "-1.15em")
        .attr("stroke", "none")
        .attr("fill", "black")
        //.call(yScale.rangeBand()); //calls wrap function below

  //x axis title
  chart.append("text")
        .attr("x", (maxBarWidth / 2) + leftMargin)
        .attr("y", canvasHeight - (otherMargins / 3))
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(valuesTitle);

  //y axis title
  chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -((maxChartHeight / 2) + otherMargins))
        .attr("y", leftMargin / 4)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(namesTitle);

//chart border - not necessary used for reference for the edge of canvas
var border = chart.append("rect")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", canvasHeight)
                  .attr("width", canvasWidth)
                  .style("stroke", "black")
                  .style("fill", "none")
                  .style("stroke-width", 1);


// update the chart -- these are the bones for building a slider to choose the year
// https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
// still need to figure out how to change graph based on selection


var dataTime = d3.range(0, 10).map(function(d) {
    return new Date(2009 + d, 10, 3);
  });

var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 365)
    .width(300)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default(new Date(2005, 10, 3))
    .on('onchange', val => {
      d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    });


//log anything in the console for debugging
//console.log(yAxis);

});

//line wrap function adapted from "Wrapping Long Labels" - mike bostock
function wrap(text, width) {
text.each(function() {
  var text = d3.select(this),
    words = text.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.1, //em
    y = text.attr("y"),
    dy = parseFloat(text.attr("dy")),
    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
  while (word = words.pop()) {
    line.push(word);
    tspan.text(line.join(" "));
    if (tspan.node().getComputedTextLength() > width) {
      line.pop();
      tspan.text(line.join(" "));
      line = [word];
      tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
    }
  }
})
}

//while the data is being loaded it turns the strings into a number
function type(d) {
d[yName] = +d[yName];
return d;

}
