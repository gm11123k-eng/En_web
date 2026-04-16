package com.englearn.repository;

import com.englearn.entity.StudyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyHistoryRepository extends JpaRepository<StudyHistory, Long> {
    List<StudyHistory> findByMemberId(Long memberId);
    boolean existsByMemberIdAndContentTypeAndContentId(Long memberId, String contentType, Long contentId);
}
