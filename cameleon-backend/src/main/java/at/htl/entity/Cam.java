package at.htl.entity;

import javax.persistence.*;

@Entity
public class Cam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String url;

    private boolean motionDetection;

    public Cam() {
    }

    public Cam(String name, String desc, String url) {
        this.name = name;
        this.description = desc;
        this.url = url;
        this.motionDetection = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String desc) {
        this.description = desc;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isMotionDetection() {
        return motionDetection;
    }

    public void setMotionDetection(boolean motionDetection) {
        this.motionDetection = motionDetection;
    }
}
