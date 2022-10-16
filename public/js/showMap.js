mapboxgl.accessToken = mapKey;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: place.geometry.coordinates, // starting position [lng, lat]
  zoom: 11, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h6 style='margin-top:1rem'>${place.title}</h6><p>${place.location}</p>`
);
const marker1 = new mapboxgl.Marker()
  .setLngLat(place.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
