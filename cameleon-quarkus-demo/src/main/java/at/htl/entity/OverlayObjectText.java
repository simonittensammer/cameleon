package at.htl.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "overlay_object_text")
public class OverlayObjectText extends OverlayObject {

    private String text;
    private String color;

    public OverlayObjectText() {
    }

    public OverlayObjectText(Cam cam, double x, double y, double scale, double opacity, String text, String color) {
        super(cam, x, y, scale, opacity);
        this.text = text;
        this.color = color;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
