package com.green.book_shop.member.mapper;

import com.green.book_shop.member.dto.MemberDTO;
import com.green.book_shop.member.dto.MemberManageRequestDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemberManageMapper {

  /**
   * 회원 목록 조회 (검색 필터 + 페이지네이션)
   *
   * @param request 검색 조건 (keyword, memRole, isUsing) + 페이지 정보 (page, size, offset)
   * @return 조건에 맞는 회원 목록
   */
  List<MemberDTO> selectMemberList(MemberManageRequestDTO request);

  /**
   * 전체 회원 수 조회 (페이지네이션 계산용)
   * selectMemberList와 동일한 WHERE 조건을 사용하여 총 개수 반환
   *
   * @param request 검색 조건 (keyword, memRole, isUsing)
   * @return 조건에 맞는 전체 회원 수
   */
  int selectMemberCount(MemberManageRequestDTO request);

  /**
   * 회원 계정 상태 변경 (활성 ↔ 비활성)
   * IS_USING 컬럼을 'Y' 또는 'N'으로 변경
   *
   * @param memEmail 상태를 변경할 회원 이메일 (PK)
   * @param isUsing  변경할 상태값 ('Y': 활성 / 'N': 비활성)
   * @return 업데이트된 행 수 (성공 시 1, 실패 시 0)
   */
  int updateMemberStatus(@Param("memEmail") String memEmail,
                         @Param("isUsing") String isUsing);

  /**
   * 회원 권한 변경
   * MEM_ROLE 컬럼을 USER / MANAGER / ADMIN 중 하나로 변경
   *
   * @param memEmail 권한을 변경할 회원 이메일 (PK)
   * @param memRole  변경할 권한값 ('USER' / 'MANAGER' / 'ADMIN')
   * @return 업데이트된 행 수 (성공 시 1, 실패 시 0)
   */
  int updateMemberRole(@Param("memEmail") String memEmail,
                       @Param("memRole") String memRole);
}
