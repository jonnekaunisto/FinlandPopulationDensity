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

//Define map projection
/*
var projection = d3.geoEquirectangular()
    .translate([(width - 2200) / 2, (height + margin.top + margin.bottom + 5600) / 2])
    .scale([2500]);
*/
/*
scale = 700
    //600, 1100, 200
    //700, 1250, 150


var projection = d3.geoMercator()
    .translate([150, 1250])
    .scale([scale]);;


//Define path generator
var path = d3.geoPath()
    .projection(projection);




console.log("here")
    //Load in GeoJSON data
    //"another_finland/gadm36_FIN_0.json"
d3.json("low_res/gadm36_FIN_0.json").then(function(json) {
    //Bind data and create one path per GeoJSON feature
    console.log(json)

    map = svg.append("g").attr("class", "map")
    map.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "blue")
        .style("stroke", "black")
        .style("stroke-width", "1px")

});
*/

scale = 1200


var projection = d3.geoMercator()
    .translate([-100, 2100])
    .scale([scale]);;

//Define path generator
var path = d3.geoPath()
    .projection(projection);
console.log("IIIII")


d3.json("topo.json").then(function(topology) {
    console.log(topology)
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.gadm36_FIN_2).features)
        .enter().append("path")
        .attr("fill", "blue")
        .attr("d", path);
});