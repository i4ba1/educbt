package id.co.knt.cbt.model;

import javax.persistence.*;

/**
 * Created by MNI on 8/22/2016.
 */
@Entity
@Table(name="cbt_student_event_time")
public class StudentEventTime {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name="last_updated_time")
    private Long lastUpdatedTime;

    @ManyToOne
    @JoinColumn(name="event_id", nullable = false)
    public Event event;

    @ManyToOne
    @JoinColumn(name="student_id", nullable = false)
    public Student student;

    public Long getId() {
        return id;
    }

    public Long getLastUpdatedTime() {
        return lastUpdatedTime;
    }

    public void setLastUpdatedTime(Long lastUpdatedTime) {
        this.lastUpdatedTime = lastUpdatedTime;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
