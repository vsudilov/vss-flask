function startVis (data) {

  var scale = d3.scale.log()
    .domain(d3.extent(data, function(d) {return d.hits}))
    .range([3, 10]);

  $.each(data, function (index,datapoint) {
    datapoint.radius = scale(datapoint.hits)
    datapoint.fillKey = 'bubbleFill'
  });

  var visitorMap = new Datamap({
    element: $('.svg-container')[0],
    scope: 'world',
    geographyConfig: {
      popupOnHover: false,
      highlightOnHover: false
    },
    fills: {
      defaultFill: '#ABDDA4', //the keys in this object map to the "fillKey" of [data] or [bubbles]
      bubbleFill : 'blue',
    },  
    data: {
      "bubbleFill": {fillKey:"bubbleFill"},
    },
  });
  
  visitorMap.bubbles(data,{
    popupTemplate:function (geography, data) {
      return ['<div class="hoverinfo"><strong>' + data.city + '</strong>',
      '<br/>Hits: ' + data.hits,
      '</div>'].join('');
    },
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    popupOnHover: true,
  })
}; //end startVis
