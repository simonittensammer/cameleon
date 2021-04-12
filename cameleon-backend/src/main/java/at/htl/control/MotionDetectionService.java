package at.htl.control;

import at.htl.entity.Cam;
import at.htl.entity.Recording;
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;

import javax.enterprise.context.ApplicationScoped;
import javax.imageio.ImageIO;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.*;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.*;

@ApplicationScoped
public class MotionDetectionService {

    static {System.loadLibrary(Core.NATIVE_LIBRARY_NAME );}

    @Inject
    CamRepository camRepository;

    @Inject
    RecordingRepository recordingRepository;

    @Inject
    BotService botService;

    ThreadPoolExecutor executorService = (ThreadPoolExecutor)Executors.newCachedThreadPool();
    Map<Long, MotionDetection> motionDetections = new ConcurrentHashMap<>();
    Map<Long, Future<?>> futureTasks = new ConcurrentHashMap<>();

    public void startMotionDetection(Cam cam) {
        System.out.println("motion detection started on cam " + cam.getId());
        motionDetections.put(cam.getId(), new MotionDetection(cam));
        futureTasks.put(cam.getId(), executorService.submit(motionDetections.get(cam.getId())));
        motionDetections.get(cam.getId()).subject.subscribe(this::motionDetected);
        cam.setMotionDetection(true);
        camRepository.update(cam);
    }

    public void stopMotionDetection(Cam cam) {
        System.out.println("motion detection stopped on cam " + cam.getId());
        motionDetections.get(cam.getId()).stop();
        futureTasks.get(cam.getId()).cancel(true);
        executorService.purge();
        motionDetections.remove(cam.getId());
        cam.setMotionDetection(false);
        camRepository.update(cam);
    }

    @Transactional
    public void motionDetected(MotionDetectionEvent mdt) {
        Recording recording = new Recording();
        recording.setDayTime(mdt.date);
        recordingRepository.persist(recording);

        BufferedImage image = Mat2BufImg(mdt.image, ".jpg");

        recording.setImage(imgToBase64String(image, "jpg"));
        botService.camelBot.sendMessage("Motion detected on Cam " + mdt.cam.getId(), image);

        mdt.cam.getRecordings().add(recording);
        camRepository.update(mdt.cam);
    }

    // https://www.programmersought.com/article/34051141455/
    public static BufferedImage Mat2BufImg(Mat matrix, String fileExtension) {
        // convert the matrix into a matrix of bytes appropriate for
        // this file extension
        MatOfByte mob = new MatOfByte();
        Imgcodecs.imencode(fileExtension, matrix, mob);
        // convert the "matrix of bytes" into a byte array
        byte[] byteArray = mob.toArray();
        BufferedImage bufImage = null;
        try {
            InputStream in = new ByteArrayInputStream(byteArray);
            bufImage = ImageIO.read(in);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bufImage;
    }

    // https://stackoverflow.com/questions/7178937/java-bufferedimage-to-png-format-base64-string/25109418
    public static String imgToBase64String(final RenderedImage img, final String formatName)
    {
        final ByteArrayOutputStream os = new ByteArrayOutputStream();

        try
        {
            ImageIO.write(img, formatName, os);
            return Base64.getEncoder().encodeToString(os.toByteArray());
        }
        catch (final IOException ioe)
        {
            throw new UncheckedIOException(ioe);
        }
    }
}
