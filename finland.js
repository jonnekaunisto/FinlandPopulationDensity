//Sources
//For topojson usage: https://bl.ocks.org/mbostock/5562380

//Define Margin
var margin = { left: 80, right: 80, top: 50, bottom: 50 },
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Define SVG and center it within the margins
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//define the domain of the colors for the counties and the key
var color = d3.scaleThreshold()
    .domain([1, 4, 15, 30, 60, 120, 240, 480, 800])
    .range(d3.schemeOrRd[9]);

// defines what value goes where, so that how long the key is basically
// use scaleSqrt because small values would be too close to each other
var x = d3.scaleSqrt()
    .domain([0, 800])
    .rangeRound([0, 400]);

// position the group for the key and rotate it 90 degrees to make it vertical
var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(650, 75)")

//make the rectangles
g.selectAll("rect")
    .data(color.range().map(function(d) {
        // Returns the extent of values in the domain [x0, x1] for the corresponding value in the range
        console.log("invertExtent")
        console.log(d)

        //the d is the color on the right side and on the left sideis the range such as [1, 4]
        d = color.invertExtent(d);
        console.log(d)

        // if null then get the values from x
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
    }))
    .enter().append("rect")
    .attr("height", 8)
    //set the x value based on the location
    .attr("x", function(d) { return x(d[0]); })
    //set the width based on how long the thing is
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    //fill with the color that its supposed to be
    .attr("fill", function(d) { console.log(d[0]); return color(d[0]); })
    //rotate so that it is vertical
    .attr("transform", "rotate(90)")

//makes the axis and then deletes the .domain parts of it, because thats just a line, but we dont need that since we have our rectangles
g.call(d3.axisRight(x)
        .tickSize(13)
        .tickValues(color.domain()))
    .select(".domain")
    .remove();

//get the position of finland and scale appropriately
var projection = d3.geoMercator()
    .translate([-100, 2100])
    .scale([1200]);;

//Define path generator
var path = d3.geoPath()
    .projection(projection);


d3.json("finland.json").then(function(topology) {
    console.log(topology)

    // set the starting year
    current_year = "2019"

    // creat the tooltip
    var tooltip = svg.append("g")
        .attr("class", "tooltip-group")
        .attr("opacity", 0)

    // creat the rectangle for tooltip
    tooltip.append("rect")
        .attr("class", "tooltip")
        .attr("width", 160)
        .attr("height", 85)
        .attr("x", 0)
        .attr("y", 0)
        .attr("ry", 10)
        .attr("rx", 10)
        .style("fill", "rgb(182, 200, 225)")


    // create the text for the tooltip
    tooltip.append("text")
        .attr("id", "tooltip-region")
        .attr("text-anchor", "middle")
        .attr("dx", 80)
        .attr("dy", 15)
        .attr("font-size", "12px")
        .text("Someplace")

    tooltip.append("text")
        .attr("id", "tooltip-population")
        .attr("dx", 10)
        .attr("dy", 30)
        .attr("font-size", "12px")
        .text("Population: 0999")

    tooltip.append("text")
        .attr("id", "tooltip-area")
        .attr("dx", 10)
        .attr("dy", 45)
        .attr("font-size", "12px")
        .text("Area: 0999")

    tooltip.append("text")
        .attr("id", "tooltip-density")
        .attr("dx", 10)
        .attr("dy", 60)
        .attr("font-size", "12px")
        .text("Density: 0999")

    // render the Finnish map
    regions = makeRegions(topology, current_year, tooltip)


    console.log(regions)


    //find the slider and add a listener
    d3.select("input").on("change", function() {
        current_year = this.value

        //basically rerender the thing
        regions.remove()

        //change the year number on the text
        d3.select("#yearIndicator").text("Year: " + this.value)
        regions = makeRegions(topology, this.value, tooltip)
    })



})

function makeRegions(topology, year, tooltip) {
    var regions = svg.append("g")
        .selectAll("path")
        //pick the topjson feature
        .data(topojson.feature(topology, topology.objects.gadm36_FIN_3).features)
        .enter().append("path")
        //set the id to the region
        .attr("id", function(d) { return d.properties.NAME_3.replace(/ /g, "") })
        //
        .attr("fill", function(d) { return color(d.properties.pop_data[year] / d.properties.land_data); })
        .attr("d", path)
        .style("stroke", "10px")
        .on("mouseover", function(d) {
            d3.select("#" + d.properties.NAME_3.replace(/ /g, "")).attr("stroke", "black")

            // set the information in the tooltip
            tooltip.select("#tooltip-region").text(d.properties.NAME_3)

            tooltip.select("#tooltip-population").text("Population: " + d.properties.pop_data[year])
            tooltip.select("#tooltip-area").text("Area: " + d.properties.land_data + " km^2")
            tooltip.select("#tooltip-density").text("Density: " + (d.properties.pop_data[year] / d.properties.land_data).toFixed(2) + " people/km^2")

            //add animation for the tooltip
            tooltip
                .transition().duration(350)
                .ease(d3.easeLinear)
                .attr("opacity", 1)
        })
        .on("mouseout", function(d) {
            d3.select("#" + d.properties.NAME_3.replace(/ /g, "")).attr("stroke", "none")

            // make the tooltip go away with transition
            tooltip.transition().duration(350)
                .ease(d3.easeLinear)
                .attr("opacity", 0)
                .transition()
                .delay(10)
        })
    return regions
}