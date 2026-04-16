package com.englearn.repository;

import com.englearn.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {
    List<Word> findByMemberId(Long memberId);
    List<Word> findByMemberIdAndTheme(Long memberId, String theme);
    boolean existsByMemberIdAndEnglish(Long memberId, String english);
}
