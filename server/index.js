/* Install with npm
opencv4nodejs
express
socket.io
*/

const cv = require('opencv4nodejs');
const path = require('path')
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const FPS = 10;
//0 for Webcam
//rtsp://10.0.0.5:8080/h264_ulaw.sdp
//http://10.0.0.5:8080/video
const wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

setInterval(() => {
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    io.emit('image', image);
}, 1000 / FPS);

// POST - ADDCHANNEL
app.post('/', urlencodedParser, function(req, res) {
    /*
    res.send("channel name: " + req.body.name + "<br>" +
            "channel desc: " + req.body.desc + "<br>" + 
            "url: " + req.body.url);
            */
           
    console.log("name: " + req.body.name + "\n" + "description: " + req.body.desc + "\n" + "url: " + req.body.url);
});

server.listen(3000)