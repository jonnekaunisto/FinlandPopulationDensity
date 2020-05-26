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
    .domain([1, 5, 10, 15, 30, 60, 90, 100])
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
        .data(topojson.feature(topology, topology.objects.gadm36_FIN_3).features)
        .enter().append("path")
        .attr("fill", function(d) { return color(d.properties.pop_data["2019"] / d.properties.land_data); })
        .attr("d", path);
});

d3.select("#yearSlider").on("onchange", val => {
    console.log(val)
});
/*
var sliderSimple = d3
    .sliderBottom()
    .min(1990)
    .max(2040)
    .width(300)
    .tickFormat(d3.format('.2%'))
    .ticks(5)
    .default(0.015)
    .on('onchange', val => {
        d3.select('p#value-simple').text(d3.format('.2%')(val));
    });

var gSimple = d3
    .selectAll('#slider-simple')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');


console.log(gSimple)

d3.select('p#value-simple').text(d3.format('.2%')(sliderSimple.value()));
*/

//d3.selectAll("#slider-simple").append