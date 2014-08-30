$(document).ready(function(){
  var empty_sed = "/static/images/grond/empty_sed.png"
  var sourceData = [
    {
      "png": {
        "x":8.7,
        "y":24.7,
        "r":10,
      },
      "sourceNumber": 0,
      "sed": {
        "text": [
          "Classification: Star",
          "Temperature: 6000 K",
          "Age: 1.2B Years",
          "Mass: 1.2 Solar",
        ],
      },
    },
    {
      "png": {
        "x":62.3,
        "y":74.3,
        "r":10,
      },
      "sourceNumber": 1,
      "sed": {
        "text": [
          "Classification: Star",
          "Temperature: 4500 K",
          "Age: 3.4B Years",
          "Mass: 0.8 Solar",
        ],
      },
    },
    {
      "png": {
        "x":28.7,
        "y":120,
        "r":10,
      },
      "sourceNumber": 2,
      "sed": {
        "text": [
          "Classification: Galaxy",
          "Temperature: n/a",
          "Age: 6.2B Years",
          "Mass: 2000B Solar",
        ],
      },
    },
    {
      "png": {
        "x":59.7,
        "y":160,
        "r":10,
      },
      "sourceNumber": 3,
      "sed": {
        "text": [
          "Classification: Star",
          "Temperature: 8000 K",
          "Age: 800M Years",
          "Mass: 2.2 Solar",
        ],
      },
    },
    {
      "png": {
        "x":96.3,
        "y":175,
        "r":10,
      },
      "sourceNumber": 4,
      "sed": {
        "text": [
          "Classification: Star",
          "Temperature: 12000 K",
          "Age: 300M Years",
          "Mass: 5.8 Solar",
        ],
      },
    },
    {
      "png": {
        "x":146,
        "y":134.3,
        "r":7,
      },
      "sourceNumber": 5,
      "sed": {
        "text": [
          "Classification: Quasar",
          "Temperature: n/a",
          "Age: 5.5B Years",
          "Mass: n/a",
        ],
      },
    },
    {
      "png": {
        "x":162,
        "y":133,
        "r":14,
      },
      "sourceNumber": 6,
      "sed": {
        "text": [
          "Classification: Galaxy",
          "Temperature: n/a",
          "Age: 11.0B Years",
          "Mass: 3200B Solar",
        ],
      },
    },
    {
      "png": {
        "x":191,
        "y":32.7,
        "r":10,
      },
      "sourceNumber": 7,
      "sed": {
        "text": [
          "Classification: Galaxy",
          "Temperature: n/a",
          "Age: 9.8B Years",
          "Mass: 3100B Solar",
        ],
      },
    },
    {
      "png": {
        "x":242.3,
        "y":30,
        "r":10,
      },
      "sourceNumber": 8,
      "sed": {
        "text": [
          "Classification: Quasar",
          "Temperature: n/a",
          "Age: 10.2M Years",
          "Mass: n/a",
        ],
      },
    },
    {
      "png": {
        "x":271.7,
        "y":35.7,
        "r":10,
      },
      "sourceNumber": 9,
      "sed": {
        "text": [
          "Classification: Star",
          "Temperature: 4000 K",
          "Age: 3.5B Years",
          "Mass: 0.6 Solar",
        ],
      },
    },
    {
      "png": {
        "x":72.2,
        "y":122,
        "r":10,
      },
      "sourceNumber": 10,
      "sed": {
        "text": [
          "Classification: Star",
          "Temperature: 9200 K",
          "Age: 1.0B Years",
          "Mass: 3.5 Solar",
        ],
      },
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

  $.each(sourceData, function(index,value) {
    value.sed.path = "/static/images/grond/"+value.sourceNumber+"_sed.png"
  })

  var h = 194 
  var w = 357

  var sedContainer = d3.select('.svg-container-sed')

  var sed = sedContainer.append("svg")
    .attr("width",w)
    .attr("height",h)
    .style("background","white")

  sed.append("image")
    .attr("xlink:href",empty_sed)
    .attr("height",h)
    .attr("width",w)
    .attr("x",0)
    .attr("y",0)

  var textContainer = d3.select('.svg-container-text')

  var text = textContainer.append("svg")
    .attr("width",w)
    .attr("height",h)
    .style("background","white")
    .append("g")
      .attr("transform","translate(10,40)")

  //Setup each image
  var imgContainers = {}
  $.each(bands,function(band,wavelength){

    var thisContainer = d3.select('.svg-container-img[data-name="'+band+'"]')

    var img = thisContainer.append("svg")
      .attr("width",w)
      .attr("height",h)

    //image
    img.append("image")
      .attr("xlink:href","/static/images/grond/"+band+".png")
      .attr("height",h)
      .attr("width",w)
      .attr("x",0)
      .attr("y",0)

    //image wavelength label
    img.append("text")
      .attr("x",w-80)
      .attr("y",h-10)
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
          sed.selectAll('image')
            .style("opacity",0)
            .attr("xlink:href",sourceData[sourceNumber].sed.path)
            .transition().duration(500)
            .style("opacity",1)
          text.selectAll("text")
            .data(sourceData[sourceNumber].sed.text)
            .enter()
              .append("text")
              .style("font-size","25px")
              .attr("x","0")
              .attr("y",function(d){return sourceData[sourceNumber].sed.text.indexOf(d)*35})
              .text(function(d){return d})
              .style("opacity",0)
              .transition().duration(500)
              .style("opacity",1)      
        })
      .on("mouseleave",function() {
          d3.selectAll('.circ-outline')
            .transition().duration(500)
            .style("opacity",0.0)
          d3.selectAll("rect.mask")
            .transition().duration(700)
            .style("opacity",0.0)
          sed.select('image')
            .attr("xlink:href",empty_sed)
          text.selectAll("text")
            .data([])
            .exit()
            .remove()
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