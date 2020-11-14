// Global functions called when select elements changed
function onXScaleChanged() {
    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value
    // Update chart
    updateChart();
}

function onYScaleChanged() {
    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value
    // Update chart
    updateChart();
}

// Load data and use this function to process each row
function dataPreprocessor(row) {
    return {
        'Player': row['Player'],
        // 'Tm': row['Tm'],
        'Cmp%': +row['Cmp%'],
        'Yds': +row['Yds'],
        'TD': +row['TD'],
        'Int': +row['Int'],
        'GWD': +row['GWD'],
        'Season': row['Season'],
        'Tm': row['Tm']
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Create groups for the x- and y-axes
var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, chartHeight]+')');
var yAxisG = chartG.append('g')
    .attr('class', 'y axis');

d3.csv('QB_data.csv', dataPreprocessor).then(function(dataset) {
    // **** Your JavaScript code goes here ****
    players = dataset;

    xScale = d3.scaleLinear()
        .range([0, chartWidth]);

    yScale = d3.scaleLinear()
        .range([chartHeight, 0]);


    // List of groups (here I have one group per column)
    var playerGroup = d3.map(dataset, function(d){return(d.Player)}).keys()
    // List of metrics
    var metricGroup = [dataset.TD, dataset.Yds, dataset.Int, dataset.QBR, dataset.GWD]

    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(playerGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    domainMap = {};
    dataset.columns.forEach(function(column) {
        domainMap[column] = d3.extent(dataset, function(data_element){
            return data_element[column];
        });
    });


    // Create global object called chartScales to keep state
    chartScales = {x: 'Season', y: 'TD'};
    updateChart();



    // var dots = chartG.selectAll('.dot')
    //     .data(players);
    // var dotsEnter = dots.enter()
    //     .append('g')
    //     .attr('class', 'dot')
    //     // .attr('transform', function(d) {
    //     //     var tx = xScale(d[chartScales.x]);
    //     //     var ty = yScale(d[chartScales.y]);
    //     //     return 'translate('+[tx, ty]+')';
    //     // });

    // // dots.attr('transform', function(d) {
    // //     var tx = xScale(d[chartScales.x]);
    // //     var ty = yScale(d[chartScales.y]);
    // //     return 'translate('+[tx, ty]+')';
    // // });

    // dots.merge(dotsEnter)
    // .attr('transform', function(d) {
    //     var tx = xScale(d[chartScales.x]);
    //     var ty = yScale(d[chartScales.y]);
    //     return 'translate('+[tx, ty]+')';
    // });

    // dotsEnter.append('circle')
    //     .attr('r', 3);

    // // updateChart();





    // // updateChart();


    // // Activity 2
    // dotsEnter.append('text')
    //     .attr('y', -10)
    //     .text(function(d) {
    //         return d.name;
    //     });


    // // Activity 3
    // xAxisG.transition()
    //     .duration(750)
    //     .call(d3.axisBottom(xScale));
    // yAxisG.transition()
    //     .duration(750)
    //     .call(d3.axisLeft(yScale));

    // dots.merge(dotsEnter)
    //     .transition()
    //     .duration(750)
    //     .attr('transform', function(d) {
    //         var tx = xScale(d[chartScales.x]);
    //         var ty = yScale(d[chartScales.y]);
    //         return 'translate('+[tx, ty]+')';
    //     });

});


function updateChart() {
    // **** Draw and Update your chart here ****


    // Update the scales based on new data attributes
    yScale.domain(domainMap[chartScales.y]).nice();
    xScale.domain(domainMap[chartScales.x]).nice();

    xAxisG.call(d3.axisBottom(xScale));
    yAxisG.call(d3.axisLeft(yScale));

    // Activity 3
    xAxisG.transition()
        .duration(750)
        .call(d3.axisBottom(xScale));
    yAxisG.transition()
        .duration(750)
        .call(d3.axisLeft(yScale));

    var dots = chartG.selectAll('.dot')
        .data(players);
    var dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')

    // Activity 2
    // dotsEnter.append('text')
    //     .attr('y', -10)
    //     .text(function(d) {
    //         return d.Player;
    //     });

    dots.merge(dotsEnter)
    .transition()
    .duration(500)
    .attr('transform', function(d) {
        var tx = xScale(d[chartScales.x]);
        var ty = yScale(d[chartScales.y]);
        return 'translate('+[tx, ty]+')';
    });

    dotsEnter.append('circle')
        .attr('r', 3);

    dots.merge(dotsEnter)
        .transition()
        .duration(750)
        .attr('transform', function(d) {
            var tx = xScale(d[chartScales.x]);
            var ty = yScale(d[chartScales.y]);
            return 'translate('+[tx, ty]+')';
        });

}
// Remember code outside of the data callback function will run before the data loads
