
draw("#my_dataviz",".radarChart","#my_dataviz_player");

function draw(selectdiv1,selectdiv2,selectdiv3){
  rich(selectdiv1);
  dhav(selectdiv2);
  dylan(selectdiv3);

  d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    var selectedplayer = d3.select("#selectButton_player").property("value")
    // run the updateChart function with this selected option
    startYear = document.getElementById("startYear").value
    endYear = document.getElementById("endYear").value
    var category = d3.select("#categoryButton").property("value")
    dylan.update(selectedplayer, startYear, endYear, category)
    rich.update(selectedOption, startYear, endYear)
    dhav.update(selectedOption, startYear, endYear)
})
  d3.select("#startYear").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select("#selectButton").property("value")
    var selectedplayer = d3.select("#selectButton_player").property("value")
    // run the updateChart function with this selected option
    startYear = document.getElementById("startYear").value
    endYear = document.getElementById("endYear").value
    var category = d3.select("#categoryButton").property("value")
    dylan.update(selectedplayer, startYear, endYear, category)
    rich.update(selectedOption, startYear, endYear)
    dhav.update(selectedOption, startYear, endYear)
  })
  d3.select("#endYear").on("change", function(d) {
  // recover the option that has been chosen
  var selectedOption = d3.select("#selectButton").property("value")
  var selectedplayer = d3.select("#selectButton_player").property("value")
  // run the updateChart function with this selected option
  startYear = document.getElementById("startYear").value
  endYear = document.getElementById("endYear").value
  var category = d3.select("#categoryButton").property("value")
  dylan.update(selectedplayer, startYear, endYear, category)
  rich.update(selectedOption, startYear, endYear)
  dhav.update(selectedOption, startYear, endYear)
  })

function dylan(selectdiv3){

      var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 460 - margin.left - margin.right,
      height = 360 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select(selectdiv3)
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
          d3.select("#selectButton_player")
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
              //    .on("mouseover", mouseover)
              //    .on("mousemove", mousemove)
              //    .on("mouseleave", mouseleave)


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
                  //    .on("mouseover", mouseover)
                  //    .on("mousemove", mousemove)
                  //    .on("mouseleave", mouseleave)

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
          dylan.update = update;
          // When the button is changed, run the updateChart function
          d3.select("#selectButton_player").on("change", function(d) {
              // recover the option that has been chosen
              var selectedOption = d3.select(this).property("value")
              // run the updateChart function with this selected option
              startYear = document.getElementById("startYear").value
              endYear = document.getElementById("endYear").value
              var category = d3.select("#categoryButton").property("value")

              update(selectedOption, startYear, endYear, category)
          })
      /*   d3.select("#startYear").on("change", function(d) {
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
      })*/
      d3.select("#categoryButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select("#selectButton_player").property("value")
        // run the updateChart function with this selected option
        startYear = document.getElementById("startYear").value
        endYear = document.getElementById("endYear").value
        var category = d3.select("#categoryButton").property("value")
        update(selectedOption, startYear, endYear, category)
      })

      })
}

    function rich(selectdiv1){
      // set the dimensions and margins of the graph
      var margin = {top: 10, right: 30, bottom: 30, left: 60},
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select(selectdiv1)
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      var Tooltip = d3.select(selectdiv1)
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
          .html("Wins:" + d.W + "<br>" + "Losses:" + d.L + "<br>" + "Win Loss Percentage:" + d.WL * 100 + "%" + "<br>" + "Points For:" + d.PF + "<br>" + "Points Against:" + d.PA + "  ")
          .style("left", (d3.mouse(this)[0]+70) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
      }
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


          d3.select('body')
            .select('svg')
            .append('text')
            .attr('class', 'x label')
            .attr('transform', 'translate(250,720)')
            .text("Habital Zone Distance")
            .attr("fill", "white")
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

          svg
          .selectAll('circle')
          .data(data.filter(function(d){return d.Tm==allGroup[0]}))
          .enter()
          .append('circle')
            .attr('cx', function(d) {return x(d.Year)})
            .attr('cy', function(d) {return y(+d.W)})
            .attr('r',7)
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 3)
            .attr("fill", "white")
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave);

          //update("Los Angeles Chargers","2010","2019");
          // A function that update the chart
          function update(selectedGroup, startYear, endYear) {
            // Create new data with the selection?

            var dataFilter = data.filter(function(d){return d.Tm==selectedGroup})
            console.log(dataFilter)
            var dataFilter = dataFilter.filter(function(d) { return d.Year >= startYear && d.Year <= endYear})
            var numTicks = dataFilter.length;
            console.log(numTicks)
            x.domain([startYear,endYear])
            if (numTicks == 1) {
              dataFilter.push(dataFilter[0])
              dataFilter[1]
            }
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(numTicks - 1))
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

            svg
            .selectAll('circle')
            .data(dataFilter)
            .enter()
            .append('circle')
              .attr('cx', function(d) {return x(d.Year)})
              .attr('cy', function(d) {return y(+d.W)})
              .attr('r',7)
              .attr("stroke", "#69b3a2")
              .attr("stroke-width", 3)
              .attr("fill", "white")
         //   .on("mouseover", mouseover)
         //   .on("mousemove", mousemove)
         //   .on("mouseleave", mouseleave)

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
              .attr("cx", function(d) { return x(+d.Year) })
              .attr("cy", function(d) { return y(+d.W) })
              .attr('r',7)
              .attr("stroke", "#69b3a2")
              .attr("stroke-width", 3)
              .attr("fill", "white")
         //   .on("mouseover", mouseover)
         //   .on("mousemove", mousemove)
         //   .on("mouseleave", mouseleave)

            // svg.selectAll('circle')
            // .data(dataFilter)
            // .exit()
            // .remove()
          }
          rich.update = update;
          // When the button is changed, run the updateChart function
  /*        d3.select("#selectButton").on("change", function(d) {
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
*/
      })
  }

  function dhav(selectdiv2){


      //////////////////////////////////////////////////////////////
      //////////////////////// Set-Up //////////////////////////////
      //////////////////////////////////////////////////////////////

        var margin = {top: 50, right: 100, bottom: 100, left: 100},
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);



      var color = d3.scale.ordinal()
        .range(["#EDC951","#CC333F","#00A0B0"]);

      var radarChartOptions = {
        w: width *0.70,
        h: height *0.70,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: color
      };
      //Call function to draw the Radar chart



d3.csv("TeamData.csv", function(d) {
  temp = [];

  temp.push({
    axis: "PointsScored",
    value: +d.PointsScored
  });

  temp.push({
    axis: "Int",
    value: +d.Int
  });

  temp.push({
    axis: "TotalYds",
    value: +d.TotalYds
  });


  temp.push({
    axis: "PassYds",
    value: +d.PassYds
  });

  temp.push({
    axis: "PassTD",
    value: +d.PassTD
  });

  temp.push({
    axis: "RushYds",
    value: +d.RushYds
 });
  temp.push({
    axis: "RushTD",
    value: +d.RushTD
 });

  return {
    name : d.Team,
    Year : +d.Season,
    value: temp
  };
},
function(error, rows){
   //console.log(rows);

   var data = rows.filter(function(d){return d.name=="Los Angeles Rams"});
      var data = data.filter(function(d){return d.Year==2019})
      console.log(data)
      datum = [];
      datum.push(data[0]['value']);
      console.log(datum);
      RadarChart(selectdiv2, datum, radarChartOptions);

   var allGroup = d3.map(rows, function(d){return(d.name)}).keys()
   //console.log(allGroup)
   d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button


   function update(selectedGroup, startYear, endYear){
      var data = rows.filter(function(d){return d.name==selectedGroup});
      console.log(startYear,endYear)
      var data = data.filter(function(d){return d.Year >= startYear && d.Year <= endYear})
      console.log(data)
      var temp = Math.floor(Math.random() * (data.length - 0) + 0)
      console.log(temp," temp")
      datum = [];
      datum.push(data[temp]['value']);
      console.log(datum);
      RadarChart(selectdiv2, datum, radarChartOptions);
   }
   dhav.update = update;
/*
  d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        startYear = document.getElementById("startYear").value
        endYear = document.getElementById("endYear").value
        updateD(selectedOption, startYear, endYear)
        updateR(selectedOption, startYear, endYear)
    })
  d3.select("#startYear").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select("#selectButton").property("value")
      // run the updateChart function with this selected option
      startYear = document.getElementById("startYear").value
      endYear = document.getElementById("endYear").value
      updateD(selectedOption, startYear, endYear)
      updateR(selectedOption, startYear, endYear)
  })
  d3.select("#endYear").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select("#selectButton").property("value")
    // run the updateChart function with this selected option
    startYear = document.getElementById("startYear").value
    endYear = document.getElementById("endYear").value
    updateD(selectedOption, startYear, endYear)
    updateR(selectedOption, startYear, endYear)
  })*/

});




function RadarChart(id, data, options) {
  var cfg = {
   w: 600,        //Width of the circle
   h: 600,        //Height of the circle
   margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
   levels: 3,       //How many levels or inner circles should there be drawn
   maxValue: 0,       //What is the value that the biggest circle will represent
   labelFactor: 1.25,   //How much farther than the radius of the outer circle should the labels be placed
   wrapWidth: 60,     //The number of pixels after which a label needs to be given a new line
   opacityArea: 0.35,   //The opacity of the area of the blob
   dotRadius: 4,      //The size of the colored circles of each blog
   opacityCircles: 0.1,   //The opacity of the circles of each blob
   strokeWidth: 2,    //The width of the stroke around each blob
   roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
   color: d3.scale.category10() //Color function
  };

  //Put all of the options into a variable called cfg
  if('undefined' !== typeof options){
    for(var i in options){
    if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
    }//for i
  }//if

  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

  var allAxis = (data[0].map(function(i, j){return i.axis})), //Names of each axis
    total = allAxis.length,         //The number of different axes
    radius = Math.min(cfg.w/2, cfg.h/2),  //Radius of the outermost circle
    Format = d3.format('%'),        //Percentage formatting
    angleSlice = Math.PI * 2 / total;   //The width in radians of each "slice"

  //Scale for the radius
  var rScale = d3.scale.linear()
    .range([0, radius])
    .domain([0, maxValue]);

  /////////////////////////////////////////////////////////
  //////////// Create the container SVG and g /////////////
  /////////////////////////////////////////////////////////

  //Remove whatever chart with the same id/class was present before
  d3.select(id).select("svg").remove();

  //Initiate the radar chart SVG
  var svg = d3.select(id).append("svg")
      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar"+id);
  //Append a g element
  var g = svg.append("g")
      .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

  /////////////////////////////////////////////////////////
  ////////// Glow filter for some extra pizzazz ///////////
  /////////////////////////////////////////////////////////

  //Filter for the outside glow
  var filter = g.append('defs').append('filter').attr('id','glow'),
    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

  /////////////////////////////////////////////////////////
  /////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////

  //Wrapper for the grid & axes
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid.selectAll(".levels")
     .data(d3.range(1,(cfg.levels+1)).reverse())
     .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function(d, i){return radius/cfg.levels*d;})
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter" , "url(#glow)");

  //Text indicating at what % each level is
  axisGrid.selectAll(".axisLabel")
     .data(d3.range(1,(cfg.levels+1)).reverse())
     .enter().append("text")
     .attr("class", "axisLabel")
     .attr("x", 4)
     .attr("y", function(d){return -d*radius/cfg.levels;})
     .attr("dy", "0.4em")
     .style("font-size", "10px")
     .attr("fill", "#737373")
     .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

  /////////////////////////////////////////////////////////
  //////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////

  //Create the straight lines radiating outward from the center
  var axis = axisGrid.selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");
  //Append the lines
  axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
    .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  //Append the labels at each axis
  axis.append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
    .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
    .text(function(d){return d})
    .call(wrap, cfg.wrapWidth);

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  var radarLine = d3.svg.line.radial()
    .interpolate("linear-closed")
    .radius(function(d) { return rScale(d.value); })
    .angle(function(d,i) {  return i*angleSlice; });

  if(cfg.roundStrokes) {
    radarLine.interpolate("cardinal-closed");
  }

  //Create a wrapper for the blobs
  var blobWrapper = g.selectAll(".radarWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarWrapper");

  //Append the backgrounds
  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", function(d,i) { return radarLine(d); })
    .style("fill", function(d,i) { return cfg.color(i); })
    .style("fill-opacity", cfg.opacityArea)
    .on('mouseover', function (d,i){
      //Dim all blobs
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", 0.1);
      //Bring back the hovered over blob
      d3.select(this)
        .transition().duration(200)
        .style("fill-opacity", 0.7);
    })
    .on('mouseout', function(){
      //Bring back all blobs
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  //Create the outlines
  blobWrapper.append("path")
    .attr("class", "radarStroke")
    .attr("d", function(d,i) { return radarLine(d); })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function(d,i) { return cfg.color(i); })
    .style("fill", "none")
    .style("filter" , "url(#glow)");

  //Append the circles
  blobWrapper.selectAll(".radarCircle")
    .data(function(d,i) { return d; })
    .enter().append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
    .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
    .style("fill", function(d,i,j) { return cfg.color(j); })
    .style("fill-opacity", 0.8);

  /////////////////////////////////////////////////////////
  //////// Append invisible circles for tooltip ///////////
  /////////////////////////////////////////////////////////

  //Wrapper for the invisible circles on top
  var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
    .data(function(d,i) { return d; })
    .enter().append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius*1.5)
    .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
    .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function(d,i) {
      newX =  parseFloat(d3.select(this).attr('cx')) - 10;
      newY =  parseFloat(d3.select(this).attr('cy')) - 10;

      tooltip
        .attr('x', newX)
        .attr('y', newY)
        .text(Format(d.value))
        .transition().duration(200)
        .style('opacity', 1);
    })
    .on("mouseout", function(){
      tooltip.transition().duration(200)
        .style("opacity", 0);
    });

  //Set up the small tooltip for when you hover over a circle
  var tooltip = g.append("text")
    .attr("class", "tooltip")
    .style("opacity", 0);

  /////////////////////////////////////////////////////////
  /////////////////// Helper Function /////////////////////
  /////////////////////////////////////////////////////////

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text
  function wrap(text, width) {
    text.each(function() {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.4, // ems
      y = text.attr("y"),
      x = text.attr("x"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
      line.pop();
      tspan.text(line.join(" "));
      line = [word];
      tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
    });
  }//wrap
}//RadarChart

  }
}
