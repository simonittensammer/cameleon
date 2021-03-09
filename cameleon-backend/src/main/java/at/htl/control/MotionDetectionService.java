package at.htl.control;

import at.htl.entity.Cam;
import org.opencv.core.Core;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.Map;
import java.util.concurrent.*;

@ApplicationScoped
public class MotionDetectionService {

    static {System.loadLibrary(Core.NATIVE_LIBRARY_NAME );}

    @Inject
    CamRepository camRepository;

    ThreadPoolExecutor executorService = (ThreadPoolExecutor)Executors.newCachedThreadPool();
    Map<Long, MotionDetection> motionDetections = new ConcurrentHashMap<>();
    Map<Long, Future<?>> futureTasks = new ConcurrentHashMap<>();

    public void startMotionDetection(Cam cam) {
        System.out.println("motion detection started on cam " + cam.getId());
        motionDetections.put(cam.getId(), new MotionDetection(cam));
        futureTasks.put(cam.getId(), executorService.submit(motionDetections.get(cam.getId())));
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
}
