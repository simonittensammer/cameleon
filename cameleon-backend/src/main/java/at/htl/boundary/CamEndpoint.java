package at.htl.boundary;

import at.htl.control.CamRepository;
import at.htl.entity.Cam;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.smallrye.config.common.utils.ConfigSourceUtil;
import org.hibernate.Hibernate;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.PersistenceException;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@Path("cam")
@ApplicationScoped
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Transactional
public class CamEndpoint {

    @Inject
    CamRepository camRepository;

    @GET
    public List<Cam> getAll() {
        return camRepository.streamAll().peek(cam -> {
            Hibernate.initialize(cam);
            Hibernate.initialize(cam.getRecordings());
        }).collect(Collectors.toList());
    }

    @GET
    @Path("/{id}")
    public Cam getOne(@PathParam("id") Long id) {
        return camRepository.getCamById(id);
    }

    @POST
    public Response addCam(Cam cam) {
        camRepository.persist(cam);
        return Response.ok(cam).build();
    }

    @PUT
    public Response putCam(Cam cam) {
        camRepository.update(cam);
        return Response.ok(cam).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        camRepository.delete(camRepository.findById(id));
        return Response.ok().build();
    }
}
