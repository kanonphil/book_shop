package com.green.book_shop.member.controller;

import com.green.book_shop.member.dto.MemberListResponseDTO;
import com.green.book_shop.member.dto.MemberManageRequestDTO;
import com.green.book_shop.member.service.MemberManageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/manage/members")
@RequiredArgsConstructor
@Slf4j
public class MemberManageController {

  private final MemberManageService memberManageService;

  /**
   * 회원 목록 조회
   * GET /manage/members
   * GET /manage/members?keyword=kim
   * GET /manage/members?memRole=USER&isUsing=Y&page=2&size=10
   *
   * @param request 쿼리 파라미터로 전달되는 검색 조건 및 페이지 정보
   *                - keyword: 이메일 또는 이름 검색 (선택)
   *                - memRole: 권한 필터 USER/MANAGER/ADMIN (선택)
   *                - isUsing: 상태 필터 Y/N (선택)
   *                - page: 페이지 번호, 기본값 1 (선택)
   *                - size: 페이지 크기, 기본값 10 (선택)
   * @return 회원 목록 + 페이지네이션 정보
   */
  @GetMapping("")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> getMemberList(MemberManageRequestDTO request) {
    try {
      MemberListResponseDTO memberList = memberManageService.getMemberList(request);

      return ResponseEntity.ok(Map.of(
              "success", true,
              "data", memberList
      ));
    } catch (Exception e) {
      log.error("회원 목록 조회 실패: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
              "success", false,
              "message", "회원 목록 조회에 실패했습니다." + e.getMessage()
      ));
    }
  }

  /**
   * 회원 계정 상태 변경 (활성 ↔ 비활성)
   * PATCH /manage/members/{memEmail}/status
   *
   * 요청 Body: { "isUsing": "Y" } 또는 { "isUsing": "N" }
   *
   * @param memEmail PathVariable - 상태를 변경할 회원 이메일
   * @param body     RequestBody - { "isUsing": "Y" | "N" }
   * @return 성공/실패 메시지
   */
  @PatchMapping("/{memEmail}/status")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> updateMemberStatus(@PathVariable String memEmail,
                                              @RequestBody Map<String, String> body) {
    try {
      String isUsing = body.get("isUsing");
      memberManageService.updateMemberStatus(memEmail, isUsing);
      return ResponseEntity.ok(Map.of(
              "success", true,
              "message", "Y".equals(isUsing) ? "계정이 활성화되었습니다." : "계정이 비활성화되었습니다."
      ));
    } catch (Exception e) {
      log.error("회원 상태 변경 실패: memEmail: {}, error: {}", memEmail, e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
              "success", false,
              "message", e.getMessage()
      ));
    }
  }

  /**
   * 회원 권한 변경
   * PATCH /manage/members/{memEmail}/role
   *
   * 요청 Body: { "memEmail": "USER" } 또는 { "memEmail": "MANAGER" } 또는 { "memEmail": "ADMIN" }
   *
   * @param memEmail PathVariable - 권한을 변경할 회원 이메일
   * @param body     RequestBody - { "memRole": "USER" | "MANAGER" | "ADMIN" }
   * @return 성공/실패 메시지
   */
  @PatchMapping("/{memEmail}/role")
  @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
  public ResponseEntity<?> updateMemberRole(@PathVariable String memEmail,
                                            @RequestBody Map<String, String> body) {
    try {
      String memRole = body.get("memRole");
      memberManageService.updateMemberRole(memEmail, memRole);
      return ResponseEntity.ok(Map.of(
              "success", true,
              "message", "권한이 " + memRole + "으로 변경되었습니다."
      ));
    } catch (Exception e) {
      log.error("회원 권한 변경 실패 - memEmail: {}, error: {}", memEmail, e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
              "success", true,
              "message", e.getMessage()
      ));
    }
  }
}
