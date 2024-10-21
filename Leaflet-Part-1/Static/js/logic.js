// Initializing the map
const myMap = L.map("map", {
    center: [20.0, 5.0], 
    zoom: 2
  });
  // Adding title layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(myMap);

  // Defining the USGS GeoJSON URL for last 7-day earthquakes
  const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Determining the marker size

  const markerSize = (magnitude) => magnitude * 4;

  // Determining marker color based on earthquake depth
const getColor = (depth) => {
    return depth > 90 ? "red" :
           depth > 70 ? "orange" :
           depth > 50 ? "yellow" :
           depth > 30 ? "lightyellow" :
           depth > 10 ? "lightgreen" :
                        "green"
};

// Using D3 to fetch  the GeoJSON data and add it to the map
d3.json(earthquakeUrl).then(data => {
// looping each dataset feature
data.features.forEach((feature) => {
    const [longitude, latitude, depth] = feature.geometry.coordinates; 
    const magnitude = feature.properties.mag;
    const location = feature.properties.place;
// creating  a new circle marker  for  each feature
L.circle([latitude, longitude], {
    color: "black",
    fillColor: getColor(depth),   // Settting color based on depth
    fillOpacity: 0.75,
    radius: markerSize(magnitude) // Setting size based on magnitude
  })
  .bindPopup(`
    <h3>${location}</h3>
    <hr>
    <p><strong>Magnitude:</strong> ${magnitude}</p>
    <p><strong>Depth:</strong> ${depth} km</p>
  `) // Adding popup info
  .addTo(myMap);
});

//Adding a legend for  color coding 
const legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  const div = L.DomUtil.create("div", "info legend");
  const depths = [0, 10, 30, 50, 70, 90];
  const colors = ["green", "lightgreen", "lightyellow", "yellow", "orange", "red"]; 

  // Looping through depth intervals and create a label with a colored square for each interval
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      `<i style="background:${colors[i]}"></i> ${depths[i]}${(depths[i + 1] ? `&ndash;${depths[i + 1]}` : '+')}<br>`;
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap);
}).catch(error => console.error('Error fetching earthquake data:', error));




