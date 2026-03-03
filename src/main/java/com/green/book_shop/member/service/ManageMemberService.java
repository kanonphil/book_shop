package com.green.book_shop.member.service;

import com.green.book_shop.member.dto.MemberListResponseDTO;
import com.green.book_shop.member.dto.MemberManageRequestDTO;

/**
 * 매니저용 회원 관리 Service 인터페이스
 * BuyManageService와 동일한 패턴으로 인터페이스와 구현체를 분리
 */
public interface ManageMemberService {

  /**
   * 회원 목록 조회 (검색 필터 + 페이지네이션)
   *
   * @param request 검색 조건 및 페이지 정보
   * @return 회원 목록과 페이지네이션 정보를 담은 응답 객체
   */
  MemberListResponseDTO getMemberList(MemberManageRequestDTO request);

  /**
   * 회원 계정 상태 변경 (활성 ↔ 비활성)
   * - ADMIN 계정은 상태 변경 불가
   *
   * @param memEmail 상태를 변경할 회원 이메일
   * @param isUsing  변경할 상태값 ('Y': 활성 / 'N': 비활성)
   */
  void updateMemberStatus(String memEmail, String isUsing);

  /**
   * 회원 권한 변경
   * - 유효하지 않은 권한값 전달 시 예외 발생
   *
   * @param memEmail 권한을 변경할 회원 이메일
   * @param memRole  변경할 권한값 ('USER' / 'MANAGER' / 'ADMIN')
   */
  void updateMemberRole(String memEmail, String memRole);
}
