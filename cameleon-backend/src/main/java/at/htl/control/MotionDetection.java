package at.htl.control;

import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.videoio.VideoCapture;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static javax.swing.WindowConstants.DISPOSE_ON_CLOSE;

public class MotionDetection implements Runnable{

    static final int FPS = 5;

    private final Mat frame;
    private Mat firstFrame;
    private final Mat gray;
    private final Mat frameDelta;
    private final Mat thresh;
    private List<MatOfPoint> cnts;
    private final VideoCapture camera;

    private boolean running;

    public MotionDetection(String url) {
        frame = new Mat();
        firstFrame = new Mat();
        gray = new Mat();
        frameDelta = new Mat();
        thresh = new Mat();
        cnts = new ArrayList<MatOfPoint>();
        camera = new VideoCapture();

        running = true;

        camera.open(0); //open camera

        camera.read(frame);
        Imgproc.cvtColor(frame, firstFrame, Imgproc.COLOR_BGR2GRAY);
        Imgproc.GaussianBlur(firstFrame, firstFrame, new Size(21, 21), 0);
    }

//    public void init(String url) {
//        // "http://10.0.0.6:8080/video"
//        // "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov"
//        camera.open(url); //open camera
//
//        //set the video size to 512x288
//        //camera.set(Videoio.CAP_PROP_FRAME_WIDTH, 480);
//        //camera.set(Videoio.CAP_PROP_FRAME_HEIGHT, 270);
//
//        camera.read(frame);
//        Imgproc.cvtColor(frame, firstFrame, Imgproc.COLOR_BGR2GRAY);
//        Imgproc.GaussianBlur(firstFrame, firstFrame, new Size(21, 21), 0);
//    }

    @Override
    public void run() {

        while (camera.read(frame) && running) {

            Imgproc.cvtColor(frame, gray, Imgproc.COLOR_BGR2GRAY);
            Imgproc.GaussianBlur(gray, gray, new Size(21, 21), 0);

            Core.absdiff(firstFrame, gray, frameDelta);
            Imgproc.threshold(frameDelta, thresh, 25, 255, Imgproc.THRESH_BINARY);

            Imgproc.dilate(thresh, thresh, new Mat(), new Point(-1, -1), 2);
            Imgproc.findContours(thresh, cnts, new Mat(), Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);

            for(int i=0; i < cnts.size(); i++) {
                if(Imgproc.contourArea(cnts.get(i)) < 500) {
                    continue;
                }
                System.out.println("Motion detected!!!");
                break;
            }

            firstFrame = gray.clone();
            cnts = new ArrayList<MatOfPoint>();

            try {
                TimeUnit.MILLISECONDS.sleep(1000 / FPS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public void stop() {
        running = false;
        camera.release();
    };
}
