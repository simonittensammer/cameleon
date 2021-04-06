package at.htl.control;

import at.htl.entity.OverlayObjectImage;
import at.htl.entity.OverlayObjectText;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.hibernate.Hibernate;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@ApplicationScoped
@Transactional
public class OverlayObjectTextRepository implements PanacheRepository<OverlayObjectText> {

    public OverlayObjectText getById(Long id) {
        OverlayObjectText overlayObjectText = findById(id);
        Hibernate.initialize(overlayObjectText);
        Hibernate.initialize(overlayObjectText.getCam());
        Hibernate.initialize(overlayObjectText.getCam().getRecordings());
        return overlayObjectText;
    }
}
