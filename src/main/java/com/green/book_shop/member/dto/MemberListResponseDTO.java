package com.green.book_shop.member.dto;

import lombok.*;

import java.util.List;

/**
 * 매니저용 회원 목록 조회 응답 DTO
 * 회원 목록과 페이지네이션 정보를 함께 반환
 *
 * BookListResponseDTO와 동일한 구조로 설계
 */
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberListResponseDTO {

  /** 조회된 회원 목록 */
  private List<MemberDTO> members;

  /** 현재 페이지 번호 (1부터 시작) */
  private int currentPage;

  /** 전체 페이지 수 */
  private int totalPages;

  /** 전체 회원 수 (검색 조건 포함) */
  private long totalElements;

  /** 한 페이지당 표시 수 */
  private int size;
}
