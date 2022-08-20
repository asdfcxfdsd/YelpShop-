
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: coffeeshop.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.

const marker = new mapboxgl.Marker()
  .setLngLat(coffeeshop.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset:25 })
    .setHTML(
        `<h3>${coffeeshop.title}</h3><p>${coffeeshop.location}</p>`
    )
  )
  .addTo(map)
  


map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
