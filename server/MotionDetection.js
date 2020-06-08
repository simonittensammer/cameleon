const cv = require('opencv4nodejs');

module.exports = class MotionDetection {

    stream;
    threshold;
    fps;
    camera;
    interval;

    constructor(stream, threshold, fps) {
        this.stream = stream;
        this.threshold = threshold;
        this.fps = fps;

        console.log(stream);
        
        this.camera = new cv.VideoCapture(stream.ip);  
    }

    start() {
        let lastFrame = this.camera.read()
        lastFrame = lastFrame.cvtColor(cv.COLOR_BGR2GRAY);
        lastFrame = lastFrame.blur(new cv.Size(21, 21));

        this.interval = setInterval(() => {
            let currentFrame = this.camera.read();
            currentFrame = currentFrame.cvtColor(cv.COLOR_BGR2GRAY);
            currentFrame = currentFrame.blur(new cv.Size(21, 21));

            const diff = currentFrame.absdiff(lastFrame);
            let thresh = diff.threshold(this.threshold,255, cv.THRESH_BINARY_INV);
            

            const kernel = new cv.Mat(5, 5, cv.CV_8UC1)
            thresh = thresh.dilate(kernel, new cv.Point2(1, 1), 2, cv.BORDER_CONSTANT);

            const cnts = thresh.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(1, 1));    
            
            for(let i = 1; i < cnts.length; i++) {

                if(cnts[i].area < 500) {
                    continue;
                } else {
                    console.log('motion detected');
                }

            }

            cv.imshow('Motion Detection', thresh);
            cv.waitKey(1);

            lastFrame = currentFrame;
        }, 1000 / this.fps);
    }

    stop() {
        clearInterval(this.interval);
    }

}