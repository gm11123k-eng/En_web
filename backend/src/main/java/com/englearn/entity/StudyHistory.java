package com.englearn.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_history")
@Getter
@NoArgsConstructor
public class StudyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    @Column(length = 20)
    private String contentType;

    private Long contentId;

    private LocalDateTime studiedAt;

    private LocalDate nextReviewDate;

    private int reviewStage;

    @Builder
    public StudyHistory(Long memberId, String contentType, Long contentId) {
        this.memberId = memberId;
        this.contentType = contentType;
        this.contentId = contentId;
        this.studiedAt = LocalDateTime.now();
        this.nextReviewDate = LocalDate.now().plusDays(1);
        this.reviewStage = 0;
    }
}
