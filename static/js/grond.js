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
var imgContainers = {}

//Setup each image
$.each(bands,function(band,wavelength){
  var h = 194,
      w = 357

  var thisContainer = d3.select('.svg-container-img').attr("data-name",band)

  svg = thisContainer.append("svg")
    .attr("width",w)
    .attr("heigh",h)

  //image
  svg.append("image")
    .attr("xlink:href","/static/images/"+band+".png")
    .attr("height",h)
    .attr("width",w)
    .attr("x",0)
    .attr("y",0)

  //image wavelength label
  svg.append("text")
    .attr("x",w-80)
    .attr("y",h-50)
    .attr("fill","#66FF33")
    .style("font-size","20px")
    .text(wavelength+" nm")


  //mask
  svg.append("rect")
    .attr("class","mask")
    .attr("x",0)
    .attr("y",0)
    .attr("height",h)
    .attr("width",w)
    .attr("opacity",0.0)
    .style("background","black")

  //group for mouseover outlines on png
  var source = svg.selectAll("g")
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