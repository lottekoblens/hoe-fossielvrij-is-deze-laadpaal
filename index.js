const express = require('express');
const app = express();
const http = require("http");
const Xray = require("x-ray");
// const PORT = process.env.PORT || 5151;
// const fetch = require('node-fetch');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use((req, res) => {
    res.status(404).send('Sorry, deze pagina kon ik niet vinden.');
});

async function getDataEV() {
    var x = Xray();
    const data = await x("https://ev-database.nl/", ".list-item", [{
        merk: "h2 span",
        model: ".model",
        verbruik: ".efficiency",
        topspeed: ".topspeed",
        snelladen: ".fastcharge_speed_print"
    }]);
    return data;
}


//create a server object:
http
    .createServer(async function (req, res) {
        const data = await getDataEV();
        console.log(data)
        // res.write(JSON.stringify(data, null, 2)); //write a response to the client
        res.end(); //end the response
    })
    .listen(8080); //the server object listens on port 8080


// app.listen(PORT, () => {
//     console.log(`Listening on port: ${PORT}`);
// });