package com.green.book_shop.member.controller;

import com.green.book_shop.member.dto.MemberDTO;
import com.green.book_shop.member.service.MemberServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

  private final MemberServiceImpl memberServiceImpl;

  // 회원가입
  @PostMapping("/join")
  public ResponseEntity<Map<String, Object>> join(@RequestBody MemberDTO memberDTO) {
    Map<String, Object> response = new HashMap<>();

    try {
      memberServiceImpl.joinMember(memberDTO);
      response.put("success", true);
      response.put("message", "회원가입이 완료되었습니다");
      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
  }

  // 이메일 중복 확인
  @GetMapping("/check-email/{email}")
  public ResponseEntity<Map<String, Object>> checkEmail(@PathVariable String email) {
    Map<String, Object> response = new HashMap<>();

    boolean isDuplicate = memberServiceImpl.checkEmailDuplicate(email);

    response.put("isDuplicate", isDuplicate);
    response.put("message", isDuplicate ? "이미 사용 중인 이메일입니다" : "사용 가능한 이메일입니다");

    return ResponseEntity.ok(response);
  }

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
    Map<String, Object> response = new HashMap<>();

    try {
      String email = loginData.get("memEmail");
      String password = loginData.get("memPw");

      MemberDTO member = memberServiceImpl.login(email, password);

      response.put("success", true);
      response.put("message", "로그인 성공");
      response.put("member", member);
      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
  }

  // 회원 정보 조회
  @GetMapping("/info/{email}")
  public ResponseEntity<MemberDTO> getMemberInfo(@PathVariable String email) {
    MemberDTO member = memberServiceImpl.getMemberInfo(email);
    member.setMemPw(null);
    return ResponseEntity.ok(member);
  }

  /**
   * 회원 정보 수정
   * PUT /members/{email}
   */
  @PutMapping("/{email}")
  public ResponseEntity<Map<String, Object>> updateMember(
          @PathVariable String email,
          @RequestBody MemberDTO memberDTO
  ) {
    Map<String, Object> response = new HashMap<>();
    try {
      memberDTO.setMemEmail(email);
      memberServiceImpl.updateMember(memberDTO);
      response.put("success", true);
      response.put("message", "회원 정보가 수정되었습니다.");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
  }

  /**
   * 회원 탈퇴
   * DELETE /members/{email}
   */
  @DeleteMapping("/{email}")
  public ResponseEntity<Map<String, Object>> deleteMember(
          @PathVariable String email,
          @RequestParam String memPw
  ) {
    Map<String, Object> response = new HashMap<>();
    try {
      memberServiceImpl.deleteMember(email, memPw);
      response.put("success", true);
      response.put("message", "회원 탈퇴가 완료되었습니다.");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
  }

  /**
   * 비밀번호 확인 (본인 인증)
   * POST /members/check-password
   */
  @PostMapping("/check-password")
  public ResponseEntity<Map<String, Object>> checkPassword(@RequestBody Map<String, String> body) {
    Map<String, Object> response = new HashMap<>();
    try {
      boolean isValid = memberServiceImpl.checkPassword(
              body.get("memEmail"),
              body.get("memPw")
      );
      response.put("success", isValid);
      response.put("message", isValid ? "확인되었습니다." : "비밀번호가 일치하지 않습니다.");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
  }
}