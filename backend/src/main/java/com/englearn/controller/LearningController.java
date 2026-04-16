package com.englearn.controller;

import com.englearn.entity.Sentence;
import com.englearn.entity.StudyHistory;
import com.englearn.entity.Word;
import com.englearn.repository.SentenceRepository;
import com.englearn.repository.StudyHistoryRepository;
import com.englearn.repository.WordRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LearningController {

    private final WordRepository wordRepository;
    private final SentenceRepository sentenceRepository;
    private final StudyHistoryRepository studyHistoryRepository;
    private final EntityManager entityManager;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    private String callGemini(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
        Map<String, Object> request = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );
        try {
            String response = restTemplate.postForObject(url, request, String.class);
            JsonNode root = objectMapper.readTree(response);
            return root.at("/candidates/0/content/parts/0/text").asText();
        } catch (Exception e) {
            return null;
        }
    }

    private static final Map<String, List<Map<String, String>>> WORD_FALLBACK = Map.of(
            "토익", List.of(
                    Map.of("en", "accomplish", "ko", "성취하다", "ex", "She accomplished her goal ahead of schedule."),
                    Map.of("en", "deliberate", "ko", "신중한", "ex", "It was a deliberate decision to expand overseas."),
                    Map.of("en", "approximately", "ko", "대략", "ex", "Approximately 200 people attended the conference."),
                    Map.of("en", "implement", "ko", "시행하다", "ex", "The company will implement the new policy next month."),
                    Map.of("en", "negotiate", "ko", "협상하다", "ex", "They negotiated a better deal with the supplier.")
            ),
            "여행", List.of(
                    Map.of("en", "itinerary", "ko", "여행 일정", "ex", "Please check your itinerary before departure."),
                    Map.of("en", "accommodation", "ko", "숙소", "ex", "We booked accommodation near the beach."),
                    Map.of("en", "departure", "ko", "출발", "ex", "The departure time has been changed to 3 PM."),
                    Map.of("en", "luggage", "ko", "짐", "ex", "Please keep your luggage with you at all times."),
                    Map.of("en", "reservation", "ko", "예약", "ex", "I'd like to make a reservation for two nights.")
            ),
            "일상", List.of(
                    Map.of("en", "grocery", "ko", "식료품", "ex", "I need to buy some groceries after work."),
                    Map.of("en", "commute", "ko", "통근하다", "ex", "It takes me an hour to commute to work."),
                    Map.of("en", "household", "ko", "가정의", "ex", "We need to buy some household supplies."),
                    Map.of("en", "appointment", "ko", "약속", "ex", "I have a dentist appointment tomorrow."),
                    Map.of("en", "errand", "ko", "심부름", "ex", "I have to run some errands this afternoon.")
            )
    );

    private static final Map<String, List<Map<String, String>>> SENTENCE_FALLBACK = Map.of(
            "기초", List.of(
                    Map.of("en", "How are you doing today?", "ko", "오늘 어떻게 지내세요?"),
                    Map.of("en", "Nice to meet you.", "ko", "만나서 반갑습니다."),
                    Map.of("en", "Could you say that again?", "ko", "다시 한번 말해주시겠어요?")
            ),
            "문법", List.of(
                    Map.of("en", "If I had known, I would have told you.", "ko", "알았더라면 말해줬을 텐데."),
                    Map.of("en", "The more you practice, the better you get.", "ko", "연습할수록 더 잘하게 된다."),
                    Map.of("en", "Not only did he pass, but he also got the highest score.", "ko", "그는 합격했을 뿐만 아니라 최고 점수를 받았다.")
            ),
            "고급", List.of(
                    Map.of("en", "It is imperative that we address this issue immediately.", "ko", "이 문제를 즉시 해결하는 것이 필수적이다."),
                    Map.of("en", "A paradigm shift in thinking is necessary.", "ko", "사고의 패러다임 전환이 필요하다."),
                    Map.of("en", "The data corroborates the findings of previous studies.", "ko", "이 데이터는 이전 연구 결과를 뒷받침한다.")
            )
    );

    @PostMapping("/words/generate")
    public ResponseEntity<?> generateWords(@RequestBody Map<String, Object> body) {
        Long memberId = Long.valueOf(body.get("memberId").toString());
        String theme = body.get("theme").toString();
        int count = body.containsKey("count") ? Integer.parseInt(body.get("count").toString()) : 5;

        List<Word> saved = new ArrayList<>();

        List<Word> existing = wordRepository.findByMemberIdAndTheme(memberId, theme);
        String exclude = "";
        if (!existing.isEmpty()) {
            List<String> known = existing.stream().map(Word::getEnglish).toList();
            exclude = " 다음 단어는 이미 배웠으니 제외해: " + String.join(", ", known) + ".";
        }

        String prompt = theme + " 테마의 영어 단어 " + count + "개를 JSON 배열로 생성해줘." + exclude +
                " 각 항목은 {\"en\":\"영어단어\",\"ko\":\"한국어뜻\",\"ex\":\"영어예문\"} 형식이야." +
                " JSON 배열만 출력하고 다른 텍스트는 쓰지 마.";

        String aiResult = callGemini(prompt);

        if (aiResult != null) {
            try {
                String json = aiResult;
                if (json.contains("```")) {
                    json = json.replaceAll("```json\\s*", "").replaceAll("```\\s*", "");
                }
                JsonNode arr = objectMapper.readTree(json.trim());
                for (JsonNode item : arr) {
                    String en = item.get("en").asText();
                    if (wordRepository.existsByMemberIdAndEnglish(memberId, en)) continue;
                    Word word = Word.builder()
                            .memberId(memberId)
                            .theme(theme)
                            .english(en)
                            .korean(item.get("ko").asText())
                            .example(item.get("ex").asText())
                            .build();
                    saved.add(wordRepository.save(word));
                }
                return ResponseEntity.ok(Map.of("words", saved, "count", saved.size()));
            } catch (Exception e) {
                // AI 응답 파싱 실패 시 fallback
            }
        }

        List<Map<String, String>> pool = WORD_FALLBACK.getOrDefault(theme, WORD_FALLBACK.get("토익"));
        for (int i = 0; i < Math.min(count, pool.size()); i++) {
            Map<String, String> w = pool.get(i);
            Word word = Word.builder()
                    .memberId(memberId).theme(theme)
                    .english(w.get("en")).korean(w.get("ko")).example(w.get("ex"))
                    .build();
            saved.add(wordRepository.save(word));
        }
        return ResponseEntity.ok(Map.of("words", saved, "count", saved.size()));
    }

    @GetMapping("/words")
    public ResponseEntity<?> getWords(@RequestParam Long memberId,
                                      @RequestParam(required = false) String theme) {
        List<Word> words;
        if (theme != null && !theme.isEmpty()) {
            words = wordRepository.findByMemberIdAndTheme(memberId, theme);
        } else {
            words = wordRepository.findByMemberId(memberId);
        }
        return ResponseEntity.ok(words);
    }

    @GetMapping("/words/search")
    public ResponseEntity<?> searchWords(@RequestParam Long memberId,
                                         @RequestParam String keyword) {
        String sql = "SELECT * FROM word WHERE member_id = " + memberId +
                " AND (english LIKE '%" + keyword + "%' OR korean LIKE '%" + keyword + "%')";
        List<?> results = entityManager.createNativeQuery(sql, Word.class).getResultList();
        return ResponseEntity.ok(results);
    }

    @PostMapping("/sentences/generate")
    public ResponseEntity<?> generateSentences(@RequestBody Map<String, Object> body) {
        String category = body.get("category").toString();
        int count = body.containsKey("count") ? Integer.parseInt(body.get("count").toString()) : 5;

        String prompt = category + " 수준의 영어 문장 " + count + "개를 JSON 배열로 생성해줘." +
                " 매번 다양하고 새로운 문장으로 만들어줘." +
                " 각 항목은 {\"en\":\"영어문장\",\"ko\":\"한국어번역\"} 형식이야." +
                " JSON 배열만 출력하고 다른 텍스트는 쓰지 마.";

        String aiResult = callGemini(prompt);

        if (aiResult != null) {
            try {
                String json = aiResult;
                if (json.contains("```")) {
                    json = json.replaceAll("```json\\s*", "").replaceAll("```\\s*", "");
                }
                JsonNode arr = objectMapper.readTree(json.trim());
                List<Map<String, String>> sentences = new ArrayList<>();
                for (JsonNode item : arr) {
                    sentences.add(Map.of("english", item.get("en").asText(), "korean", item.get("ko").asText()));
                }
                return ResponseEntity.ok(Map.of("sentences", sentences, "count", sentences.size()));
            } catch (Exception e) {
                // fallback
            }
        }

        List<Map<String, String>> pool = SENTENCE_FALLBACK.getOrDefault(category, SENTENCE_FALLBACK.get("기초"));
        List<Map<String, String>> result = new ArrayList<>();
        for (int i = 0; i < Math.min(count, pool.size()); i++) {
            Map<String, String> s = pool.get(i);
            result.add(Map.of("english", s.get("en"), "korean", s.get("ko")));
        }
        return ResponseEntity.ok(Map.of("sentences", result, "count", result.size()));
    }

    @GetMapping("/sentences")
    public ResponseEntity<?> getSentences(@RequestParam Long memberId,
                                          @RequestParam(required = false) String category) {
        List<Sentence> sentences;
        if (category != null && !category.isEmpty()) {
            sentences = sentenceRepository.findByMemberIdAndCategory(memberId, category);
        } else {
            sentences = sentenceRepository.findByMemberId(memberId);
        }
        return ResponseEntity.ok(sentences);
    }

    @PostMapping("/study-history")
    public ResponseEntity<?> saveStudyHistory(@RequestBody Map<String, Object> body) {
        Long memberId = Long.valueOf(body.get("memberId").toString());
        String contentType = body.get("contentType").toString();
        Long contentId = Long.valueOf(body.get("contentId").toString());

        StudyHistory history = StudyHistory.builder()
                .memberId(memberId)
                .contentType(contentType)
                .contentId(contentId)
                .build();
        studyHistoryRepository.save(history);

        return ResponseEntity.ok(Map.of("message", "학습 기록 저장 완료"));
    }

    @GetMapping("/study-history")
    public ResponseEntity<?> getStudyHistory(@RequestParam Long memberId) {
        return ResponseEntity.ok(studyHistoryRepository.findByMemberId(memberId));
    }
}
