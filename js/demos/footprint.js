var width = 960,
	height = 600;
var activeClr = "#FEE5D9";

var proj = d3.geo.mercator().center([105, 38]).scale(750).translate([width / 2, height / 2]);
var path = d3.geo.path().projection(proj);

var svg = d3.select("#map-div").append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("id", "footprint-map");

var g = svg.append("g");

queue()
	.defer(d3.json, "../../data/cn.topojson") // load provinces
	.defer(d3.json, "../../data/cn-cities.topojson") // load cities
	.await(makeMap);

function makeMap(error, provinces, cities) {		
	g.selectAll("path")
		.data(topojson.feature(provinces, provinces.objects.collection).features)
		.enter().append("path")
		.attr("d", path)
		.attr("class", "map-feature")
		.property("checked", false)
		.on("click", clicked);

	g.append("path")
		.datum(topojson.mesh(cities, cities.objects.collection, function(a, b) { return a !== b; }))
		.attr("class", "mesh-inner")
		.attr("d", path);
}

function clicked(d) {
	var active = d3.select(this);
	if (active.property("checked") === false) {
		active.property("checked", true).style("fill", activeClr);
	} else {
		active.property("checked", false).style("fill", "#ccc");
	}
}

function changeClr(clr) {
	activeClr = clr;
}

function saveAsPng() {
	console.log("Saving");
	saveSvgAsPng(document.getElementById("footprint-map"), "footprint.png");
}
