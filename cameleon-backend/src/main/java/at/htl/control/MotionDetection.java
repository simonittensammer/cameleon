package at.htl.control;

import at.htl.entity.Cam;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import org.opencv.videoio.VideoCapture;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class MotionDetection implements Runnable{

    static final int FPS = 5;

    private final Cam cam;
    private final Mat frame;
    private Mat firstFrame;
    private final Mat gray;
    private final Mat frameDelta;
    private final Mat thresh;
    private List<MatOfPoint> cnts;
    private final VideoCapture camera;

    private boolean running;

    private final int ACTUAL_MD_COOLDOWN = 10;
    private LocalDateTime lastActualMotionDetection;

    private final int CONTINUOUS_MD_COOLDOWN = 1;
    private final int CONTINUOUS_MD_THRESHOLD = 10;
    private int continuousMotionDetections;
    private LocalDateTime lastMotionDetection;

    public MotionDetection(Cam cam) {
        this.cam = cam;
        frame = new Mat();
        firstFrame = new Mat();
        gray = new Mat();
        frameDelta = new Mat();
        thresh = new Mat();
        cnts = new ArrayList<MatOfPoint>();
        camera = new VideoCapture();

        running = true;

        lastMotionDetection = LocalDateTime.now();
        lastActualMotionDetection = LocalDateTime.now().minusSeconds(ACTUAL_MD_COOLDOWN);
        continuousMotionDetections = 0;

        camera.open(cam.getUrl()); //open camera

        camera.read(frame);
        Imgproc.cvtColor(frame, firstFrame, Imgproc.COLOR_BGR2GRAY);
        Imgproc.GaussianBlur(firstFrame, firstFrame, new Size(21, 21), 0);
    }

    @Override
    public void run() {

        while (camera.read(frame) && running) {

//            System.out.println("\nlast actual md " + ChronoUnit.SECONDS.between(lastActualMotionDetection, LocalDateTime.now()));
//            System.out.println("last md " + ChronoUnit.SECONDS.between(lastMotionDetection, LocalDateTime.now()));
//            System.out.println("concurrent mds " + concurrentMotionDetections);

            if (ChronoUnit.SECONDS.between(lastActualMotionDetection, LocalDateTime.now()) >= ACTUAL_MD_COOLDOWN) {
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

                    if (ChronoUnit.SECONDS.between(lastMotionDetection, LocalDateTime.now()) >= CONTINUOUS_MD_COOLDOWN) {
                        continuousMotionDetections = 0;
                    } else {
                        continuousMotionDetections++;
                    }

                    lastMotionDetection = LocalDateTime.now();

                    if (continuousMotionDetections >= CONTINUOUS_MD_THRESHOLD) {
                        System.out.println("Motion detected!!!");
                        continuousMotionDetections = 0;
                        lastActualMotionDetection = LocalDateTime.now();
                        // writeToFile(frame);
                    }

                    break;
                }

                firstFrame = gray.clone();
                cnts = new ArrayList<MatOfPoint>();
            }

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
