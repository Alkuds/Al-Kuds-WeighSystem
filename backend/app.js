require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SerialPort } = require('serialport')
const path = require("path");
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json()); // for JSON data

// const serialPort2 = new SerialPort({ path: 'COM1', baudRate: 9600});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("mongo db connected "))
    .catch(err => console.log(err));



app.use((req,res,next) => {
    console.log(req.path , req.method)
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

    next();
})
app.use('/order' , require("./routes/order"));
app.use('/car' , require("./routes/car"));
app.use('/clients' , require("./routes/clients"));
app.use('/factory' , require("./routes/factory"));
app.use('/driver' , require("./routes/driver"));
app.use('/irons' , require("./routes/irons"));
app.use('/ticketId' , require("./routes/ticketId"));
app.use('/wallet' , require("./routes/wallets"));
app.use('/user' , require("./routes/user"));

if (false) {
	app.use(express.static(path.join(__dirname, '../frontend/build')))
}

let readData;
// serialPort2.on("open", function () {
//     console.log("-- Connection opened --", serialPort2);
//     serialPort2.on("data", function (data) {
//         let x = data.toString().split('+');
//         if (x.length>1){ 
//             readData = x[1].trim()
//         }
//     });
// });

// app.get("/getWeight",(req,res)=>{
//     console.log("in api")
//     res.json(readData);
// });

if (false) {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    });
}

app.listen('8000',()=>console.log("runnin on port 7000"));