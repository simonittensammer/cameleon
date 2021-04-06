package at.htl.control;

import at.htl.entity.OverlayObject;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.hibernate.Hibernate;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@ApplicationScoped
@Transactional
public class OverlayObjectRepository implements PanacheRepository<OverlayObject> {

    public OverlayObject getById(Long id) {
        OverlayObject overlayObject = findById(id);
        Hibernate.initialize(overlayObject);
        Hibernate.initialize(overlayObject.getCam());
        Hibernate.initialize(overlayObject.getCam().getRecordings());
        return overlayObject;
    }
}
