package at.htl.control;

import at.htl.entity.Cam;
import org.opencv.core.Mat;

import java.time.LocalDateTime;

public class MotionDetectionEvent {

    Cam cam;
    Mat image;
    LocalDateTime date;

    public MotionDetectionEvent(Cam cam, Mat image) {
        this.cam = cam;
        this.image = image;
        this.date = LocalDateTime.now();
    }
}
