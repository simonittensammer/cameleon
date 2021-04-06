package at.htl.control;

import at.htl.entity.Cam;
import at.htl.entity.Recording;
import org.apache.commons.codec.binary.Base64;
import org.opencv.core.Core;
import org.opencv.core.Mat;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.Map;
import java.util.concurrent.*;

@ApplicationScoped
public class MotionDetectionService {

    static {System.loadLibrary(Core.NATIVE_LIBRARY_NAME );}

    @Inject
    CamRepository camRepository;

    @Inject
    RecordingRepository recordingRepository;

    final String BASE_PATH = "/home/lorenz/dev/cameleon/cameleon-backend/target/classes/META-INF/resources/recordings";

    ThreadPoolExecutor executorService = (ThreadPoolExecutor)Executors.newCachedThreadPool();
    Map<Long, MotionDetection> motionDetections = new ConcurrentHashMap<>();
    Map<Long, Future<?>> futureTasks = new ConcurrentHashMap<>();

    public void startMotionDetection(Cam cam) {
        System.out.println("motion detection started on cam " + cam.getId());
        motionDetections.put(cam.getId(), new MotionDetection(cam));
        futureTasks.put(cam.getId(), executorService.submit(motionDetections.get(cam.getId())));
        motionDetections.get(cam.getId()).subject.subscribe(this::motionDetected);
        cam.setMotionDetection(true);
    }

    public void stopMotionDetection(Cam cam) {
        System.out.println("motion detection stopped on cam " + cam.getId());
        motionDetections.get(cam.getId()).stop();
        futureTasks.get(cam.getId()).cancel(true);
        executorService.purge();
        motionDetections.remove(cam.getId());
        cam.setMotionDetection(false);
    }

    @Transactional
    public void motionDetected(MotionDetectionEvent mdt) {
        Recording recording = new Recording();
        recording.setDayTime(mdt.date);
        recordingRepository.persist(recording);

        //String path = Paths.get(getClass().getClassLoader().getResource("").getPath()).toAbsolutePath().toString();
//        String filename = "/" + mdt.cam.getId() + "-" + recording.getId() + ".jpg";
//        Imgcodecs.imwrite(BASE_PATH + filename, mdt.image);
//        System.out.println(BASE_PATH + filename);

        recording.setImage(encodeToString(mdt.image));

        mdt.cam.getRecordings().add(recording);
        camRepository.update(mdt.cam);
    }

    private String encodeToString(Mat image) {
        byte[] return_buff = new byte[(int) (image.total() * image.channels())];
        image.get(0, 0, return_buff);
        return Base64.encodeBase64String(return_buff);
    }
}
