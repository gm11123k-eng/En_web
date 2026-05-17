package com.englearn.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversation")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    @Column(length = 20)
    private String type;

    @Column(length = 255)
    private String scenario;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public Conversation(Long memberId, String type, String scenario) {
        this.memberId = memberId;
        this.type = type;
        this.scenario = scenario;
    }
}
