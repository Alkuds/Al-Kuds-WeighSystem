const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json()); // for JSON data
app.use(bodyParser.urlencoded({ extended: true })); // for URL-encoded data


app.use((req,res,next) => {
    console.log(req.path , req.method)
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

    next();
})
app.use('/ticket' , require("./routes/ticket"));
app.use('/car' , require("./routes/car"));
app.use('/clients' , require("./routes/clients"));
app.use('/driver' , require("./routes/driver"));
app.use('/irons' , require("./routes/irons"));




app.listen('7000',()=>console.log("runnin on port 7000"));