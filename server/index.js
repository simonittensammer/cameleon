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
const parse = require('node-html-parser').parse;

//DB

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var urlencodedParser = bodyParser.urlencoded({ extended: false });

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
    const image = cv.imencode('.jpg', frame).toString('base64');
    io.emit('image', image);
}, 1000 / FPS);


/*
// POST - ADDCHANNEL
app.post('/', urlencodedParser, function(req, res) {

    // req.body.name
    // req.body.desc
    // req.body.url

    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cameleonDB");
        
        var newCam = { name: req.body.name, desc: req.body.desc ,ip: req.body.url };
        dbo.collection("cams").insertOne(newCam, function(err, res) {
          if (err) throw err;
          console.log("inserted: " + newCam.name);
          db.close();
        });
        
        dbo.collection("cams").find().toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
    });
    

    
    fs.readFile(path.join(__dirname, '/index.html'), 'utf8', (err,html)=>{
        if(err){
           throw err;
        }
     
        const root = parse(html);
     
        const box = root.querySelector('#testBox');
        box.appendChild('<div>' + req.body.name + '</div>');
     
        //console.log(root.toString()); // This you can write back to file!
        res.send(root.toString());
    });
    
});
*/

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
            var dbo = db.db("cameleon");
            var myquery = { id: data.id + "" };
            dbo.collection("cams").deleteOne(myquery, function(err, obj) {
              if (err) throw err;
              console.log("cam " + data.id + " deleted");
              db.close();
            });
          });
    });

    socket.on('change-stream', data => {

        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db("cameleon");
            
            var query = {id: ''+data};         
            dbo.collection("cams").find(query).toArray((err, result) => {
                if (err) throw err;
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

server.listen(3000)
