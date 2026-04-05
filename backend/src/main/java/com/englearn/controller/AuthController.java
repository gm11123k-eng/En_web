package com.englearn.controller;

import com.englearn.entity.Member;
import com.englearn.repository.MemberRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final MemberRepository memberRepository;

    public record SignupRequest(
            @NotBlank(message = "이메일을 입력하세요.")
            @Email(message = "올바른 이메일 형식이 아닙니다.") String email,
            @NotBlank(message = "비밀번호를 입력하세요.")
            @Size(min = 4, max = 50, message = "비밀번호는 4자 이상 50자 이하여야 합니다.") String password,
            @NotBlank(message = "닉네임을 입력하세요.")
            @Size(min = 2, max = 20, message = "닉네임은 2자 이상 20자 이하여야 합니다.") String nickname
    ) {}

    public record LoginRequest(String email, String password) {}

    @GetMapping("/auth/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = memberRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        if (memberRepository.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body(Map.of("message", "이미 사용 중인 이메일입니다."));
        }

        Member member = Member.builder()
                .email(req.email())
                .password(req.password())
                .nickname(req.nickname())
                .build();
        memberRepository.save(member);

        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Member member = memberRepository.findByEmail(req.email()).orElse(null);
        if (member == null || !member.getPassword().equals(req.password())) {
            return ResponseEntity.badRequest().body(Map.of("message", "이메일 또는 비밀번호가 올바르지 않습니다."));
        }
        return ResponseEntity.ok(Map.of(
                "memberId", member.getId(),
                "email", member.getEmail(),
                "nickname", member.getNickname()
        ));
    }

    @GetMapping("/members/me")
    public ResponseEntity<?> getMe(@RequestParam Long memberId) {
        Member m = memberRepository.findById(memberId).orElse(null);
        if (m == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "회원을 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(Map.of(
                "id", m.getId(),
                "email", m.getEmail(),
                "nickname", m.getNickname(),
                "level", m.getLevel(),
                "totalPoints", m.getTotalPoints(),
                "streakDays", m.getStreakDays()
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValid(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(Map.of("message", msg));
    }
}
