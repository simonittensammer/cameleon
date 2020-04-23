/* Install with npm
opencv4nodejs
express
socket.io
*/

const cv = require('opencv4nodejs');
const path = require('path')
const express = require('express');
const fs = require('fs');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

//DB

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

let currentImage;
let currentStream;

app.use(express.static(path.join(__dirname, '../webapp')));

const FPS = 15;
//0 for Webcam
//rtsp://10.0.0.5:8080/h264_ulaw.sdp
//http://10.0.0.5:8080/video
//http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8 - test stream
let wCap = new cv.VideoCapture('http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8');
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

setInterval(() => {
    const frame = wCap.read();
    currentImage = cv.imencode('.jpg', frame).toString('base64');
    io.emit('image', currentImage);
}, 1000 / FPS);

io.on('connection', socket => {

    // sending cam-data from db to client when connecting
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;

        let data = {};

        const dbo = db.db('cameleon')

        dbo.collection("cams").find().toArray((err, res) => {
            if (err) throw err;
            data.cams = res;
        });

        dbo.collection("overlayObjects").find().toArray((err, res) => {
            if (err) throw err;
            data.overlayObjects = res;
            socket.emit('join', data);
            db.close();
        });
    });

    // client successfully connected
    socket.on('joined', () => {
        console.log(socket.id + ' connected')
    })

    // receiving cam-data from client and persisting it in the db
    socket.on('add-channel', data => {
        console.log(data.name + '\n' + data.desc + '\n' + data.url);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cameleon");
            
            var newCam = { id: ''+data.id, name: data.name, desc: data.desc ,ip: data.url };
            dbo.collection("cams").insertOne(newCam, (err, res) => {
              if (err) throw err;
              console.log("inserted: " + newCam.name);
              db.close();
            });
            
        });
    });

    socket.on('edit-channel', data => {

        console.log(data);
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cameleon");
            var myquery = { id: data.id + "" };
            var newvalues = { $set: {name: data.name, desc: data.desc, ip: data.url } };
            dbo.collection("cams").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("cam " + data.id + " edited");
              db.close();
            });
          });
    });

    socket.on('delete-channel', data => {

        console.log(data);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            let dbo = db.db("cameleon");
            let query = { id: data.channelId + "" };
            dbo.collection("cams").deleteOne(query, function(err, obj) {
                if (err) throw err;
                console.log("cam " + data.channelId + " deleted");
            });

            data.overlayObjectIds.forEach(id => {
                let query = { id: id + "" };
                dbo.collection("overlayObjects").deleteOne(query, function(err, obj) {
                    if (err) throw err;
                    console.log("overlay object " + id + " deleted");
                });
            });

            db.close();
        });
    });

    socket.on('change-stream', data => {

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db("cameleon");
            
            var query = {id: '' + data};         
            dbo.collection("cams").find(query).toArray((err, result) => {
                if (err) throw err;

                currentStream = result[0];

                try {
                    wCap = new cv.VideoCapture(result[0].ip);
                }catch(err) {
                    console.log('unable to connect to this url: ' + result[0].ip);
                    socket.emit('stream-change-error');
                }
                db.close();
            });

        });
    });


    // receiving overlay-object data from client and persisting it in the DB
    socket.on('add-overlay-object', data => {

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cameleon");
            
            var newObject = { 
                channelId: ''+data.channelId,
                id: ''+data.id, 
                type: data.type,
                x: data.x,
                y: data.y,
                scale: data.scale,
                color: data.color,
                opacity: data.opacity,
                text: data.text,
                dataURL: data.dataURL,
                imageName: data.imageName 
            };

            dbo.collection("overlayObjects").insertOne(newObject, (err, res) => {
              if (err) throw err;
              console.log("inserted object: " + newObject.id);
              db.close();
            });     
        });
    });

    socket.on('update-overlay-objects', data => {
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cameleon");

            data.forEach(overlayObject => {
                if(overlayObject != null) {

                    var myquery = { id: overlayObject.id + "" };

                    var newvalues = { $set: { 
                        channelId: ''+overlayObject.channelId,
                        id: ''+overlayObject.id, 
                        type: overlayObject.type,
                        x: overlayObject.x,
                        y: overlayObject.y,
                        scale: overlayObject.scale,
                        color: overlayObject.color,
                        opacity: overlayObject.opacity,
                        text: overlayObject.text,
                        dataURL: overlayObject.dataURL,
                        imageName: overlayObject.imageName 
                    }};
    
                    dbo.collection("overlayObjects").updateOne(myquery, newvalues, function(err, res) {
                        if (err) throw err;
                    });    
                }
            });

            db.close();
        });
    });

    socket.on('delete-overlay-object', data => {

        console.log(data);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("cameleon");
            var myquery = { id: data.id + "" };
            dbo.collection("overlayObjects").deleteOne(myquery, function(err, obj) {
              if (err) throw err;
              console.log("object " + data.id + " deleted");
              db.close();
            });
          });
    });
});

// Telegram Message Bot

var token = '1151670452:AAFFOIPbYPlIXB_lJp5IfoC77DXAUknabZg';
var opt = {
    polling: true
};

const textOpts = {
    parse_mode: 'Markdown'
};

var bot = new TelegramBot(token, opt);

// START
bot.onText(/\/start/, (msg) => {
    var id = msg.chat.id;
    var text = msg.text;

    bot.sendMessage(
        id, 
        "*Welcome to CamelBot!*\n\n" +
        printHelp(),
        textOpts
    );
});

// UPDATE
bot.onText(/\/update/, (msg) => {
    var id = msg.chat.id;
    var text = msg.text;

    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    let hours = ("0" + (date_ob.getHours())).slice(-2);
    let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
    let seconds = ("0" + (date_ob.getSeconds())).slice(-2);
            
    let caption = "This image was recorded on " + year + "-" + month + "-" + date +
        " at " + hours + ":" + minutes + ":" + seconds +
        ' by the camera called "' + currentStream.name + '" with the id ' + currentStream.id + ".";

    let buff = new Buffer(currentImage, 'base64');
    bot.sendPhoto(
        id, 
        buff, 
        {caption: caption},
        textOpts
    );
});

// CURRENTSTREAM
bot.onText(/\/currentStream/, (msg) => {
    var id = msg.chat.id;
    var text = msg.text;

    bot.sendMessage(
        id,
        "*id: *" + currentStream.id + "\n" +
        "*name: *" + currentStream.name + "\n" +
        "*description: *" + currentStream.desc + "\n" +
        "*ip: *" + currentStream.ip,
        textOpts 
    );
});

// HELP
bot.onText(/\/help/, (msg) => {
    var id = msg.chat.id;
    var text = msg.text;

    bot.sendMessage(
        id,
        '' + printHelp(),
        textOpts 
    );
});

// DEFAULT
bot.on('message', function(msg) {
    var id = msg.chat.id;
    var text = msg.text;

    if(!text.toString().includes('start') 
        && !text.toString().includes('update') 
        && !text.toString().includes('currentStream')
        && !text.toString().includes('help')) {
            
            bot.sendMessage(
                id, 
                "I'm sorry, I couldn't understand this. Type " + '"/help"' + " to get an overview of all commands.", 
                textOpts
            );
    }

});

// PRINT HELP Function
function printHelp() {
    let helpString = "*Usage:*\n" +
        "/update - get a live image\n" +
        "/currentStream - get info about current stream\n" +
        "/help - get overview of all commands"

    return helpString;
}

server.listen(3000)