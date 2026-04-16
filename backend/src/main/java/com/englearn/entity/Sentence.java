package com.englearn.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "sentence", uniqueConstraints = @UniqueConstraint(columnNames = {"memberId", "english"}))
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Sentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    @Column(length = 50)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String english;

    @Column(columnDefinition = "TEXT")
    private String korean;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public Sentence(Long memberId, String category, String english, String korean) {
        this.memberId = memberId;
        this.category = category;
        this.english = english;
        this.korean = korean;
    }
}
