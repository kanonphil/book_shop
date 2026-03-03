package com.green.book_shop.member.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 매니저용 회원 목록 조회 요청 DTO
 * GET /manage/members 요청 시 쿼리 파라미터를 담는 객체
 *
 * 사용 예: /manage/members?keyword=kim&memRole=USER&isUsing=Y&page=1&size=10
 */
@Getter
@Setter
public class MemberManageRequestDTO {

  /**
   * 검색 키워드 (이메일 또는 이름 LIKE 검색)
   * null 또는 빈 문자열이면 전체 조회
   */
  private String keyword;

  /**
   * 회원 권한 필터 (USER / MANAGER / ADMIN)
   * null 또는 빈 문자열이면 전체 권한 조회
   */
  private String memRole;

  /**
   * 계정 활성 상태 필터 ('Y': 활성 / 'N': 비활성)
   * null 또는 빈 문자열이면 전체 상태 조회
   */
  private String isUsing;

  /**
   * 현재 페이지 번호 (1부터 시작)
   * 기본값 1
   */
  private int page = 1;

  /**
   * 한 페이지당 표시할 회원 수
   * 기본값 10
   */
  private int size = 10;

  /**
   * MyBatis 쿼리에서 사용할 OFFSET 값 계산
   * SQL: LIMIT #{offset}, #{size}
   * page가 변경되면 자동 계산됨
   *
   * @return (page - 1) * size
   */
  public int getOffset() {
    return (page - 1) * size;
  }
}
