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

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(path.join(__dirname, '../webapp')));

const FPS = 10;
//0 for Webcam
//rtsp://10.0.0.5:8080/h264_ulaw.sdp
//http://10.0.0.5:8080/video
const wCap = new cv.VideoCapture(0);
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

// POST - ADDCHANNEL
app.post('/', urlencodedParser, function(req, res) {

    // req.body.name
    // req.body.desc
    // req.body.url

    console.log(req.body.name);

    /*
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
    */
});

server.listen(3000)