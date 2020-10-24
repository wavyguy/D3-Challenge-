var svgWidth = 960;
var svgHeight = 800;

var margin = {
    top: 80,
    right: 40,
    bottom: 100,
    left: 80
};

var chartWidth = svgWidth - margin.right - margin.left;
var chartHeight = svgHeight - margin.top - margin.bottom;


// Append Div Class 
var chart = d3.select('#scatter')
    // Append Div Class Chart 
    .append('div').classed('chart', true);

// Append SVG
var svg = chart.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// ChartGroup 
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


// Get Data
d3.csv('assets/data/data.csv').then(function (census) {

    // Console Log 
    console.log(census);
    
    // Census
    census.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Linear Scale 
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(census, d => d.poverty)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(census, d => d.healthcare)])
        .range([chartHeight, 0]);

    // Axis Functions 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axis 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Circles Group
    var circlesGroup = chartGroup.selectAll("circle")
        .data(census)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "Crimson")
        .attr("opacity", ".5");

    // Circle ChartGroup
    chartGroup.selectAll()
        .data(census)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

    // ToolTip
    var toolTip = d3.tip()
        .attr("data-toggle", "tooltip")
        .style("background", "darkblue")
        .style("color", "white")
        .style("text-align", "center")
        .style("border-radius", "6px")
        .style("padding", "5px 10px")
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}%`);
        });


    // ToolTip ChartGroup
    chartGroup.call(toolTip);

    // CirclesGroup Mouseover
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this)
            .transition()
            .duration(5000);
    })
        // onmouseout 
        .on("mouseout", function (data, index) {
            toolTip.hide(data)
                .transition()
                .duration(1000);
        });

    // X Axis Labels 
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lack Healthcare (%)");

    // Y Axis Labels 
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 10})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");


}).catch(function (error) {
    console.log(error);
});
