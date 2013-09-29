$(document).ready(function(){
//http://jsfiddle.net/h5rnW/8/

var data //load data
queue()
    .defer(d3.csv, "/static/spectra/grbspec2.txt.resampled")
    .defer(d3.csv, "/static/spectra/qsospec.txt.resampled")
    .defer(d3.csv, "/static/spectra/grbspec2.txt.resampled.absorber")
    .defer(d3.csv, "/static/spectra/qsospec.txt.resampled.absorber")
    .await(go);

function go (error,grbspec, qsospec, grbspec_abs, qsospec_abs) {
    var Timer = function (func, arg, interval) {
        this.run = function () {
            if (this.running) {
                return
            }
            func(arg)
            this.id = setInterval(function () {func(arg)}, interval)
            this.running = true
        }
        this.clear = function () {
            if (this.running) {
                clearInterval(this.id)
                this.running = false
            }
        }
    }

    //// Define svg containers
    var w = $('div#svg-container._1').width(),
        h = 200,
        h2 = 200,
        margin2 = {top: 5, right: 5, bottom: 15, left: 15},
        gw2 = $('div#sub-container._2_grbspec').width()-margin2.left-margin2.right,
        gh2 = h2/1.5-margin2.top-margin2.bottom

    var svg1 = d3.select('div#svg-container._1').append('svg')
        .attr('width', w)
        .attr('height', h)
        .attr('style','background:black;')

    var svg2 = d3.select('div._2').append('svg')
        .attr('width', w)
        .attr('height', h2)
        .attr('style','background:black;')

    var svg2_grbspec = d3.select('div._2_grbspec').append('svg')
        .attr('width', gw2+margin2.left+margin2.right)
        .attr('height', gh2+margin2.top+margin2.bottom)
        .attr('style','background:black;')
        .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var svg2_qsospec = d3.select('div._2_qsospec').append('svg')
        .attr('width', gw2+margin2.left+margin2.right)
        .attr('height', gh2+margin2.top+margin2.bottom)
        .attr('style','background:black;')
        .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


    /// Define generic objects
    var Cloud = d3.superformula()
        .type("ellipse")
        .size(300)

    var Star = d3.superformula()
        .type("gear")
        .size(5000)
        .param("m", 869.3)
        .param("n1", 100)
        .param("n2", 50)
        .param("n3", 50)
        .param("a", 1)
        .param("b", 1)

    var Star2 = d3.superformula()
        .type("gear")
        .size(700)
        .param("m", 869.3)
        .param("n1", 100)
        .param("n2", 50)
        .param("n3", 50)
        .param("a", 1)
        .param("b", 1)

    var species = ["MgII", "CIV", "MgI", "FeII", "NIII", "OV", "MgII", "CIV"] ///Extra MgII and CIV since thats what we want to see more of ;)

    /// Define container-specific objects

    var star1 = svg1.append('path')
        .attr("d", Star)
        .attr("fill", "yellow")
        .attr("transform", "translate(" + w / 2 + "," + h2 / 2 + ")")
        .attr('class', "star")

    var qso2 = svg2.append('path')
        .attr("d", Star2)
        .attr("fill", "#22AFF5")
        .attr("transform", "translate(" + w*0.1 + "," + h2 * 0.9 + ")")
        .attr('class', "star")

    var grb2 = svg2.append('path')
        .attr("d", Star2)
        .attr("fill", "yellow")
        .attr("transform", "translate(" + w*0.1 + "," + h2 * 0.1 + ")")
        .attr('class', "star")

    var earth2 = svg2.append('image')
        .attr('xlink:href','/static/images/globe.png')
        .attr('x',w*0.9)
        .attr('y',h2/2-25)
        .attr('height',50)
        .attr('width',50)

    var los2_qso = svg2.append('line')
        .attr('x1',w*0.1)
        .attr('y1',h2*0.9)
        .attr('x2',earth2.attr('x'))
        .attr('y2',parseInt(earth2.attr('y'))+30)
        .attr('stroke',"#22AFF5")
        .style("stroke-dasharray", ("3, 3"))
        .attr('stroke-width',3)

    var los2_grb = svg2.append('line')
        .attr('x1',w*0.1)
        .attr('y1',h2*0.1)
        .attr('x2',earth2.attr('x'))
        .attr('y2',parseInt(earth2.attr('y'))+20)
        .attr('stroke',"yellow")
        .style("stroke-dasharray", ("3, 3"))
        .attr('stroke-width',3)

    var x = d3.scale.linear()
        .range([0,gw2]);

    var y = d3.scale.linear()
        .range([gh2, 0]);

    var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(0)
        .tickSize(0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(0)
        .tickSize(0);

    x.domain([0,100]);
    y.domain([0,1]);

    svg2_grbspec.append("g")
        .attr("class", "axis")
        .attr('class', 'grb-axis')
        .attr("transform", "translate(0," + gh2 + ")")
        .call(xAxis)
        .append('text')
            .attr('fill','yellow')
            .attr('x',gw2/2)
            .attr('y',12)
            .style("text-anchor", "middle")
            .text("Wavelength");

    svg2_grbspec.append("g")
        .attr("class", "axis")
        .attr('class', 'grb-axis')
        .call(yAxis)
        .append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", -12)
            .attr("x",-25)
            .attr("dy", ".71em")
            .attr('fill','yellow')
            .style("text-anchor", "end")
            .text("Brightness");

    svg2_grbspec.append("path")
          .datum(grbspec)
          .attr("class", "line")
          .attr("class","spectra")
          .attr('fill','none')
          .attr('stroke','yellow')
          .attr('stroke-width',1.5)
          .attr("d", line);


    svg2_qsospec.append("g")
        .attr("class", "axis")
        .attr('class', 'qso-axis')
        .attr("transform", "translate(0," + gh2 + ")")
        .call(xAxis)
        .append('text')
            .attr('fill',"#22AFF5")
            .attr('x',gw2/2)
            .attr('y',12)
            .style("text-anchor", "middle")
            .text("Wavelength");
            
    svg2_qsospec.append("g")
        .attr("class", "axis")
        .attr('class', 'qso-axis')
        .call(yAxis)
        .append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", -12)
            .attr("x",-25)
            .attr("dy", ".71em")
            .attr('fill',"#22AFF5")
            .style("text-anchor", "end")
            .text("Brightness");

    svg2_qsospec.append("path")
          .datum(qsospec)
          .attr("class", "line")
          .attr('class',"spectra")
          .attr('fill','none')
          .attr('stroke',"#22AFF5")
          .attr('stroke-width',1.5)
          .attr("d", line);  

    var cloudg2 = svg2.append("g")
        .attr("transform","translate("+(w/2)+",10)")
        .attr('class','cloud')

    cloudg2.append("path")
        .attr('fill','red')
        .attr('d',Cloud)
        .attr('opacity',0.2)

    cloudg2.append('text')    
        .attr("text-anchor", "middle")
        .attr('font-size', 10)
        .attr('fill','white')
        .attr('transform', 'translate(0,4)')
        .text("MgII")

    var moveCloud = function (cloudg2) {

        cloudg2.transition()
            .duration(5000)
            .attr("transform","translate("+(w/2)+','+(h2-10)+")")
            .transition()
                .duration(5000).delay(5000)
                .attr("transform","translate("+(w/2)+",10)")


                //First pass: GRB
        svg2_grbspec.selectAll("path.spectra")
            .datum(grbspec_abs)
            .transition().delay(1000)
            .duration(1000)
              .attr("d", line);

        svg2_grbspec.selectAll("path.spectra")
            .datum(grbspec)
            .transition().delay(2000)
            .duration(1000)
              .attr("d", line);

              //First pass: QSO
        svg2_qsospec.selectAll("path.spectra")
            .datum(qsospec_abs)
            .transition().delay(2500)
            .duration(1000)
              .attr("d", line);

        svg2_qsospec.selectAll("path.spectra")
            .datum(qsospec)
            .transition().delay(3500)
            .duration(1000)
              .attr("d", line);

                //second pass: QSO
        svg2_qsospec.selectAll("path.spectra")
            .datum(qsospec_abs)
            .transition().delay(5500)
            .duration(1000)
              .attr("d", line);

        svg2_qsospec.selectAll("path.spectra")
            .datum(qsospec)
            .transition().delay(7000)
            .duration(1000)
              .attr("d", line);

              //second pass: GRB
        svg2_grbspec.selectAll("path.spectra")
            .datum(grbspec_abs)
            .transition().delay(7500)
            .duration(1000)
              .attr("d", line);

        svg2_grbspec.selectAll("path.spectra")
            .datum(grbspec)
            .transition().delay(8500)
            .duration(1000)
              .attr("d", line);


    }

    var newCloud = function () {
        var end_x = Math.random() * w,
            end_y = (h/2-50)+Math.random()*100

        var cloudg = svg1.append("g")
            .attr('class', 'cloud')
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")

        cloudg.append('path')
            .attr('fill', 'yellow')
            .attr('d', Cloud)
            .attr('opacity', 0.9)

        cloudg.append('text')
            .attr("text-anchor", "middle")
            .attr('font-size', 10)
            .attr('fill','white')
            .attr('transform', 'translate(0,4)')
            .text(species[Math.floor(Math.random() * species.length)])

        cloudg.selectAll('text')
            .transition()
            .duration(5000)
            .remove()
        
        cloudg.selectAll('path')
            .transition()
            .duration(5000)
            .attr('opacity', 0.1)
            .attr('fill', 'red')
            .remove()

        cloudg.transition()
            .duration(5000)
            .attr('transform', "translate(" + end_x + "," + end_y + ")")
            .remove()
    }

    var sparkleStar = function (s) {
        var n3 = Math.random() * 100 + 40,
            n2 = Math.random() * 100 + 40,
            n1 = Math.random() * 100 + 40;

        s[0].transition()
            .duration(1000)
            .ease('linear')
            .attr('d', s[1].param("n3", n3))
            .attr('d', s[1].param("n2", n2))
            .attr('d', s[1].param("n1", n1))

        if (n3 > 100) {
            newCloud()
        }
    }

    var sparkleLOS = function(line) {
            line.transition()
                .duration(1000)
                .attr('stroke-width',Math.random()*2+1)
                //.style("stroke-dasharray", ("3",Math.random()+2))
    }


    //////////Start|stop animations on collapse

    d3.selectAll('button._1').on("click", function () {
        $.each(section1timers, function (index,timer) {
            if (timer.running) {
                timer.clear()
            } else {
                timer.run()
            }
        })
    })


    d3.selectAll('button._2').on("click", function () {
        $.each(section2timers, function (index,timer) {
            if (timer.running) {
                timer.clear()
            } else {
                timer.run()
            }
        })
    })

    var section1timers = [new Timer(sparkleStar, [star1,Star], 1000)]
    var section2timers = [
        new Timer(sparkleStar, [qso2,Star2], 1000),
        new Timer(sparkleStar, [grb2,Star2], 1000),
        new Timer(sparkleLOS, los2_grb, 1000),
        new Timer(sparkleLOS, los2_qso, 1000),
        new Timer(moveCloud, cloudg2, 20000)
    ] 
    }
})