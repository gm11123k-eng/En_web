package com.englearn.repository;

import com.englearn.entity.Sentence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SentenceRepository extends JpaRepository<Sentence, Long> {
    List<Sentence> findByMemberId(Long memberId);
    List<Sentence> findByMemberIdAndCategory(Long memberId, String category);
    boolean existsByMemberIdAndEnglish(Long memberId, String english);
}
