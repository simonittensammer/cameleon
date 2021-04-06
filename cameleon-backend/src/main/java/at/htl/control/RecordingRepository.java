package at.htl.control;

import at.htl.entity.Recording;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RecordingRepository implements PanacheRepository<Recording> {
}
