mapboxgl.accessToken =
    'pk.eyJ1IjoibG90dGVrb2JsZW5zIiwiYSI6ImNsM2s3MmtydjAwM2szY3A1ODJycHZycHUifQ.0bLXdbWjqYSzKUjW0r1rLw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    center: [4.899431, 52.379189]
});

const geojson = {
    type: 'FeatureCollection',
    features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-77.032, 38.913]
            },
            properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-122.414, 37.776]
            },
            properties: {
                title: 'Mapbox',
                description: 'San Francisco, California'
            }
        }
    ]
};

// add markers to map
for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';
    console.log('hpi')

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
}