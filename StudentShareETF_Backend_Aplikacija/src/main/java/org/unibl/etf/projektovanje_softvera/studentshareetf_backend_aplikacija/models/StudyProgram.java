package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;

@Entity
@Table(name = "STUDIJSKI_PROGRAM")
public class StudyProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StudijskiProgramId")
    private Integer studyProgramId;

    @Column(name = "Naziv", nullable = false)
    private String name;

    @Column(name = "NazivFakulteta", nullable = false)
    private String facultyName;

    @Column(name = "Opis", nullable = false)
    private String description;

    @Column(name = "Status", nullable = false)
    private String status;

    public StudyProgram() {}

    public Integer getStudyProgramId() {
        return studyProgramId;
    }

    public void setStudyProgramId(Integer studyProgramId) {
        this.studyProgramId = studyProgramId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
