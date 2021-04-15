package at.htl.boundary;

import at.htl.control.CamRepository;
import at.htl.control.OverlayObjectImageRepository;
import at.htl.control.OverlayObjectRepository;
import at.htl.control.OverlayObjectTextRepository;
import at.htl.entity.Cam;
import at.htl.entity.OverlayObject;
import at.htl.entity.OverlayObjectImage;
import at.htl.entity.OverlayObjectText;
import org.hibernate.Hibernate;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.JsonObject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

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
        return objectRepository.listAll().stream().peek(o -> {
            Hibernate.initialize(o);
            Hibernate.initialize(o.getCam());
            Hibernate.initialize(o.getCam().getRecordings());
        }).collect(Collectors.toList());
    }

    @POST
    @Path("img")
    public Response addOverlayImage(JsonObject jsonObject) {
        Cam cam = camRepository.getCamById(jsonObject.getJsonNumber("cam").longValue());

        OverlayObjectImage img = new OverlayObjectImage(
                cam,
                jsonObject.getJsonNumber("x").doubleValue(),
                jsonObject.getJsonNumber("y").doubleValue(),
                jsonObject.getJsonNumber("scale").doubleValue(),
                jsonObject.getJsonNumber("opacity").doubleValue(),
                jsonObject.getJsonString("url").getString()
        );

        imageRepository.persist(img);
        return Response.ok(img).build();
    }

    @POST
    @Path("txt")
    public Response addOverlayText(JsonObject jsonObject) {

        Cam cam = camRepository.getCamById(jsonObject.getJsonNumber("cam").longValue());

        OverlayObjectText txt = new OverlayObjectText(
                cam,
                jsonObject.getJsonNumber("x").doubleValue(),
                jsonObject.getJsonNumber("y").doubleValue(),
                jsonObject.getJsonNumber("scale").doubleValue(),
                jsonObject.getJsonNumber("opacity").doubleValue(),
                jsonObject.getJsonString("text").getString(),
                jsonObject.getJsonString("color").getString()
        );

        textRepository.persist(txt);
        return Response.ok(txt).build();
    }

    @GET
    @Path("img/{id}")
    public OverlayObjectImage getOverlayImageById(@PathParam("id") Long id) {
        return imageRepository.getById(id);
    }

    @GET
    @Path("txt/{id}")
    public OverlayObjectText getOverlayTextById(@PathParam("id") Long id) {
        return textRepository.getById(id);
    }

    @DELETE
    @Path("img/{id}")
    public Response deleteOverlayImage(@PathParam("id") Long id) {
        imageRepository.delete(imageRepository.getById(id));
        return Response.ok().build();
    }

    @DELETE
    @Path("txt/{id}")
    public Response deleteOverlayText(@PathParam("id") Long id) {
        textRepository.delete(textRepository.getById(id));
        return Response.ok().build();
    }

    @DELETE
    @Path("{id}")
    public Response deleteOverlayObject(@PathParam("id") Long id) {
        objectRepository.deleteById(id);
        return Response.ok().build();
    }
}
