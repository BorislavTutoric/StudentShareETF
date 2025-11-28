package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models.compositeKeys.MajorSubjectId;

@Entity
@Table(name = "PREDMET_NA_SMJERU")
public class MajorSubject {

    @EmbeddedId
    private MajorSubjectId id;

    @ManyToOne
    @MapsId("subjectId")
    @JoinColumn(name = "PredmetId")
    private Subject subject;

    @ManyToOne
    @MapsId("majorId")
    @JoinColumn(name = "SmjerId")
    private Major major;

    @Column(name = "Semestar")
    private Integer semester;

    public MajorSubject() {}

    public MajorSubjectId getId() {
        return id;
    }

    public void setId(MajorSubjectId id) {
        this.id = id;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Major getMajor() {
        return major;
    }

    public void setMajor(Major major) {
        this.major = major;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }
}
