const express = require('express');
const app = express();
const http = require("http");
const Xray = require("x-ray");
const fetch = require('node-fetch');
const PORT = process.env.PORT || 5151;
const mapboxgl = require('mapbox-gl');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    // mapboxgl.accessToken = 'pk.eyJ1IjoibG90dGVrb2JsZW5zIiwiYSI6ImNsM2s3NjFxMTBjdXUza3F3c2YyZmxuYzgifQ.b4kWvzUQyOmgaSuho3hTFQ';
    // const map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     style: 'mapbox://styles/mapbox/streets-v11', // style URL
    //     center: [-74.5, 40], // starting position [lng, lat]
    //     zoom: 9 // starting zoom
    // });
    res.render('home');
});

app.use((req, res) => {
    res.status(404).send('Sorry, deze pagina kon ik niet vinden.');
});

async function getDataEV() {
    let x = Xray();
    const data = await x("https://ev-database.nl/", ".list-item", [{
        merk: "h2 span",
        model: ".model",
        verbruik: ".efficiency",
        topspeed: ".topspeed",
        snelladen: ".fastcharge_speed_print"
    }]);
    console.log(data, 'dit is data EV')
    return data;
}
getDataEV();
//         console.log(data, 'dit is data EV')

async function getDataShell() {
    const URL = 'https://ui-map.shellrecharge.com/api/map/v2/markers/4.8130318780517545/4.8679635186767545/52.37003725903988/52.39298456934279/15';
    await fetch(URL)
        .then((res) => res.json())
        .then((data) => {
            console.log(data, 'dit is data shell')
        })
        .catch(err => {
            console.log(err)
        })
}
getDataShell()

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});