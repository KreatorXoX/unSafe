mapboxgl.accessToken = mapKey;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: JSON.parse(place).coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

const marker1 = new mapboxgl.Marker()
  .setLngLat(JSON.parse(place).coordinates)
  .addTo(map);

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
