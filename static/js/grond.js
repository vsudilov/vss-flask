$(document).ready(function(){

var sourceData = [
  {
    "png": {
      "x":8.7,
      "y":24.7,
      "r":10,
    },
    "sourceNumber": 1,
    "sed": {

    },
  },
  {
    "png": {
      "x":62.3,
      "y":74.3,
      "r":10,
    },
    "sourceNumber": 2
  },
  {
    "png": {
      "x":28.7,
      "y":120,
      "r":10,
    },
    "sourceNumber": 3
  },
  {
    "png": {
      "x":59.7,
      "y":160,
      "r":10,
    },
    "sourceNumber": 4
  },
  {
    "png": {
      "x":96.3,
      "y":175,
      "r":10,
    },
    "sourceNumber": 5
  },
  {
    "png": {
      "x":146,
      "y":134.3,
      "r":7,
    },
    "sourceNumber": 6
  },
  {
    "png": {
      "x":162,
      "y":133,
      "r":14,
    },
    "sourceNumber": 7
  },
  {
    "png": {
      "x":191,
      "y":32.7,
      "r":10,
    },
    "sourceNumber": 8
  },
  {
    "png": {
      "x":242.3,
      "y":30,
      "r":10,
    },
    "sourceNumber": 9
  },
  {
    "png": {
      "x":271.7,
      "y":35.7,
      "r":10,
    },
    "sourceNumber": 10
  },
  {
    "png": {
      "x":72.2,
      "y":122,
      "r":10,
    },
    "sourceNumber": 11
  },
]
var bands = {
  'g':459,
  'r':622,
  'i':764,
  'z':899,
  'J':1240,
  'H':1647,
  'K':2171,
  }

var margin = {
  "left":10,
  "right":10,
  "top":10,
  "bottom":10,
}

fakedata = [
  {"x":1,"y":1},
  {"x":2,"y":12},
  {"x":5,"y":15},
  {"x":9,"y":18},
  {"x":15,"y":19},
]

var h = 194*2-margin.top-margin.bottom,
    w = 357*2-margin.left-margin.right

var x = d3.scale.linear()
    .range([0,w])
    .domain(d3.extent(fakedata, function(d){return d.x}));

var y = d3.scale.linear()
    .range([h,0])
    .domain(d3.extent(fakedata, function(d){return d.y}));;

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(1)
    .tickSize(1);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(1)
    .tickSize(1);

var sedContainer = d3.select('.svg-container-sed')

var sed = sedContainer.append("svg")
    .attr("width",w+margin.left+margin.right)
    .attr("height",h+margin.top+margin.bottom)
    .attr('style','border:1px solid black;')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

sed.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .append('text')
        .attr('fill','black')
        .attr('x',w/2)
        .attr('y',0)
        .style("text-anchor", "middle")
        .text("Wavelength");

sed.append("g")
    .attr("class", "axis")
    .call(yAxis)
    .append('text')
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",-50)
        .attr("dy", ".71em")
        .attr('fill','black')
        .style("text-anchor", "end")
        .text("Brightness");


sed.selectAll("circle")
  .data(fakedata)
  .enter()
    .append("circle")
    .attr("cx", function(d){return x(d.x)})
    .attr("cy", function(d){return y(d.y)})
    .attr("r",5)
    .attr("fill","black")



var imgContainers = {}

//Setup each image
$.each(bands,function(band,wavelength){
  var h = 194,
      w = 357

  var thisContainer = d3.select('.svg-container-img').attr("data-name",band)

  var img = thisContainer.append("svg")
    .attr("width",w)
    .attr("heigh",h)

  //image
  img.append("image")
    .attr("xlink:href","/static/images/"+band+".png")
    .attr("height",h)
    .attr("width",w)
    .attr("x",0)
    .attr("y",0)

  //image wavelength label
  img.append("text")
    .attr("x",w-80)
    .attr("y",h-50)
    .attr("fill","#66FF33")
    .style("font-size","20px")
    .text(wavelength+" nm")

  //mask
  img.append("rect")
    .attr("class","mask")
    .attr("x",0)
    .attr("y",0)
    .attr("height",h)
    .attr("width",w)
    .attr("opacity",0.0)
    .style("background","black")

  //group for mouseover outlines on png
  var source = img.selectAll("g")
    .data(sourceData)
    .enter()
    .append("g")
    .on("mouseenter",function() {
        var sourceNumber = d3.select(this).select(".circ-outline").attr("data-name")
        d3.selectAll('.circ-outline[data-name="'+sourceNumber+'"]')
          .transition().duration(500)
          .style("opacity",1)
        d3.selectAll("rect.mask")
          .transition().duration(700)
          .style("opacity",0.1)
      })
    .on("mouseleave",function() {
        d3.selectAll('.circ-outline')
          .transition().duration(500)
          .style("opacity",0.0)
        d3.selectAll("rect.mask")
          .transition().duration(700)
          .style("opacity",0.0)
      })

  source.append("circle")
      .attr("class","circ-outline")
      .attr("data-name",function(d) {return d.sourceNumber})
      .attr("cx", function(d) {return d.png.x})
      .attr("cy", function(d) {return d.png.y})
      .attr("r",  function(d) {return d.png.r})
      .attr("fill","none")
      .attr("stroke","#66FF33")
      .attr("stroke-width",2)
      .style("opacity",0.0)

    source.append("circle")
      .attr("class","circ-inner")
      .attr("cx", function(d) {return d.png.x})
      .attr("cy", function(d) {return d.png.y})
      .attr("r",  function(d) {return d.png.r})
      .attr("fill","white")
      .style("opacity",0.0)    

  imgContainers[band]=thisContainer
})


})