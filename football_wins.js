// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("football_stats.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d){return(d.Tm)}).keys()
    console.log(allGroup)
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.Year; }))
      .range([ 0, width ]);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(9));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.W; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with first group of the list
    var line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.Tm==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.Year) })
          .y(function(d) { return y(+d.W) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup, startYear, endYear) {
      // Create new data with the selection?
      var dataFilter = data.filter(function(d){return d.Tm==selectedGroup})
      console.log(dataFilter)
      var dataFilter = dataFilter.filter(function(d) { return d.Year >= startYear && d.Year <= endYear})
      var numTicks = dataFilter.length;
      console.log(numTicks)
      x.domain([startYear,endYear])
      xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(numTicks))
      // Give these new data to update line
      console.log(dataFilter)
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y(+d.W) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        startYear = document.getElementById("startYear").value
        endYear = document.getElementById("endYear").value
        update(selectedOption, startYear, endYear)
    })
    d3.select("#startYear").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select("#selectButton").property("value")
      // run the updateChart function with this selected option
      startYear = document.getElementById("startYear").value
      endYear = document.getElementById("endYear").value
      update(selectedOption, startYear, endYear)
  })
  d3.select("#endYear").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select("#selectButton").property("value")
    // run the updateChart function with this selected option
    startYear = document.getElementById("startYear").value
    endYear = document.getElementById("endYear").value
    update(selectedOption, startYear, endYear)
})

})

