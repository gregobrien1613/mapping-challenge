// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Function that makes the markers different colors
function markerSize(mag) {
  return mag * 20000;
}

function markerColor(mag) {
  if(mag < 1.0){
    return "#90ee90"
  }
  else if(mag < 2.0){
    return "#d2ea76"
  }
  else if(mag < 3.0){
    return "#e6df5d"
  }
  else if(mag < 4.0){
    return "#e4b653"
  }
  else if(mag < 5.0){
    return "#de6f2f"
  }
  else{
    return "#c2271e"
  }
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createMap function
  createMap(data.features);
});

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake

function createMap(earthquakeData) {
      //Lets us parse through the data set
      EarthquakeMarkers = earthquakeData.map((feature) =>

          //Creates each individual circle
          L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            stroke: true,
            color: "black",
            weight: 0.3,
            fillOpacity: 0.46,
            fillColor: markerColor(feature.properties.mag),
            radius: markerSize(feature.properties.mag)
          })
          //Gives us the pop ups
          .bindPopup("<h2> Magnitude : " + feature.properties.mag +
          "</h2><hr><h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
      )

      // Add the earthquakes layer to a marker cluster group.
      var earthquakes=L.layerGroup(EarthquakeMarkers)

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: "pk.eyJ1IjoiZ3JlZ29icmllbjE2MTMiLCJhIjoiY2s4Z2pxYXFjMDJkdjNscnVxbDVmYjB2MCJ9.vsi4FLvSET4nNbMqBmHj9A"
  });

  var darkmode = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: "pk.eyJ1IjoiZ3JlZ29icmllbjE2MTMiLCJhIjoiY2s4Z2pxYXFjMDJkdjNscnVxbDVmYjB2MCJ9.vsi4FLvSET4nNbMqBmHj9A"
  })
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmode
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      41, -122.4194
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //Creates legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    labels = ['<strong>Legend</strong>'],
    colors = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    htmlColors = ["#90ee90", "#d2ea76", "#e6df5d", "#e4b653", "#de6f2f", "#c2271e"]

    for (var i = 0; i < colors.length; i++) {
      div.innerHTML +=
          '<i style="background:' + htmlColors[i] + '"></i>' +
          colors[i] + '<br>';
  }
  return div;
};
//Adds legend to map
legend.addTo(myMap);
}
