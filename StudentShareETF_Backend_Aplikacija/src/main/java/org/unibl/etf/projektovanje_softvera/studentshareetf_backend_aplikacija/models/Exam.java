package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ISPIT")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IspitId")
    private Integer examId;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "Sala", nullable = false)
    private String room;

    @Column(name = "Naziv", nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "SmjerId", nullable = false)
    private Major major;

    public Exam() {}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Exam exam = (Exam) o;

        if (title != null ? !title.equals(exam.title) : exam.title != null) return false;
        return major != null ? major.equals(exam.major) : exam.major == null;
    }

    @Override
    public int hashCode() {
        int result = title != null ? title.hashCode() : 0;
        result = 31 * result + (major != null ? major.hashCode() : 0);
        return result;
    }


    public Integer getExamId() {
        return examId;
    }

    public void setExamId(Integer examId) {
        this.examId = examId;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Major getMajor() {
        return major;
    }

    public void setMajor(Major major) {
        this.major = major;
    }
}

