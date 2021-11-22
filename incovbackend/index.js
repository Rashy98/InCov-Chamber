const {MongoClient} = require('mongodb');
const bodyParser =require( "body-parser");
const mongoose = require('mongoose');
const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const router = require('express').Router();


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

const Employee = require('./routes/employee.route');

app.use('/employee',Employee);


const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1281847",
    key: "54d701fd9801e4649e5a",
    secret: "94f76d84e763415a99e6",
    cluster: "ap2",
    useTLS: true
});
pusher.trigger("my-channel", "my-event", {message: "hello world"});

const uri = process.env.ATLAS_URI;
mongoose.connect("mongodb+srv://admin:admin@incovdbcluster.44qkl.mongodb.net/inCovChamber?retryWrites=true&w=majority", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("Mongo database Successfully connected");

    const msgCollection = connection.collection('employees');
    const changeStream = msgCollection.watch({fullDocument : 'updateLookup'});
    changeStream.on('change', (change) => {
        if (change.operationType === 'update') {
            const messageDetails = change.fullDocument;

            if (messageDetails.dailyReadings.length > 0){
                const length = messageDetails.dailyReadings.length
                /* Created ‘my-event’ event trigger, when new document is added then called this trigger and
                add data which need to pass on UI for real time */
                pusher.trigger('channel_name', 'new_record', {
                    fullName : messageDetails.fullName,
                    empID : messageDetails.empID,
                    heartRate: messageDetails.dailyReadings[length - 1].heartRate,
                    cough : messageDetails.dailyReadings[length - 1].cough,
                    anosmia : messageDetails.dailyReadings[length - 1].anosmia,
                    fever : messageDetails.dailyReadings[length - 1].fever,
                    sob : messageDetails.dailyReadings[length - 1].sob
                });
            }
        }
        ;
    });
})

app.listen(port, () => {
    console.log(`Server is running on port:  ${port}`);
})


