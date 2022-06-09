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
const math = require('mathjs')

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/welkom', (req, res) => {
    res.render('welkom');
});

app.get('/offline', (req, res) => {
    res.render('offline');
});

app.get('/laadsessie', (req, res) => {
    res.render('laadsessie');
});

app.use((req, res) => {
    res.status(404).send('Sorry, deze pagina kon ik niet vinden.');
});

let SUSTAINDATA = []
let users = {
    'id': ''
};

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
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

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

    const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${longitude - 0.02}/${longitude + 0.02}/${latitude - 0.015}/${latitude + 0.015}/15`;
    let dataStations = null;

    const energySuppliers = await getData();
    Object.entries(energySuppliers)
        .map(supplier => {
            test = {
                'name': supplier[0],
                'sustain': supplier[1]._value,
            };
            SUSTAINDATA.push(test)
        });

    await fetch(url)
        .then(res => res.json())
        .then(data => dataStations = data)
        .then(data => data.map(data => {
            let operatorName = data.operatorName;
            if (operatorName == 'PitPoint') {
                data.operatorName = 'TotalGasPower';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Allego') {
                data.operatorName = 'Vattenfall';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Community by Shell Recharge') {
                data.operatorName = 'EnergieDirect';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'EV-Box') {
                data.operatorName = 'Engie';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Alfen') {
                data.operatorName = 'Vandebron';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'E-Flux') {
                data.operatorName = 'BudgetEnergie';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'LastMileSolutions') {
                data.operatorName = 'Engie';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Fastned') {
                data.operatorName = 'GreenChoice';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'BlueMarble Charging') {
                data.operatorName = 'Sepa';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Shell Regarge') {
                data.operatorName = 'EnergieDirect';
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Eneco') {
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            } else if (operatorName == 'Vattenfall') {
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain
                    }
                })
            }
            return data;
        }))
        .catch(err => console.log(err))
    io.to(users.id).emit('show-charge-points', dataStations)
}

server.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});