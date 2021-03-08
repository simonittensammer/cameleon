package at.htl.boundary;

import at.htl.control.CamRepository;
import at.htl.control.MotionDetectionService;
import at.htl.entity.Cam;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Path("md")
public class MotionDetectionResource {

    @Inject
    CamRepository camRepository;

    @Inject
    MotionDetectionService motionDetectionService;

    @GET
    @Path("start/{camId}")
    public Response startMotionDetection(@PathParam("camId") Long camId) {
        Cam cam = camRepository.findById(camId);

        if (cam == null) return Response.status(Response.Status.BAD_REQUEST).build();

        motionDetectionService.startMotionDetection(cam);

        return Response.ok(cam).build();
    }

    @GET
    @Path("stop/{camId}")
    public Response stopMotionDetection(@PathParam("camId") Long camId) {
        Cam cam = camRepository.findById(camId);

        if (cam == null) return Response.status(Response.Status.BAD_REQUEST).build();

        motionDetectionService.stopMotionDetection(cam);

        return Response.ok(cam).build();
    }
}
