package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;

@Entity
@Table(name = "STUDENT")
public class Student {

    @Id
    @Column(name = "KorisnikId")
    private Integer userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "KorisnikId")
    private User user;

    @Column(name = "Verifikovan")
    private boolean verified = false;

    @Column(name = "VerifikacioniToken")
    private String verificationToken;

    @Column(name = "Email")
    private String email;

    @Column(name = "StudijskiProgram")
    private String studyProgram;

    @Column(name = "Smjer")
    private String major;

    @Column(name = "PendingEmail")
    private String pendingEmail;

    public Student() {}

    public Student(User user,String email, String studyProgram, String major) {
        this.user = user;
        this.email = email;
        this.studyProgram = studyProgram;
        this.major = major;
    }

    public Integer getUserId() {
        return userId;
    }

    public User getUser() {
        return user;
    }

    public String getEmail() {
        return email;
    }

    public String getStudyProgram() {
        return studyProgram;
    }

    public String getMajor() {
        return major;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setStudyProgram(String studyProgram) {
        this.studyProgram = studyProgram;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public boolean getVerified() {
        return verified;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }
    public void setVerified(boolean  verified) {
        this.verified = verified;
    }
    public void setPendingEmail(String pendingEmail) {
        this.pendingEmail = pendingEmail;
    }
    public String getPendingEmail() {
        return pendingEmail;
    }
}
