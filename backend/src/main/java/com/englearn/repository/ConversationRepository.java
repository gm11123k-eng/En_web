package com.englearn.repository;

import com.englearn.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByMemberIdAndTypeOrderByCreatedAtDesc(Long memberId, String type);
}
