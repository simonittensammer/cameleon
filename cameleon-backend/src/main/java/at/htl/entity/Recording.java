package at.htl.entity;

import org.hibernate.annotations.Type;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Recording {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonbTransient
    private Long id;

    private LocalDateTime dayTime;

    @Type(type = "text")
    private String image;

    public Recording() {
    }

    public Recording(LocalDateTime dayTime, String image) {
        this.dayTime = dayTime;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDayTime() {
        return dayTime;
    }

    public void setDayTime(LocalDateTime dayTime) {
        this.dayTime = dayTime;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
