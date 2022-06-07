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

app.get('/offline', (req, res) => {
    res.render('offline');
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

    const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${longitude - 0.02}/${longitude + 0.02}/${latitude - 0.02}/${latitude + 0.02}/15`;
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

    // console.log(SUSTAINDATA)


    await fetch(url)
        .then(res => res.json())
        .then(data => dataStations = data)
        .then(data => data.map(data => {
            let operatorName = data.operatorName;
            if (operatorName == 'PitPoint') {
                data.operatorName = 'TotalGasPower';
                // SUSTAINDATA.hasOwnProperty('name: TotalGasPower')
                SUSTAINDATA.find((SUSTAINDATA) => {
                    if (SUSTAINDATA.name == data.operatorName) {
                        data.sustain = SUSTAINDATA.sustain

                        // if (data.sustain < average) {
                        //     // data.sustain = 'Duurzaam'
                        //     data.sustain = 'Duurzaam'
                        // } else if (data.sustain > average) {
                        //     // data.sustain = 'Duurzaam'
                        //     data.sustain = 'Niet duurzaam'
                        // }
                        // if (data.sustain < (average / 100 * 25)) {
                        //     data.sustain = 'Duurzaam'
                        // } else if (data.sustain > (average / 100 * 25) && data.sustain < (average / 100 * 50)) {
                        //     data.sustain = 'Redelijk duurzaam'
                        // } else if (data.sustain > (average / 100 * 50) && data.sustain < (average / 100 * 75)) {
                        //     data.sustain = 'Niet echt duurzaam'
                        // } else if (data.sustain > (average / 100 * 75) && data.sustain < average) {
                        //     data.sustain = 'Niet duurzaam'
                        // }
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
        })).then(
            data => {
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    if (isFinite(data[i].sustain)) { //The global isFinite() function determines whether the passed value is a finite number. 
                        //If needed, the parameter is first converted to a number. Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite
                        sum += +data[i].sustain;
                    }
                }
                const average = sum / data.length

                console.log(average)
                // for (i = 0; i < data.length; i++) {
                //     if (data[i].sustain < average) {
                //         data[i].sustain = 'Duurzaam'
                //     } else if (data[i].sustain === 'undefined') {
                //         data[i].sustain = 'Undefined'
                //     } else {
                //         data[i].sustain = "Niet duurzaam"
                //     }
                // }
            }
        )
        .catch(err => console.log(err))
    io.to(users.id).emit('show-charge-points', dataStations)
}

server.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});