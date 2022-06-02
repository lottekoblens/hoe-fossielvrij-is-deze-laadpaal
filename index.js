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
const INFLUXDB_KEY = process.env.INFLUXDB_KEY;
const client = new InfluxDB({
    url: INFLUXDB_URL,
    token: INFLUXDB_KEY
});
const queryApi = client.getQueryApi(INFLUXDB_ORG);

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.use((req, res) => {
    res.status(404).send('Sorry, deze pagina kon ik niet vinden.');
});

const groupBy = (items, prop) => {
    return items.reduce((out, item) => {
        const value = item[prop];
        if (prop == 'operatorName') {
            out[value] = out[value] || [];
            out[value].push(item);
        } else {
            out[value] = item;
        }
        return out;
    }, {});
}

async function getData() {
    const query = `from(bucket: "providers")
    |> range(start: -28h, stop: -27h)
    |> filter(fn: (r) => r["_measurement"] == "past_providers")`;

    try {
        const rows = await queryApi.collectRows(query);
        const data = groupBy(rows, "_field");
        // console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

io.on('connection', (socket) => {
    socket.on('location', async (coordinations) => {
        getChargingStations(coordinations);
    })
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

    const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${longitude - 0.02}/${longitude + 0.02}/${latitude - 0.02}/${latitude + 0.02}/15`;
    let dataStations = null;

    await fetch(url)
        .then(res => res.json())
        .then(data => dataStations = data)
        .catch(err => console.log(err))

    const energySuppliers = await getData();
    const sortedEnergySuppliers = Object.entries(energySuppliers)
        .sort(([, a], [, b]) => a._value - b._value)
        .map(supplier => [supplier[0], supplier[1]._value]);
    console.log(sortedEnergySuppliers)
    io.emit('show-charge-points', dataStations)
}

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});