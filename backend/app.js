const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin : '*' , 
    credential : true,
    'access-control-allow-credentials': true,
    optionSuccessStatus : 200 
}
app.use(cors(corsOptions));
app.use(express.urlencoded({extended:false}));
// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use((req,res,next) => {
    console.log(req.path , req.method)
    console.log(req.body)
    
    next();
})
app.use('/ticket' , require("./routes/ticket"));
app.use('/car' , require("./routes/car"));
app.use('/clients' , require("./routes/clients"));
app.use('/driver' , require("./routes/driver"));
app.use('/irons' , require("./routes/irons"));




app.listen('7000',console.log("runnin on port 7000"));