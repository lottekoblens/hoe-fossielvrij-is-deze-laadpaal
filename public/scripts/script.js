const socket = io();
const errorMessage = document.getElementById('error');
const infoButton = document.getElementById('info-button');
const infoSection = document.getElementById('info');
const closeButton = document.getElementById('close-button');
const closePopupButton = document.getElementById('close-popup-button');
const loading = document.getElementById('loading-ring');
const popupError = document.getElementById('popupError');
let dataMap
let average

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../sw.js').then(function (registration) {
            return registration.update();
        });
    });
} // add service worker

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

    closePopupButton.addEventListener('click', () => {
        popupError.style.display = 'none';
    })

    const generateMapMarkers = (geojson, average) => {
        console.log(average)
        geojson.features.forEach((singleMarker) => {
            const HTMLMarker = document.createElement('div')
            if (singleMarker.properties.sustainability <= average && singleMarker.properties.availibility == 'Available') {
                HTMLMarker.className = 'custom-marker-green';
                const marker = new mapboxgl.Marker(HTMLMarker, {
                        scale: 0.5,
                    })
                    .setLngLat([singleMarker.geometry.coordinates[0], singleMarker.geometry.coordinates[1]]).setPopup(
                        new mapboxgl.Popup({
                            offset: 25
                        }) // add popups
                        .setHTML(
                            `<div><img id="popup-img" src="/images/green-point.png"><h3 tabindex="0">Duurzame laadpaal</h3></div><p><strong>Beschikbaarheid: </strong>Beschikbaar</p><a id="startLoading" href="/duurzaam">Meer informatie</a>`
                        ) // give popups the title, description and a button
                    )
                    .addTo(map); // add markers and popups to map
                HTMLMarker.addEventListener('focus', (event) => {
                    marker.togglePopup()
                });

            } else if (singleMarker.properties.sustainability > average && singleMarker.properties.sustainability <= average + 3 && singleMarker.properties.availibility == 'Available') {
                HTMLMarker.className = 'custom-marker-orange';
                const marker = new mapboxgl.Marker(HTMLMarker, {
                        scale: 0.5,
                    })
                    .setLngLat([singleMarker.geometry.coordinates[0], singleMarker.geometry.coordinates[1]]).setPopup(
                        new mapboxgl.Popup({
                            offset: 25
                        }) // add popups
                        .setHTML(
                            `<div><img id="popup-img" src="/images/orange-point.png"><h3 tabindex="0">Redelijk duurzame laadpaal</h3></div><p><strong>Beschikbaarheid: </strong>Beschikbaar</p><a id="startLoading" href="/redelijkduurzaam">Meer informatie</a>`
                        ) // give popups the title, description and a button
                    )
                    .addTo(map); // add markers and popups to map
                HTMLMarker.addEventListener('focus', (event) => {
                    marker.togglePopup()
                });
            } else if (singleMarker.properties.sustainability > average + 3 && singleMarker.properties.availibility == 'Available') {
                HTMLMarker.className = 'custom-marker-red';
                const marker = new mapboxgl.Marker(HTMLMarker, {
                        scale: 0.5,
                    })
                    .setLngLat([singleMarker.geometry.coordinates[0], singleMarker.geometry.coordinates[1]]).setPopup(
                        new mapboxgl.Popup({
                            offset: 25
                        }) // add popups
                        .setHTML(
                            `<div><img id="popup-img" src="/images/red-point.png"><h3 tabindex="0">Niet duurzame laadpaal</h3></div><p><strong>Beschikbaarheid: </strong>Beschikbaar</p><a id="startLoading" href="/nietduurzaam">Meer informatie</a>`
                        ) // give popups the title, description and a button
                    )
                    .addTo(map); // add markers and popups to map
                HTMLMarker.addEventListener('focus', (event) => {
                    marker.togglePopup()
                });
            } else if (singleMarker.properties.availibility != 'Available') {
                HTMLMarker.className = 'custom-marker-grey';
                const marker = new mapboxgl.Marker(HTMLMarker, {
                        scale: 0.5,
                    })
                    .setLngLat([singleMarker.geometry.coordinates[0], singleMarker.geometry.coordinates[1]]).setPopup(
                        new mapboxgl.Popup({
                            offset: 25
                        }) // add popups
                        .setHTML(
                            `<div><img id="popup-img" src="/images/grey-charge.png"><h3 tabindex="0">Niet beschikbare laadpaal</h3></div><p><strong>Beschikbaarheid:</strong> Niet beschikbaar</p><a id="startLoading" href="/nietduurzaam">Meer informatie</a>`
                        ) // give popups the title, description and a button
                    )
                    .addTo(map); // add markers and popups to map
                HTMLMarker.addEventListener('focus', (event) => {
                    marker.togglePopup()
                });
            } // based on the sustainabilty the icons will load with the right color
        })
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
        loading.style.display = 'block'
        const latitude = location.coords.latitude; // set latitude
        const longitude = location.coords.longitude; // set longitude

        map.flyTo({
            center: [longitude, latitude], // let the map fly to the users location
            speed: 1
        });

        socket.emit('location', {
            latitude,
            longitude
        }) // give latitude and longitude to the sockets, so it can be used server side
    }

    const ErrorPermissionDenied = error => {
        if (error.PERMISSION_DENIED) {
            popupError.style.display = 'block'; // when user denied permission for location the popup will be displayed
        }
    }
    getUserLocation();

    let geojson = {
        type: 'ChargingStations',
        features: [],
    }; // create the geojson object for the points on the map

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
                    sustainability: data.sustain,
                    availibility: data.status
                }
            };
            if (data.provider === 'Unknown') {
                data.sustain = average
            }
            geojson.features.push(dataForMap) // for every data object the above will be add to the geojson object
        })

        const calculateAverage = (data) => {
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
        average = calculateAverage(data) // we need to calculate the average to make a scale for the loading points

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
    }); // with the geocoder the user can search for another place on the map

    map.addControl(geocoder); // Add the geocoder to the map

    geocoder.on('result', (e) => {
        const longitude = e.result.center[0];
        const latitude = e.result.center[1];

        map.flyTo({
            center: [longitude, latitude],
            speed: 2,
            curve: 0.7,
        });

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

if (window.location.pathname === '/nietduurzaam' || window.location.pathname === '/redelijkduurzaam') {
    const showBetterStation = document.getElementById('showBetterStation');
    const hiddenSection = document.getElementById('map2');
    const walk = document.getElementById('walk')
    showBetterStation.addEventListener('click', () => {
        hiddenSection.classList.remove('hidden');
        walk.style.marginTop = '20em';
    })

    window.addEventListener('load', function () {
        document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();
    }) //make location of user visible on page load

    const generateMapMarkers = (geojson, average) => {
        console.log(average)

        const getMin = () => {
            return geojson.features.map(d => d.properties.sustainability);
        }

        const getMinValue = () => {
            return Math.min(...getMin());
        }
        let minValue = getMinValue(geojson);

        const iets = geojson.features.find((geojson) => {
            if (geojson.properties.sustainability == minValue) {
                let minStation = geojson
                return minStation
            }
        })

        const marker1 = new mapboxgl.Marker()
            .setLngLat([iets.geometry.coordinates[0], iets.geometry.coordinates[1]])
            .addTo(map);
        map.flyTo({
            zoom: 15,
            center: [iets.geometry.coordinates[0], iets.geometry.coordinates[1]]
        })
        console.log(iets)
    }

    mapboxgl.accessToken =
        'pk.eyJ1IjoibG90dGVrb2JsZW5zIiwiYSI6ImNsM2s3MmtydjAwM2szY3A1ODJycHZycHUifQ.0bLXdbWjqYSzKUjW0r1rLw';
    const map = new mapboxgl.Map({
        container: 'map2', // container ID
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
        // loading.style.display = 'block'
        const latitude = location.coords.latitude; // set latitude
        const longitude = location.coords.longitude; // set longitude

        map.flyTo({
            center: [longitude, latitude], // let the map fly to the users location
            speed: 1,
        });

        socket.emit('location', {
            latitude,
            longitude
        }) // give latitude and longitude to the sockets, so it can be used server side
    }

    const ErrorPermissionDenied = error => {
        if (error.PERMISSION_DENIED) {
            popupError.style.display = 'block'; // when user denied permission for location the popup will be displayed
        }
    }
    getUserLocation();

    let geojson = {
        type: 'ChargingStations',
        features: [],
    }; // create the geojson object for the points on the map

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
                    sustainability: data.sustain,
                    availibility: data.status
                }
            };
            if (data.provider === 'Unknown') {
                data.sustain = average
            }
            geojson.features.push(dataForMap) // for every data object the above will be add to the geojson object
        })

        const calculateAverage = (data) => {
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
        average = calculateAverage(data) // we need to calculate the average to make a scale for the loading points

        generateMapMarkers(geojson, average)
        // loading.style.display = 'none';
    })

    const geocoder = new MapboxGeocoder({
        // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: true, // Do not use the default marker style
        flyTo: {
            zoom: 15, // If you want your result not to go further than a specific zoom
        },
        marker: {
            color: 'blue'
        }

    }); // with the geocoder the user can search for another place on the map

    map.addControl(geocoder, 'top-right'); // Add the geocoder to the map

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
}