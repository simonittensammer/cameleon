package at.htl.entity;

import javax.persistence.*;

@Entity
@Table(name = "overlay_object")
@Inheritance(
        strategy = InheritanceType.JOINED
)
public class OverlayObject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Cam cam;
    private double x;
    private double y;
    private double scale;
    private double opacity;

    public OverlayObject() {
    }

    public OverlayObject(Cam cam, double x, double y, double scale, double opacity) {
        this.cam = cam;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.opacity = opacity;
    }

    public Long getId() {
        return id;
    }

//    public void setId(Long id) {
//        this.id = id;
//    }

    public Cam getCam() {
        return cam;
    }

    public void setCam(Cam cam) {
        this.cam = cam;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getScale() {
        return scale;
    }

    public void setScale(double scale) {
        this.scale = scale;
    }

    public double getOpacity() {
        return opacity;
    }

    public void setOpacity(double opacity) {
        this.opacity = opacity;
    }
}
