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