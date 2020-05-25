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
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeOrRd[9]);

scale = 1200
var projection = d3.geoMercator()
    .translate([-100, 2100])
    .scale([scale]);;

//Define path generator
var path = d3.geoPath()
    .projection(projection);
console.log("IIIII")


d3.json("topo_with_data.json").then(function(topology) {
    console.log(topology)
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.gadm36_FIN_2).features)
        .enter().append("path")
        .attr("fill", function(d) { console.log(d.properties.pop_data["2019"]); return color(d.properties.pop_data["2019"]); })
        .attr("d", path);
});