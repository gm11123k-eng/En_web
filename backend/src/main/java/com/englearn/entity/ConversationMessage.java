package com.englearn.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversation_message")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ConversationMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long conversationId;

    @Column(length = 10)
    private String role;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String correction;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public ConversationMessage(Long conversationId, String role, String content, String correction) {
        this.conversationId = conversationId;
        this.role = role;
        this.content = content;
        this.correction = correction;
    }
}
