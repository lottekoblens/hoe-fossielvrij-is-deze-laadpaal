const socket = io();
const errorMessage = document.getElementById('#error');
const infoButton = document.getElementById('info-button');
const infoSection = document.getElementById('info');
const closeButton = document.getElementById('close-button');
const loading = document.getElementById('loading');
let dataMap
let average

if (window.location.pathname === '/map') {
    window.addEventListener('load', function () {
        document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();
    }) //make location of user visible on page load

    infoButton.addEventListener('click', () => {
        infoSection.style.display = 'block';
    })

    closeButton.addEventListener('click', () => {
        infoSection.style.display = 'none';
    })

    const generateMapMarkers = (geojson, average) => {
        geojson.features.forEach((singleMarker) => {
            const HTMLMarker = document.createElement('div')
            if (singleMarker.properties.sustainability < average - 2) {
                HTMLMarker.className = 'custom-marker-green';
            } else if (singleMarker.properties.sustainability >= average - 2 && singleMarker.properties.sustainability <= average + 2) {
                HTMLMarker.className = 'custom-marker-orange';
            } else if (singleMarker.properties.sustainability > average + 2) {
                HTMLMarker.className = 'custom-marker-red';
            }

            const marker = new mapboxgl.Marker(HTMLMarker, {
                    scale: 0.5,
                })
                .setLngLat([singleMarker.geometry.coordinates[0], singleMarker.geometry.coordinates[1]]).setPopup(
                    new mapboxgl.Popup({
                        offset: 25
                    }) // add popups
                    .setHTML(
                        `<h3>${singleMarker.properties.title}</h3><p>${singleMarker.properties.description}</p><a id="startLoading" href="/laadsessie">Start laden</a>`
                    )
                )
                .addTo(map);
        })
    }


    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('../sw.js').then(function (registration) {
                return registration.update();
            });
        });
    }


    mapboxgl.accessToken =
        'pk.eyJ1IjoibG90dGVrb2JsZW5zIiwiYSI6ImNsM2s3MmtydjAwM2szY3A1ODJycHZycHUifQ.0bLXdbWjqYSzKUjW0r1rLw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        zoom: 17, // starting zoom
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
        features: [],
    };

    socket.on('show-charge-points', data => {
        data.forEach(data => {
            let dataForMap = {
                type: data.markerType,
                geometry: {
                    type: 'Laadpunt',
                    coordinates: [data.coordinates.longitude, data.coordinates.latitude]
                },
                properties: {
                    title: 'Laadpunt',
                    description: '\nBeschikbaarheid: ' + data.status + '\nGram CO2 uitstoot per kWh: ' + data.sustain,
                    operator: data.operatorName,
                    sustainability: data.sustain
                }
            };
            if (data.provider === 'Unknown') {
                data.sustain = average
            }
            geojson.features.push(dataForMap)
        })

        const calculateAverage = (data) => {
            console.log(data)
            average = 0;
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                if (isFinite(data[i].sustain)) { //The global isFinite() function determines whether the passed value is a finite number. 
                    //If needed, the parameter is first converted to a number. Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite
                    sum += data[i].sustain;
                }
            }
            return sum / data.length
        }
        average = calculateAverage(data)
        console.log(average);

        generateMapMarkers(geojson, average)
        loading.style.display = 'none';

    })

    const geocoder = new MapboxGeocoder({
        // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: true, // Do not use the default marker style
        flyTo: {
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

        map.flyTo({
            center: [longitude, latitude],
            speed: 1
        });

        socket.emit('location', {
            latitude,
            longitude
        }, console.log('test'))
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
}

if (window.location.pathname === '/laadsessie') {
    const stopLoadingButton = document.getElementById('stopLoading')
    const animationTree = document.getElementById('animation')
    const animationProgress = document.getElementById('color')
    stopLoadingButton.addEventListener('click', (e) => {
        animationTree.style.animationPlayState = 'paused';
        animationProgress.style.animationPlayState = 'paused';
    })
}