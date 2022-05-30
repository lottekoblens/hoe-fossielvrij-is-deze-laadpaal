const socket = io();
const div = document.querySelector('#error');
let dataMap

mapboxgl.accessToken =
    'pk.eyJ1IjoibG90dGVrb2JsZW5zIiwiYSI6ImNsM2s3MmtydjAwM2szY3A1ODJycHZycHUifQ.0bLXdbWjqYSzKUjW0r1rLw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 14, // starting zoom
    center: [4.899431, 52.379189]
});

const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(userPosition, ErrorPermissionDenied);
    } else {
        div.innerHTML = 'The browser does not support geolocation';
    }
}

const userPosition = location => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    map.flyTo({
        center: [longitude, latitude],
        speed: 1
    });

    socket.emit('location', {
        latitude,
        longitude
    })
}

const ErrorPermissionDenied = error => {
    if (error.PERMISSION_DENIED) {
        div.innerHTML = 'The user has denied the request for Geolocation.';
    }
}
getUserLocation();

let geojson = {
    type: 'ChargingStations',
    features: [{
        type: 'Station',
        geometry: {
            type: 'Point',
            coordinates: [-77.032, 38.913]
        },
        properties: {
            title: 'Mapbox',
            description: 'Washington, D.C.'
        }
    }],

};

socket.on('show-charge-points', data => {
    console.log(data)
    data.forEach(data => {
        let dataForMap = {
            type: data.markerType,
            geometry: {
                type: 'Laadpunt',
                coordinates: [data.coordinates.longitude, data.coordinates.latitude]
            },
            properties: {
                title: 'Laadpunt',
                description: 'Provider: ' + data.operatorName
            }
        };
        geojson.features.push(dataForMap)
    })
    console.log(geojson)


    // add markers to map
    geojson.features.forEach(element => {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(element.geometry.coordinates).setPopup(
            new mapboxgl.Popup({
                offset: 25
            }) // add popups
            .setHTML(
                `<h3>${element.properties.title}</h3><p>${element.properties.description}</p>`
            )
        ).addTo(map);
    });

})