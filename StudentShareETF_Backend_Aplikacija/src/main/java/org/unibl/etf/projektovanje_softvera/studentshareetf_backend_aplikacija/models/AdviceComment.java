package org.unibl.etf.projektovanje_softvera.studentshareetf_backend_aplikacija.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "KOMENTAR_POSTA")
public class AdviceComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "KomentarPostaId")
    private Integer id;

    @Column(name = "Sadrzaj", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "DatumVrijeme", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "Prijavljen")
    private boolean reported = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PostId", nullable = false)
    private Advice advice;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentId", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "KomentarId")
    private AdviceComment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AdviceComment> replies;

    @Version
    @Column(name = "Version", nullable = false)
    private Long version = 0L;

    public AdviceComment() {}

    public AdviceComment(String content, Advice advice, Student student, AdviceComment parentComment) {
        this.content = content;
        this.advice = advice;
        this.student = student;
        this.parentComment = parentComment;
        this.dateTime = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public boolean isReported() {
        return reported;
    }

    public void setReported(boolean reported) {
        this.reported = reported;
    }

    public Advice getAdvice() {
        return advice;
    }

    public void setAdvice(Advice advice) {
        this.advice = advice;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public AdviceComment getParentComment() {
        return parentComment;
    }

    public void setParentComment(AdviceComment parentComment) {
        this.parentComment = parentComment;
    }

    public List<AdviceComment> getReplies() {
        return replies;
    }

    public void setReplies(List<AdviceComment> replies) {
        this.replies = replies;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public Long getVersion() {
        return version;
    }
}