const cv = require('opencv4nodejs');
const fs = require('fs');

module.exports = class MotionDetection {

    stream;
    threshold;
    fps;
    camera;
    interval;
    currentFrame;
    currentFrameRaw;
    lastFrame;

    constructor(stream, threshold, fps) {
        this.stream = stream;
        this.threshold = threshold;
        this.fps = fps;

        console.log(stream);
        
        this.camera = new cv.VideoCapture(stream.ip);  
    }

    start() {
        this.lastFrame = this.camera.read()
            .cvtColor(cv.COLOR_BGR2GRAY)
            .blur(new cv.Size(21, 21))
            .rescale(0.5);

        this.interval = setInterval(() => {
            try {
                this.currentFrameRaw = this.camera.read();
                this.currentFrame = this.currentFrameRaw
                    .cvtColor(cv.COLOR_BGR2GRAY)
                    .blur(new cv.Size(21, 21))
                    .rescale(0.5)
            } catch (error) {
                this.camera = new cv.VideoCapture('http://10.0.0.7:8080/video');
                console.log('camera reset');
                console.log(error);
            }
        
            const diff = this.currentFrame.absdiff(this.lastFrame);
            let thresh = diff.threshold(this.threshold, 255, cv.THRESH_BINARY_INV);
            
        
            const kernel = new cv.Mat(5, 5, cv.CV_8UC1)
            thresh = thresh.dilate(kernel, new cv.Point2(1, 1), 2, cv.BORDER_CONSTANT);
        
            const cnts = thresh.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(1, 1));    
            
            for(let i = 1; i < cnts.length; i++) {
        
                if(cnts[i].area < 500) {
                    continue;
                } else {
                    console.log('motion detected');
                    
        
                    const now = new Date();
                    const dateString = now.getDate() + '-' + 
                        (now.getMonth() + 1) + '-' + 
                        now.getFullYear() + ',' + 
                        String("0" + now.getHours()).slice(-2) + '-' + 
                        String("0" + now.getMinutes()).slice(-2) + '-' + 
                        String("0" + now.getSeconds()).slice(-2) + '-' +
                        now.getMilliseconds();
        
                    fs.writeFile('./surveillance-images/' + dateString + '.jpg', cv.imencode('.jpg', this.currentFrameRaw), function (err) {
                        if (err) return console.log(err);
                      });
                }
        
            }
        
            cv.imshow('Motion Detection', thresh);
            cv.waitKey(1);
        
            this.lastFrame = this.currentFrame;
        }, 1000 / this.fps);
    }

    stop() {
        clearInterval(this.interval);
    }

}