package com.englearn.controller;

import com.englearn.entity.Conversation;
import com.englearn.entity.ConversationMessage;
import com.englearn.repository.ConversationMessageRepository;
import com.englearn.repository.ConversationRepository;
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

    @PostMapping("/conversations")
    public ResponseEntity<?> createConversation(@RequestBody Map<String, Object> body) {
        Long memberId = Long.valueOf(body.get("memberId").toString());

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
    public ResponseEntity<?> getConversations(@RequestParam Long memberId) {
        List<Conversation> list = conversationRepository.findByMemberIdAndTypeOrderByCreatedAtDesc(memberId, "free");
        return ResponseEntity.ok(list);
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<?> getConversation(@PathVariable Long id, @RequestParam Long memberId) {
        Conversation conv = conversationRepository.findById(id).orElse(null);
        if (conv == null || !conv.getMemberId().equals(memberId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "대화를 찾을 수 없습니다."));
        }
        List<ConversationMessage> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(id);
        return ResponseEntity.ok(Map.of("conversation", conv, "messages", messages));
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long id, @RequestBody Map<String, String> body) {
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
