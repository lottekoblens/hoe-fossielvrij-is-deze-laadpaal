# :seedling: How fossil-free is this charging station?

In de Design Rationale schrijf je de debriefing, de probleem-definitie, toon je de oplossing en schrijf je een uitleg van de code. De Design Rationale is een verantwoording van je ontwerp. 

[<img src="/public/images/project.gif" width="350">](https://youtu.be/KsQJYSobGd8)

## :heavy_plus_sign: Table of contents
- [:seedling: How fossil-free is this charging station?](#seedling-how-fossil-free-is-this-charging-station)
  - [:heavy_plus_sign: Table of contents](#heavy_plus_sign-table-of-contents)
  - [Debrief](#debrief)
    - [:memo: Problem description / Cause](#memo-problem-description--cause)
    - [:construction_worker: Client](#construction_worker-client)
    - [:rocket: Design challenge](#rocket-design-challenge)
      - [User stories](#user-stories)
    - [Objective](#objective)
    - [Delivery](#delivery)
    - [Conditions](#conditions)
    - [Users of the application](#users-of-the-application)
  - [:package: Data](#package-data)
  - [Solution](#solution)
  - [🔍 Getting started](#-getting-started)
    - [🔨 Installation](#-installation)
  - [:bookmark: Licentie](#bookmark-licentie)

## Debrief

### :memo: Problem description / Cause
The Netherlands is rapidly switching to electric driving. But electricity is not yet fossil-free. And when you charge your electric car, you emit CO2. How much CO2 is released depends on
from where, when and of course how much energy (kWh) you charge. So how do you know how much CO2 is released when you plug your electric car into a specific charging station?

The Green Caravan has developed a data model that combines energy generation and trade across Europe with energy mixes from energy providers. For example, you can accurately request how much CO2, solar, wind, hydro, nuclear, coal, gas and more is in a charging session right down to the charging station. Green Caravan not only has historical data, but also forecasts for the near future.

So the problem I solved with my application is that the user doesn't know how fossil-free a charging station is.

### :construction_worker: Client
**De Voorhoede**

De Voorhoede is a digital agency that builds websites and apps. They make web apps, websites, prototypes and so on. Furthermore, they research, advise, build, test and do much more! They have made the website of Pathé at home and for many more customers.

**Green Caravan**

At Green Caravan it is the mission to make all electric vehicles CO2 neutral and to charge them fossil-free. They want to achieve this by offering smart-charging services and fossil-free charging solutions.

### :rocket: Design challenge
Design and develop a web application that provides insight into the use of fossil fuels for charging sessions of electric cars

#### User stories

1. Fossil electricity from a charging station?

As an electric driver, I want to know how much fossil electricity comes from the charging station I am standing next to, so that I know how (un)sustainable that is.

2. Find the best charging station

As an electric driver, I would like to know at which charging station I can charge most sustainably, so that I can charge my car as sustainably as possible.

3. Find the best charging moment at a charging station

As an electric driver, I would like to know when the least fossil electricity comes from my charging station, so that I can charge my car as sustainably as possible.

4. How do you make CO2 data from the charging network and individual charging sessions available in an attractive way?

What stories can you tell about the collective data over time, about numbers of charging sessions, about average charging time, about differences in CO2 emissions. What is possible here, what are the considerations that matter for an electric driver and user of CO2 Smart Charging.

### Objective
The Green Caravan wants to ensure that electric cars can charge their cars as fossil-free. This reduces the amount of CO2, which is released when the car is charged. They want to ensure this by offering a service that allows users to check how fossil-free it is in front of the charging stations.

### Delivery
The project must be delivered on Thursday 23 June.

* Project is on github
* Project can be viewed live
* Project is well documented (wiki & readme)

### Conditions
Four meetings with the client are planned to receive feedback. These meetings take place at the office of De Voorhoede.
Questions can be asked via Slack to both Tom (when it comes to electric charging, the users, etc.) and Victor (technical questions).

### Users of the application
Owners of electric cars who want to know how sustainable it is if they charge their car at a charging station.

## :package: Data
Green Caravan has several data models:
* Exact energy mix of electricity in the Netherlands, and associated CO2 emissions, accurate to the hour. Both historical data and forecast up to 48 hours in the future.
* Contractual energy mix per energy provider in the Netherlands accurate to the hour.

This time series data (and the user's loading sessions) is kept in an InfluxDB database. This has its own API and (JS) SDK and will be made available to you during the master thesis. By combining the information from the associated energy provider with the data about the energy mix for each charging station, you can calculate the exact CO2 footprint of a charging session at that charging station at that moment. We challenge you to realize this and to make it transparent for the user.

## Solution

I chose this user story: 

**Find the best charging station**

As an electric driver, I would like to know at which charging station I can charge most sustainably, so that I can charge my car as sustainably as possible.

And here you see the solution I created:

<img src="/public/images/project.gif" width="350" alt="gif of application">

I made an application which shows the user a map of the Netherlands. To create the map I used mapbox. The map is created with the following code:

```js
const getUserLocation = () => {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(userPosition, ErrorPermissionDenied);
  } else {
      errorMessage.innerHTML = 'The browser does not support geolocation';
  }
}

window.addEventListener('load', function () {
    document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();
}) //make location of user visible on page load

const generateMapMarkers = (geojson, average) => {
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

const userPosition = location => {
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
            data.sustain = average // this is not the best solution, but not all providers are known, so I still give them a sustain number so that they will be shown on the map
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
```

If the user gives permission to sharing their location, then the map will automatically load the charging stations at their location. These charging stations are displayed with different icons. The green icons stand for sustainable charging stations. The orange icons stand for reasonably sustainable charging stations. And the red icons stand for  unsustainable charging stations. To determine whether a charging station is sustainable at that moment or not I calculate the average of the 
co2 emissions. I do that like this:

```js
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
```

As you can see in the first code block I also use sockets.io. With sockets.io I can send the users location from the client to the server. With the user location I fetch the data of the loading stations server side, like this:

```js
io.on('connection', (socket) => {
    users[socket.id] = Math.floor(Math.random() * 10000000);
    socket.join(users[socket.id]);
    users.id = users[socket.id]

    socket.on('location', async (coordinations) => {
        getChargingStations(coordinations);
    })

    socket.on('disconnect', () => {
        delete users[socket.id];
    });
});

async function getChargingStations(coordinations) {
    const latitude = coordinations.latitude;
    const longitude = coordinations.longitude;

    const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${longitude - 0.008}/${longitude + 0.008}/${latitude - 0.010}/${latitude + 0.010}/15`;
    let dataStations = null;

    const energySuppliers = await getData();
    Object.entries(energySuppliers)
        .map(supplier => {
            supplier = {
                'name': supplier[0],
                'sustain': supplier[1]._value,
            };
            SUSTAINDATA.push(supplier)
        });

    await fetch(url)
        .then(res => res.json())
        .then(data => dataStations = data)
        .then(data => data.map(data => {
            let operatorName = data.operatorName;
            if (operatorName == 'PitPoint') {
                data['provider'] = 'TotalGasPower';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Allego') {
                data['provider'] = 'Vattenfall';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Allego - Groningen and Drenthe') {
                data['provider'] = 'Vattenfall';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Community by Shell Recharge') {
                data['provider'] = 'EnergieDirect';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Blue Current') {
                data['provider'] = 'EnergieDirect';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'EV-Box') {
                data['provider'] = 'Engie';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Alfen') {
                data['provider'] = 'Vandebron';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'E-Flux') {
                data['provider'] = 'BudgetEnergie';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'LastMileSolutions') {
                data['provider'] = 'Engie';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Fastned') {
                data['provider'] = 'GreenChoice';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'BlueMarble Charging') {
                data['provider'] = 'Sepa';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Shell Regarge') {
                data['provider'] = 'EnergieDirect';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Eneco') {
                data['provider'] = 'Eneco'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Vattenfall') {
                data['provider'] = 'Vattenfall'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'PZEM') {
                data['provider'] = 'NLE'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Abel&co') {
                data['provider'] = 'Delta'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Abel&co') {
                data['provider'] = 'Delta'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Joulz\t') {
                data['provider'] = 'Fenor'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Allego - Overijssel and Gelderland') {
                data['provider'] = 'Vattenfall'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Just Plugin') {
                data['provider'] = 'EnergyZero'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'ConnectNed') {
                data['provider'] = 'MainEnergie'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'AVIA Netherlands') {
                data['provider'] = 'NLE'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Delta-timeScore') {
                data['provider'] = 'HVC_Energie'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'EVnetNL') {
                data['provider'] = 'DGB'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Awesems') {
                data['provider'] = 'Essent'
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.provider) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else {
                if (operatorName !== SUSTAINDATA.name) {
                    data['provider'] = 'Unknown'
                }
            }
            return data;
        }))
        .catch(err => console.log(err))
    io.to(users.id).emit('show-charge-points', dataStations)
}
```

Then on the last line I send the data back to the client, so that I can render the charging stations on the map. To make sure that all the users, also people who are colorblind, will understand which charging stations are sustainable or unsustainable I used color and icons to display the sustainability. 

<img src="/public/images/icons.png" width="300">

## 🔍 Getting started
Before you can start you need to follow the installation

### 🔨 Installation
Open the terminal, or use the terminal in your IDE

1. Clone the repository

   ``` git clone https://github.com/lottekoblens/hoe-fossielvrij-is-deze-laadpaal.git ```

2. Install all packages

   npm install || npm i

3. Start the application for development

   npm run dev

4. Open de server and go to the browser: localhost 

   If this doesn't work change your port to another one

## :bookmark: Licentie

![GNU GPL V3](https://www.gnu.org/graphics/gplv3-127x51.png)

This work is licensed under [GNU GPLv3](./LICENSE).
