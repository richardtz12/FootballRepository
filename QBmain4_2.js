// function onYScaleChanged() {
//     var select = d3.select('#yButton').node();
//     // Get current value of select element, save to global chartScales
//     chartScales.y = select.options[select.selectedIndex].value
//     // Update chart
//     updateChart();
// }

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 100},
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

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[margin.left, margin.top]+')');

// Create groups for the x-axis and y-axis
var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, height]+')');
var yAxisG = chartG.append('g')
    .attr('class', 'y axis');

//Read the data
d3.csv("QB_data.csv", function(data) {
    console.log(data)

    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d){return(d.Player)}).keys().sort(d3.ascending)
    var yGroup = ['TD', 'Yds', 'GWD', 'Int', 'Cmp%']
    console.log(yGroup)

    console.log(allGroup)
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
        .data(allGroup)
      .enter()
        .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // add options to y axis button
    d3.select("#categoryButton")
      .selectAll('myOptions')
        .data(yGroup)
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
      .domain(d3.extent(data, function(d) { return d.Season; }))
      .range([ 0, width ]);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(9));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.TD; })])
      .range([ height, 0 ]);
    var yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with first group of the list
    var line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.Player==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.Season) })
          .y(function(d) { return y(+d.TD) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 4)
        .style("fill", "none")

    var Tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip
            .style("opacity", 1)
    }
    var mousemove = function(d) {
        Tooltip
        Tooltip
        .html("Team: " + d.Tm + "<br>" + "Touchdowns: " + d.TD + "<br>" + "Yards: " + d.Yds + "<br>" + "Game Winning Drives: " + d.GWD * 100 + "<br>" + "Interceptions: " + d.Int + "<br>" + "Completion Percentage: " + d.Cmpp + "%")
        .style("left", (d3.mouse(this)[0]+70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
    }

    svg
        .selectAll('circle')
        .data(data.filter(function(d){return d.Player==allGroup[0]}))
        .enter()
        .append('circle')
            .attr('cx', function(d) {return x(d.Season)})
            .attr('cy', function(d) {return y(+d.TD)})
            .attr('r',7)
            .style('fill', 'black')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


    // From QBmain3.js
    chartScales = {x: 'Season', y: 'TD'};
    playerDict = {play: 'A.J. McCarron'}

    // A function that update the chart
    function update(selectedPlayer, startYear, endYear, category) {
        // Create new data with the selection?
        console.log("hi")
        var dataFilter = data.filter(function(d){return d.Player==selectedPlayer})
        console.log(dataFilter)
        // console.log(data.columns[Yds])
        var dataFilter = dataFilter.filter(function(d) { return d.Season >= startYear && d.Season <= endYear})
        // var numTicks = dataFilter.length;
        var numTicks = endYear - startYear    // CHANGED FROM ROBERT'S CODE: TELL HIM
        console.log(numTicks)
        x.domain([startYear,endYear])
        xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(numTicks))

        
        // Give these new data to update line
        console.log(dataFilter)
        console.log("hi")
        console.log(category)
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) { return x(d.Season) })
                // .y(function(d) { return y(+d.Int) })
                .y(function(d) { 
                  if (category == "Int") { 
                    y.domain([0, d3.max(data, function(d) { return +d.Int; })])
                    .range([ height, 0 ]);
                    yAxis.transition().duration(1000).call(d3.axisLeft(y))
                    return y(d.Int)
                  }
                  if (category == "Yds") { 
                    y.domain([0, d3.max(data, function(d) { return +d.Yds; })])
                    .range([ height, 0 ]);
                    yAxis.transition().duration(1000).call(d3.axisLeft(y))
                    return y(d.Yds)
                  }
                  if (category == "GWD") { 
                    y.domain([0, d3.max(data, function(d) { return +d.GWD; })])
                    .range([ height, 0 ]);
                    yAxis.transition().duration(1000).call(d3.axisLeft(y))
                    return y(d.GWD)
                  }
                  if (category == "TD") { 
                    y.domain([0, d3.max(data, function(d) { return +d.TD; })])
                    .range([ height, 0 ]);
                    yAxis.transition().duration(1000).call(d3.axisLeft(y))
                    return y(d.TD)
                  }
                  if (category == "Cmp%") { 
                    y.domain([0, d3.max(data, function(d) { return +d.Cmpp; })])
                    .range([ height, 0 ]);
                    yAxis.transition().duration(1000).call(d3.axisLeft(y))
                    return y(d.Cmpp)
                  }
                }) 
            )
            .attr("stroke", function(d){ return myColor(selectedPlayer) })

        // dot
        //     .data(dataFilter)
        //     .transition()
        //     .duration(1000)
        //         .attr("cx", function(d) { return x(+d.Season) })
        //         .attr("cy", function(d) { return y(+d.TD) })

        svg
            .selectAll('circle')
            .data(dataFilter)
            .enter()
            .append('circle')
                .attr('cx', function(d) {return x(d.Season)})
                .attr('cy', function(d) {
                  if (category == "Int") {
                    return y(+d.Int)
                  }
                  if (category == "Yds") { 
                    return y(+d.Yds)
                  }
                  if (category == "GWD") { 
                    return y(+d.GWD)
                  }
                  if (category == "TD") { 
                    return y(+d.TD)
                  }
                  if (category == "Cmp%") { 
                    return y(+d.Cmpp)
                  }
                })
                // .attr('cy', function(d) {return y(+d.Int)})
                .attr('r',7)
                .style('fill', 'black')
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

        svg
            .selectAll('circle')
            .data(dataFilter)
            .exit()
            .remove()

        svg
            .selectAll('circle')
            .data(dataFilter)
            .transition()
            .duration(1000)
                .attr("cx", function(d) { return x(+d.Season) })
                .attr('cy', function(d) {
                  if (category == "Int") { 
                    return y(+d.Int)
                  }
                  if (category == "Yds") { 
                    return y(+d.Yds)
                  }
                  if (category == "GWD") { 
                    return y(+d.GWD)
                  }
                  if (category == "TD") { 
                    return y(+d.TD)
                  }
                  if (category == "Cmp%") { 
                    return y(+d.Cmpp)
                  }
                })}
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        startYear = document.getElementById("startYear").value
        endYear = document.getElementById("endYear").value
        var category = d3.select("#categoryButton").property("value")

        update(selectedOption, startYear, endYear, category)
    })
    d3.select("#startYear").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select("#selectButton").property("value")
      // run the updateChart function with this selected option
      startYear = document.getElementById("startYear").value
      endYear = document.getElementById("endYear").value
      var category = d3.select("#categoryButton").property("value")

      update(selectedOption, startYear, endYear, category)
  })
  d3.select("#endYear").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select("#selectButton").property("value")
    // run the updateChart function with this selected option
    startYear = document.getElementById("startYear").value
    endYear = document.getElementById("endYear").value
    var category = d3.select("#categoryButton").property("value")

    update(selectedOption, startYear, endYear, category)
})
d3.select("#categoryButton").on("change", function(d) {
  // recover the option that has been chosen
  var selectedOption = d3.select("#selectButton").property("value")
  // run the updateChart function with this selected option
  startYear = document.getElementById("startYear").value
  endYear = document.getElementById("endYear").value
  var category = d3.select("#categoryButton").property("value")
  update(selectedOption, startYear, endYear, category)
})

})



