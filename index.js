const Xray = require("x-ray");
const PORT = process.env.PORT || 5151;
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
    Server
} = require('socket.io');
const io = new Server(server);
const fetch = require('node-fetch');
const InfluxDatabase = require('@influxdata/influxdb-client');
const InfluxDB = InfluxDatabase.InfluxDB;
const INFLUXDB_URL = 'https://gc-acc.antst.net';
const INFLUXDB_ORG = 'grca';
const INFLUXDB_KEY = 'QvDOolmSU478M5YkeD17nVeFb4FA_ngo-P0LNokCe6dS2Y10hxIa1zoQ1ZZ9RipKIds-TO7at1-Wgh7Qi44gAQ==';
const client = new InfluxDB({
    url: INFLUXDB_URL,
    token: INFLUXDB_KEY
});
const queryApi = client.getQueryApi(INFLUXDB_ORG);

const groupBy = (items, prop) => {
    return items.reduce((out, item) => {
        const value = item[prop];
        out[value] = out[value] || [];
        out[value].push(item);
        return out;
    }, {});
};

async function getData() {
    const query = `
    from(bucket: "providers")
      |> range(start: -28h, stop: -24h)
      |> filter(fn: (r) => r["_measurement"] == "past_providers")
    `;
    try {
        const rows = await queryApi.collectRows(query);
        const data = Object.entries(groupBy(rows, "_field"));
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}


app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.use((req, res) => {
    res.status(404).send('Sorry, deze pagina kon ik niet vinden.');
});

io.on('connection', (socket) => {
    socket.on('location', (coordinations) => {
        getChargingStations(coordinations);
    });
});

// async function getDataEV() {
//     let x = Xray();
//     const data = await x("https://ev-database.nl/", ".list-item", [{
//         merk: "h2 span",
//         model: ".model",
//         verbruik: ".efficiency",
//         topspeed: ".topspeed",
//         snelladen: ".fastcharge_speed_print"
//     }]);
//     console.log(data, 'dit is data EV')
//     return data;
// }
// getDataEV();
//         console.log(data, 'dit is data EV')

async function getChargingStations(coordinations) {
    const latitude = coordinations.latitude;
    const longitude = coordinations.longitude;

    const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${longitude - 0.03}/${longitude + 0.03}/${latitude - 0.03}/${latitude + 0.03}/15`;
    let dataStations = null;

    await fetch(url)
        .then(res => res.json())
        .then(data => dataStations = data)
        .catch(err => console.log(err))

    const availableStations = dataStations.filter(data => {
        return data.status == 'Available'
    });

    io.emit('show-charge-points', availableStations)
}

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});