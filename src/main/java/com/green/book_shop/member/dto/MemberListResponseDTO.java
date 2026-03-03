package com.green.book_shop.member.dto;

import lombok.*;

import java.util.List;

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