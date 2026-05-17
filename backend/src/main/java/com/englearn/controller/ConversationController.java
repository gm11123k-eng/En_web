package com.englearn.controller;

import com.englearn.entity.Conversation;
import com.englearn.entity.ConversationMessage;
import com.englearn.repository.ConversationMessageRepository;
import com.englearn.repository.ConversationRepository;
import com.englearn.repository.MemberRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ConversationController {

    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository messageRepository;
    private final MemberRepository memberRepository;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private boolean checkToken(Long memberId, String token) {
        return token != null && memberRepository.existsByIdAndAuthToken(memberId, token);
    }

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

    @PostMapping("/conversations")
    public ResponseEntity<?> createConversation(@RequestBody Map<String, Object> body) {
        Long memberId = Long.valueOf(body.get("memberId").toString());
        String token = body.get("token") != null ? body.get("token").toString() : null;
        if (!checkToken(memberId, token)) {
            return ResponseEntity.status(403).body(Map.of("message", "인증이 필요합니다."));
        }

        Conversation conv = Conversation.builder()
                .memberId(memberId)
                .type("free")
                .build();
        conversationRepository.save(conv);

        String aiGreeting = callGemini(
                "You are an English conversation partner. " +
                "Greet the user and start a casual conversation in English. " +
                "Keep it to 1-2 sentences."
        );

        if (aiGreeting == null) aiGreeting = "Hi! How's your day going so far?";

        ConversationMessage msg = ConversationMessage.builder()
                .conversationId(conv.getId())
                .role("ai")
                .content(aiGreeting)
                .build();
        messageRepository.save(msg);

        return ResponseEntity.ok(Map.of(
                "conversationId", conv.getId(),
                "message", aiGreeting
        ));
    }

    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(@RequestParam Long memberId, @RequestParam String token) {
        if (!checkToken(memberId, token)) {
            return ResponseEntity.status(403).body(Map.of("message", "인증이 필요합니다."));
        }
        List<Conversation> list = conversationRepository.findByMemberIdAndTypeOrderByCreatedAtDesc(memberId, "free");
        return ResponseEntity.ok(list);
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<?> getConversation(@PathVariable Long id, @RequestParam Long memberId,
                                             @RequestParam String token) {
        if (!checkToken(memberId, token)) {
            return ResponseEntity.status(403).body(Map.of("message", "인증이 필요합니다."));
        }
        Conversation conv = conversationRepository.findById(id).orElse(null);
        if (conv == null || !conv.getMemberId().equals(memberId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "대화를 찾을 수 없습니다."));
        }
        List<ConversationMessage> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(id);
        return ResponseEntity.ok(Map.of("conversation", conv, "messages", messages));
    }

    private static final Map<String, Map<String, String>> SCENARIOS = Map.of(
            "cafe", Map.of("title", "카페 주문", "emoji", "☕",
                    "prompt", "You are a cafe barista. The user is a customer ordering. Start by greeting and asking for their order."),
            "airport", Map.of("title", "공항 체크인", "emoji", "✈️",
                    "prompt", "You are an airport check-in staff. The user is a passenger. Start by greeting and asking for their passport and ticket."),
            "hotel", Map.of("title", "호텔 체크인", "emoji", "🏨",
                    "prompt", "You are a hotel receptionist. The user is a guest checking in. Start by greeting and asking for their reservation."),
            "interview", Map.of("title", "영어 면접", "emoji", "💼",
                    "prompt", "You are a job interviewer. The user is a candidate. Start by greeting and asking them to introduce themselves."),
            "direction", Map.of("title", "길 묻기", "emoji", "🗺️",
                    "prompt", "You are a local person on the street. The user is a tourist asking for directions. Respond naturally."),
            "shopping", Map.of("title", "쇼핑", "emoji", "🛍️",
                    "prompt", "You are a clothing store clerk. The user is a customer shopping. Start by greeting and offering help.")
    );

    @GetMapping("/roleplay/scenarios")
    public ResponseEntity<?> getScenarios() {
        List<Map<String, String>> list = new ArrayList<>();
        for (Map.Entry<String, Map<String, String>> e : SCENARIOS.entrySet()) {
            list.add(Map.of(
                    "id", e.getKey(),
                    "title", e.getValue().get("title"),
                    "emoji", e.getValue().get("emoji")
            ));
        }
        return ResponseEntity.ok(list);
    }

    private String scenarioPrompt(String scenario) {
        Map<String, String> info = SCENARIOS.get(scenario);
        if (info != null) {
            return info.get("prompt");
        }
        return "You are role-playing with the user in the following situation: " + scenario
                + ". Play your role naturally and respond in English.";
    }

    private String scenarioTitle(String scenario) {
        Map<String, String> info = SCENARIOS.get(scenario);
        return info != null ? info.get("title") : scenario;
    }

    @PostMapping("/roleplay/start")
    public ResponseEntity<?> startRoleplay(@RequestBody Map<String, Object> body) {
        Long memberId = Long.valueOf(body.get("memberId").toString());
        String token = body.get("token") != null ? body.get("token").toString() : null;
        if (!checkToken(memberId, token)) {
            return ResponseEntity.status(403).body(Map.of("message", "인증이 필요합니다."));
        }
        String scenario = body.get("scenario").toString();

        Conversation conv = Conversation.builder()
                .memberId(memberId)
                .type("roleplay")
                .scenario(scenario)
                .build();
        conversationRepository.save(conv);

        String aiGreeting = callGemini(scenarioPrompt(scenario) + " Start the conversation. Keep it to 1-2 sentences.");
        if (aiGreeting == null) aiGreeting = "Hello! How can I help you today?";

        ConversationMessage msg = ConversationMessage.builder()
                .conversationId(conv.getId())
                .role("ai")
                .content(aiGreeting)
                .build();
        messageRepository.save(msg);

        return ResponseEntity.ok(Map.of(
                "conversationId", conv.getId(),
                "scenario", scenario,
                "title", scenarioTitle(scenario),
                "message", aiGreeting
        ));
    }

    @PostMapping("/roleplay/{id}/messages")
    public ResponseEntity<?> sendRoleplayMessage(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Conversation owner = conversationRepository.findById(id).orElse(null);
            if (owner == null || !checkToken(owner.getMemberId(), body.get("token"))) {
                return ResponseEntity.status(403).body(Map.of("message", "인증이 필요합니다."));
            }
            String userMessage = body.get("content");

            ConversationMessage userMsg = ConversationMessage.builder()
                    .conversationId(id)
                    .role("user")
                    .content(userMessage)
                    .build();
            messageRepository.save(userMsg);

            Conversation conv = conversationRepository.findById(id).orElse(null);

            List<ConversationMessage> history = messageRepository.findByConversationIdOrderByCreatedAtAsc(id);
            StringBuilder context = new StringBuilder();
            context.append(scenarioPrompt(conv.getScenario())).append(" ");
            context.append("Reply in English, keep it natural and short. ");
            context.append("If the user made mistakes, point them out. ");
            context.append("Reply in this JSON format: {\"reply\":\"your reply\",\"correction\":\"correction or null\"}\n\n");

            for (ConversationMessage m : history) {
                context.append(m.getRole().equals("user") ? "User: " : "AI: ");
                context.append(m.getContent()).append("\n");
            }

            String aiResult = callGemini(context.toString());
            String reply = "Sorry, could you say that again?";
            String correction = null;

            if (aiResult != null) {
                String json = aiResult;
                if (json.contains("```")) {
                    json = json.replaceAll("```json\\s*", "").replaceAll("```\\s*", "");
                }
                JsonNode node = objectMapper.readTree(json.trim());
                reply = node.get("reply").asText();
                if (node.has("correction") && !node.get("correction").isNull()
                        && !node.get("correction").asText().equals("null")) {
                    correction = node.get("correction").asText();
                }
            }

            ConversationMessage aiMsg = ConversationMessage.builder()
                    .conversationId(id)
                    .role("ai")
                    .content(reply)
                    .correction(correction)
                    .build();
            messageRepository.save(aiMsg);

            return ResponseEntity.ok(Map.of(
                    "reply", reply,
                    "correction", correction != null ? correction : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.toString()));
        }
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Conversation owner = conversationRepository.findById(id).orElse(null);
        if (owner == null || !checkToken(owner.getMemberId(), body.get("token"))) {
            return ResponseEntity.status(403).body(Map.of("message", "인증이 필요합니다."));
        }
        String userMessage = body.get("content");

        ConversationMessage userMsg = ConversationMessage.builder()
                .conversationId(id)
                .role("user")
                .content(userMessage)
                .build();
        messageRepository.save(userMsg);

        List<ConversationMessage> history = messageRepository.findByConversationIdOrderByCreatedAtAsc(id);
        StringBuilder context = new StringBuilder();
        context.append("You are an English conversation partner. ");
        context.append("Reply in English and keep it natural and short (2-3 sentences). ");
        context.append("If the user made grammar or expression mistakes, point them out. ");
        context.append("Reply in this JSON format: {\"reply\":\"your reply\",\"correction\":\"correction or null\"}\n\n");

        for (ConversationMessage m : history) {
            context.append(m.getRole().equals("user") ? "User: " : "AI: ");
            context.append(m.getContent()).append("\n");
        }

        String aiResult = callGemini(context.toString());

        String reply = "Sorry, I couldn't process that. Could you try again?";
        String correction = null;

        if (aiResult != null) {
            try {
                String json = aiResult;
                if (json.contains("```")) {
                    json = json.replaceAll("```json\\s*", "").replaceAll("```\\s*", "");
                }
                JsonNode node = objectMapper.readTree(json.trim());
                reply = node.get("reply").asText();
                if (node.has("correction") && !node.get("correction").isNull()
                        && !node.get("correction").asText().equals("null")) {
                    correction = node.get("correction").asText();
                }
            } catch (Exception e) {
                reply = aiResult;
            }
        }

        ConversationMessage aiMsg = ConversationMessage.builder()
                .conversationId(id)
                .role("ai")
                .content(reply)
                .correction(correction)
                .build();
        messageRepository.save(aiMsg);

        return ResponseEntity.ok(Map.of(
                "reply", reply,
                "correction", correction != null ? correction : ""
        ));
    }
}
