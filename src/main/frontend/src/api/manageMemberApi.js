import axiosInstance from "./axiosInstance";

/**
 * 매니저용 회원 관리 API
 * buyManageApi.js와 동일한 패턴으로 작성
 *
 * 기본 URL: /manage/members
 * 권한: MANAGER, ADMIN만 접근 가능
 */

/**
 * 회원 목록 조회 (검색 필터 + 페이지네이션)
 *
 * @param {Object} params - 검색 조건 및 페이지 정보
 * @param {string} [params.keyword]  - 이메일 또는 이름 검색 키워드 (선택)
 * @param {string} [params.memRole]  - 권한 필터: USER / MANAGER / ADMIN (선택)
 * @param {string} [params.isUsing]  - 상태 필터: Y / N (선택)
 * @param {number} [params.page]     - 페이지 번호, 기본값 1 (선택)
 * @param {number} [params.size]     - 페이지 크기, 기본값 10 (선택)
 * @returns {Promise<{success: boolean, data: {members: Array, currentPage: number, totalPages: number, totalElements: number, size: number}}>}
 */
export const getMemberList = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/manage/members', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '회원 목록 조회에 실패했습니다.' }
  }
}

/**
 * 회원 계정 상태 변경 (활성 ↔ 비활성)
 * PATCH /manage/members/{memEmail}/status
 *
 * @param {string} memEmail - 상태를 변경할 회원 이메일
 * @param {string} isUsing  - 변경할 상태값 ('Y': 활성 / 'N': 비활성)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateMemberStatus = async (memEmail, isUsing) => {
  try {
    // URL 인코딩: 이메일의 '@' 문자가 경로에 포함되므로 encodeURIComponent 처리
    const response = await axiosInstance.patch(
      `/manage/members/${encodeURIComponent(memEmail)}/status`,
      { isUsing }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '회원 상태 변경에 실패했습니다.' }
  }
}

/**
 * 회원 권한 변경
 * PATCH /manage/members/{memEmail}/role
 *
 * @param {string} memEmail - 권한을 변경할 회원 이메일
 * @param {string} memRole  - 변경할 권한값 ('USER' / 'MANAGER' / 'ADMIN')
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateMemberRole = async (memEmail, memRole) => {
  try {
    const response = await axiosInstance.patch(
      `/manage/members/${encodeURIComponent(memEmail)}/role`,
      { memRole }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '회원 권한 변경에 실패했습니다.' }
  }
}
