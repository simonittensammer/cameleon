package at.htl.boundary;

import at.htl.control.CamRepository;
import at.htl.control.OverlayObjectImageRepository;
import at.htl.control.OverlayObjectRepository;
import at.htl.control.OverlayObjectTextRepository;
import at.htl.entity.Cam;
import at.htl.entity.OverlayObject;
import at.htl.entity.OverlayObjectImage;
import at.htl.entity.OverlayObjectText;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.JsonObject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("overlay")
@ApplicationScoped
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Transactional
public class OverlayObjectEndpoint {

    @Inject
    CamRepository camRepository;

    @Inject
    OverlayObjectRepository objectRepository;

    @Inject
    OverlayObjectImageRepository imageRepository;

    @Inject
    OverlayObjectTextRepository textRepository;

    @GET
    public List<OverlayObject> getAll() {
        return objectRepository.listAll();
    }

    @POST
    @Path("img")
    public Response addOverlayImage(JsonObject jsonObject) {
        Cam cam = camRepository.findById(jsonObject.getJsonNumber("cam").longValue());

        OverlayObjectImage img = new OverlayObjectImage(
                cam,
                jsonObject.getJsonNumber("x").longValue(),
                jsonObject.getJsonNumber("y").longValue(),
                jsonObject.getJsonNumber("scale").longValue(),
                jsonObject.getJsonNumber("opacity").longValue(),
                jsonObject.getJsonString("url").getString()
        );

        imageRepository.persist(img);
        return Response.ok(img).build();
    }

    @POST
    @Path("txt")
    public Response addOverlayText(JsonObject jsonObject) {
        Cam cam = camRepository.findById(jsonObject.getJsonNumber("cam").longValue());

        OverlayObjectText txt = new OverlayObjectText(
                cam,
                jsonObject.getJsonNumber("x").longValue(),
                jsonObject.getJsonNumber("y").longValue(),
                jsonObject.getJsonNumber("scale").longValue(),
                jsonObject.getJsonNumber("opacity").longValue(),
                jsonObject.getJsonString("text").getString(),
                jsonObject.getJsonString("color").getString()
        );

        textRepository.persist(txt);
        return Response.ok(txt).build();
    }

    @GET
    @Path("img/{id}")
    public OverlayObjectImage getOverlayImageById(@PathParam("id") Long id) {
        return imageRepository.findById(id);
    }

    @GET
    @Path("txt/{id}")
    public OverlayObjectText getOverlayTextById(@PathParam("id") Long id) {
        return textRepository.findById(id);
    }

    @DELETE
    @Path("img/{id}")
    public Response deleteOverlayImage(@PathParam("id") Long id) {
        imageRepository.delete(imageRepository.findById(id));
        return Response.ok().build();
    }

    @DELETE
    @Path("txt/{id}")
    public Response deleteOverlayText(@PathParam("id") Long id) {
        textRepository.delete(textRepository.findById(id));
        return Response.ok().build();
    }
}
