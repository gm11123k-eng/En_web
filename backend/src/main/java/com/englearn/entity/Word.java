package com.englearn.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "word", uniqueConstraints = @UniqueConstraint(columnNames = {"memberId", "english"}))
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    @Column(length = 50)
    private String theme;

    @Column(length = 200)
    private String english;

    @Column(length = 200)
    private String korean;

    @Column(columnDefinition = "TEXT")
    private String example;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public Word(Long memberId, String theme, String english, String korean, String example) {
        this.memberId = memberId;
        this.theme = theme;
        this.english = english;
        this.korean = korean;
        this.example = example;
    }
}
