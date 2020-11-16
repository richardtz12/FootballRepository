var width = 960;
var height = 500;
var adj = 20;

// we are appending SVG first
var svg = d3.select("div#container").append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "-" + adj + " -"+ adj + " " + (width + adj) + " " + (height + adj))
.style("padding", 5)
.style("margin", 5)
.classed("svg-content", true);

var dataset = d3.csv("data.csv");
dataset.then(function(data) {
    data.map(function(d) {
            d.Wins = +d.Wins;
            return d;});
console.log(dataset);

dataset = data.sort(function(a,b){
  return d3.ascending(a.Wins, b.Wins)
})

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
        ]);


var margin = {
    top: 15,
    right: 25,
    bottom: 15,
    left: 60
};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#graphic").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.Wins;
            })]);

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1)
    .domain(data.map(function (d) {
        return d.Team;
    }));

var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");

var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

//append rects
bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
        return y(d.Team);
    })
    .attr("height", y.rangeBand())
    .attr("x", 0)
    .attr("width", function (d) {
        return x(d.value);
    });
    .attr("fill", function(d, i) {
        return colorTeam(i)
    })

//add a value label to the right of each bar
bars.append("text")
    .attr("class", "label")
    //y position of the label is halfway down the bar
    .attr("y", function (d) {
        return y(d.Team) + y.rangeBand() / 2 + 4;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        return x(d.value) + 3;
    })
    .text(function (d) {
        return d.value;
    });


/*
d3.csv("Wins.csv").then(d => chart(d));

function chart(csv) {


  csv.forEach(function(d) {
    year = +d.year;
    wins = +d.wins;
    return d;
  })

  var options = d3.select("#year").selectAll("option")
    .data(year)
    .enter().append("option")
    .text(d => d)

  var svg = d3.select("#chart"),
    margin = {top: 25, bottom: 10, left: 25, right: 25},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand()
    .range([margin.left, width - margin.right])
    .padding(0.1)
    .paddingOuter(0.2)

  var y = d3.scaleLinear()
    .range([height - margin.bottom, margin.top])

  var xAxis = g => g
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))

  var yAxis = g => g
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y))

  svg.append("g")
    .attr("class", "x-axis")

  svg.append("g")
    .attr("class", "y-axis")

  update(d3.select("#year").property("value"), 0)

  function update(year, speed) {

    var data = csv.filter(f => f.year == year)

    y.domain([0, d3.max(data, d => d.Wins)]).nice()

    svg.selectAll(".y-axis").transition().duration(speed)
      .call(yAxis);

    data.sort(d3.select("#sort").property("checked")
      ? (a, b) => b.value - a.value
      : (a, b) => months.indexOf(a.month) - months.indexOf(b.month))

    x.domain(data.map(d => d.month))

    svg.selectAll(".x-axis").transition().duration(speed)
      .call(xAxis)

    var bar = svg.selectAll(".bar")
      .data(data, d => d.month)

    bar.exit().remove();

    bar.enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "steelblue")
      .attr("width", x.bandwidth())
      .merge(bar)
    .transition().duration(speed)
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
  }

  chart.update = update;
}

var select = d3.select("#year")
  .style("border-radius", "5px")
  .on("change", function() {
    chart.update(this.value, 750)
  })

var checkbox = d3.select("#sort")
  .style("margin-left", "45%")
  .on("click", function() {
    chart.update(select.property("value"), 750)
  })





<b>Bar Graph Wins</b>
<svg id="chart" width="650" height="420"></svg>

Choose year:
<select id="year"></select>

<input type="checkbox" id="sort">
Sorted?
*/

