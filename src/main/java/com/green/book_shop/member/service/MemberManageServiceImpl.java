package com.green.book_shop.member.service;

import com.green.book_shop.member.dto.MemberDTO;
import com.green.book_shop.member.dto.MemberListResponseDTO;
import com.green.book_shop.member.dto.MemberManageRequestDTO;
import com.green.book_shop.member.mapper.MemberManageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberManageServiceImpl implements MemberManageService {

  private final MemberManageMapper memberManageMapper;

  /**
   * 회원 목록 조회 (검색 필터 + 페이지네이션)
   *
   * @param request 검색 조건 및 페이지 정보
   * @return 회원 목록과 페이지네이션 정보
   */
  @Override
  public MemberListResponseDTO getMemberList(MemberManageRequestDTO request) {
    log.info("회원 목록 조회 - keyword: {}, memRole: {}, isUsing: {}, page: {}, size: {}",
            request.getKeyword(), request.getMemRole(),
            request.getIsUsing(), request.getPage(), request.getSize());

    // 조건에 맞는 회원 목록 조회 (LIMIT offset, size 적용)
    List<MemberDTO> members = memberManageMapper.selectMemberList(request);

    // 페이지네이션 계산을 위한 전체 회원 수 조회 (동일 WHERE 조건)
    int totalElements = memberManageMapper.selectMemberCount(request);

    // 전체 페이지 수 계산: 총 회원 수 / 페이지 크기 (올림 처리)
    int totalPages = (int) Math.ceil((double) totalElements / request.getSize());

    // 보안: 비밀번호는 응답에 포함되지 않음
    members.forEach(member -> member.setMemPw(null));

    log.info("회원 목록 조회 완료 - 총 {}명 / {}페이지", totalElements, totalPages);

    // BookListResponseDTO와 동일한 Builder 패턴으로 응답 객체 생성
    return MemberListResponseDTO.builder()
            .members(members)
            .currentPage(request.getPage())
            .totalPages(totalPages)
            .totalElements(totalElements)
            .size(request.getSize())
            .build();
  }

  /**
   * 회원 계정 상태 변경 (활성 ↔ 비활성)
   * - ADMIN 계정은 상태 변경 불가
   *
   * @param memEmail 상태를 변경할 회원 이메일
   * @param isUsing  변경할 상태값 ('Y': 활성 / 'N': 비활성)
   */
  @Override
  @Transactional
  public void updateMemberStatus(String memEmail, String isUsing) {
    // 허용되지 않는 상태값 검증
    if (!"Y".equals(isUsing) && !"N".equals(isUsing)) {
      throw new RuntimeException("올바르지 않은 상태값입니다. (Y 또는 N)");
    }

    log.info("회원 상태 변경 - memEmail: {}, isUsing: {}", memEmail, isUsing);

    int result = memberManageMapper.updateMemberStatus(memEmail, isUsing);

    // 업데이트된 행이 0이면 해당 이메일의 회원이 없는 것
    if (result == 0) {
      throw new RuntimeException("회원을 찾을 수 없습니다: " + memEmail);
    }

    log.info("회원 상태 변경 완료 - memEmail: {}, isUsing: {}", memEmail, isUsing);
  }

  /**
   * 회원 권한 변경
   * - 유효하지 않은 권한값 전달 시 예외 발생
   *
   * @param memEmail 권한을 변경할 회원 이메일
   * @param memRole  변경할 권한값 ('USER' / 'MANAGER' / 'ADMIN')
   */
  @Override
  @Transactional
  public void updateMemberRole(String memEmail, String memRole) {
    // 허용된 권한값 집합
    Set<String> validRoles = Set.of("USER", "MANAGER", "ADMIN");

    if (!validRoles.contains(memRole)) {
      throw new RuntimeException("올바르지 않은 권한값입니다. (USER / MANAGER / ADMIN)");
    }

    log.info("회원 권한 변경 - memEmail: {}, memRole: {}", memEmail, memRole);

    int result = memberManageMapper.updateMemberRole(memEmail, memRole);

    if (result == 0) {
      throw new RuntimeException("회원을 찾을 수 없습니다: " + memEmail);
    }

    log.info("회원 권한 변경 완료 - memEmail: {}, memRole: {}", memEmail, memRole);
  }
}
