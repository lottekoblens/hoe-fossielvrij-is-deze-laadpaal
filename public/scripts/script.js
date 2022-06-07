const socket = io();
const errorMessage = document.getElementById('#error');
const infoButton = document.getElementById('info-button');
const infoSection = document.getElementById('info');
const closeButton = document.getElementById('close-button');
const loading = document.getElementById('loading');
let dataMap

window.addEventListener('load', function () {
    document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();
}) //make location of user visible on page load

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register('../sw.js').then(function (registration) {
//             return registration.update();
//         });
//     });
// }

infoButton.addEventListener('click', () => {
    infoSection.style.display = 'block';
})

closeButton.addEventListener('click', () => {
    infoSection.style.display = 'none';
})

mapboxgl.accessToken =
    'pk.eyJ1IjoibG90dGVrb2JsZW5zIiwiYSI6ImNsM2s3MmtydjAwM2szY3A1ODJycHZycHUifQ.0bLXdbWjqYSzKUjW0r1rLw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    zoom: 15, // starting zoom
    center: [4.899431, 52.379189]
});

const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(userPosition, ErrorPermissionDenied);
    } else {
        errorMessage.innerHTML = 'The browser does not support geolocation';
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
        errorMessage.innerHTML = 'The user has denied the request for Geolocation.';
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
            description: 'Washington, D.C.',
            iconSize: [40, 40]
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
                description: 'Provider: ' + data.operatorName + '\nBeschikbaarheid: ' + data.status + '\nGram CO2 uitstoot per kWh: ' + data.sustain,
                operator: data.operatorName,
                sustainability: 'Gram CO2 uitstoot met kWh: ' + data.sustain
            }
        };
        geojson.features.push(dataForMap)
    })
    console.log(geojson, 'geojson')


    // // Add markers to the map.
    // for (const marker of geojson.features) {
    //     // Create a DOM element for each marker.
    //     const el = document.createElement('div');
    //     const width = marker.properties.iconSize[0];
    //     const height = marker.properties.iconSize[1];
    //     el.className = 'marker';
    //     el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
    //     el.style.width = `${width}px`;
    //     el.style.height = `${height}px`;
    //     el.style.backgroundSize = '100%';

    //     el.addEventListener('click', () => {
    //         window.alert(marker.properties.message);
    //     });

    //     // Add markers to the map.
    //     new mapboxgl.Marker(el)
    //         .setLngLat(marker.geometry.coordinates)
    //         .addTo(map);
    // }

    // add markers to map
    geojson.features.forEach(element => {
        loading.style.display = 'none'; // delete loading icon
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

const geocoder = new MapboxGeocoder({
    // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: true, // Do not use the default marker style
    flyTo: {
        // center: [longitude, latitude],
        zoom: 14, // If you want your result not to go further than a specific zoom
    },
    marker: {
        color: 'blue'
    }
});

// Add the geocoder to the map
map.addControl(geocoder);

geocoder.on('result', (e) => {
    const longitude = e.result.center[0];
    const latitude = e.result.center[1];

    console.log(e.result)

    socket.emit('location', {
        latitude,
        longitude
    })
})

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    }),
    'bottom-right'
);