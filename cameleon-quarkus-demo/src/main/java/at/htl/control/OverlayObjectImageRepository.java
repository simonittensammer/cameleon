package at.htl.control;

import at.htl.entity.OverlayObjectImage;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@ApplicationScoped
@Transactional
public class OverlayObjectImageRepository implements PanacheRepository<OverlayObjectImage> {
}
