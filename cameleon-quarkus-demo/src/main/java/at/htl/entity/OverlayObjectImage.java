package at.htl.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "overlay_object_image")
public class OverlayObjectImage extends OverlayObject {

    private String url;

    public OverlayObjectImage() {
    }

    public OverlayObjectImage(Cam cam, double x, double y, double scale, double opacity, String url) {
        super(cam, x, y, scale, opacity);
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
