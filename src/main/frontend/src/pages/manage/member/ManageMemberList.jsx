import React, { useState, useCallback, useEffect } from 'react'
import { getMemberList } from '../../../api/manageMemberApi'
import styles from './ManageMemberList.module.css'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import Button from '../../../components/common/Button'
import Pagination from '../../../components/common/Pagination'
import StatusBadge from '../../../components/common/StatusBadge'
import { IoSearchOutline, IoRefreshOutline } from 'react-icons/io5'

// ── 셀렉트 박스용 옵션 상수 ─────────────────────────────────
// 권한 필터 옵션: 빈 문자열 = 전체, 그 외는 서버 파라미터 값과 동일
const ROLE_OPTIONS = [
  { value: 'USER',    label: '일반 회원' },
  { value: 'MANAGER', label: '매니저' },
  { value: 'ADMIN',   label: '관리자' },
]

// 상태 필터 옵션: Y = 활성, N = 비활성
const STATUS_OPTIONS = [
  { value: 'Y', label: '활성' },
  { value: 'N', label: '비활성' },
]

/**
 * ManageMemberList - 매니저용 회원 정보 조회 페이지
 *
 * 기능:
 *  - 키워드(이메일/이름), 권한, 상태로 회원 검색
 *  - 검색 결과를 테이블로 표시 (페이지네이션 포함)
 *  - 총 회원 수 표시
 *  - 초기화 버튼으로 필터 리셋
 *
 * 참고 패턴: BuyHistory.jsx (검색 필터), ManageBookList.jsx (테이블 + 페이지네이션)
 *
 * API: GET /manage/members
 */
const ManageMemberList = () => {
  // ── 검색 필터 상태 ────────────────────────────────────────
  const [filters, setFilters] = useState({
    keyword: '',   // 이메일 또는 이름 검색어
    memRole: '',   // 권한 필터 (빈 문자열 = 전체)
    isUsing: '',   // 상태 필터 (빈 문자열 = 전체)
  })

  // ── 페이지네이션 상태 ─────────────────────────────────────
  const [currentPage, setCurrentPage]     = useState(1)
  const [totalPages, setTotalPages]       = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  // ── 데이터 & UI 상태 ──────────────────────────────────────
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)

  /**
   * 회원 목록 API 호출
   * useCallback으로 메모이제이션하여 불필요한 재생성 방지
   * ManageBookList.jsx의 fetchBooks 패턴과 동일
   *
   * @param {number} page - 조회할 페이지 번호
   */
  const fetchMembers = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = {
        ...filters,  // keyword, memRole, isUsing
        page,
        size: 10,
      }
      const response = await getMemberList(params)
      if (response.success) {
        const { members, totalPages, totalElements } = response.data
        setMembers(members)
        setTotalPages(totalPages)
        setTotalElements(totalElements)
      }
    } catch (error) {
      alert(error.message || '회원 목록 조회에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [filters])  // filters가 변경되면 fetchMembers도 재생성

  // ── 초기 로드: 컴포넌트 마운트 시 전체 목록 조회 ──────────
  useEffect(() => {
    fetchMembers(currentPage)
  }, [fetchMembers])  // fetchMembers(= filters)가 변경될 때마다 재조회

  // ── 이벤트 핸들러 ─────────────────────────────────────────

  /**
   * Input 변경 핸들러 (BuyHistory.jsx 패턴)
   * @param {string} field - 변경할 필터 필드명
   */
  const handleFilterChange = (field) => (e) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }))
  }

  /**
   * 검색 버튼 클릭: 1페이지부터 다시 조회
   * (현재 filters를 그대로 사용하므로 fetchMembers가 재실행됨)
   */
  const handleSearch = () => {
    setCurrentPage(1)
    fetchMembers(1)
  }

  /**
   * 초기화 버튼 클릭: 모든 필터 리셋 후 전체 조회
   */
  const handleReset = () => {
    setFilters({ keyword: '', memRole: '', isUsing: '' })
    setCurrentPage(1)
    // filters 리셋 → useEffect가 다시 실행되어 자동으로 전체 조회됨
  }

  /**
   * 페이지 변경 핸들러 (ManageBookList.jsx 패턴)
   * @param {number} page - 이동할 페이지 번호
   */
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchMembers(page)
  }

  /**
   * 날짜 문자열 포맷 (BuyHistory.jsx 패턴)
   * ISO 8601 형식 → YYYY-MM-DD
   * @param {string} dateStr
   * @returns {string}
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return dateStr.split('T')[0]
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원 정보 조회</h2>

      {/* ── 검색 필터 섹션 (BuyHistory.jsx 패턴) ─────────── */}
      <div className={styles.filterSection}>

        {/* 1행: 키워드 검색 */}
        <div className={styles.filterRow}>
          <Input
            label='이메일 / 이름 검색'
            type='text'
            name='keyword'
            value={filters.keyword}
            onChange={handleFilterChange('keyword')}
            placeholder='이메일 또는 이름 입력'
          />
        </div>

        {/* 2행: 권한 + 상태 셀렉트 (공통 Select 컴포넌트 활용) */}
        <div className={styles.filterRow}>
          <Select
            label='권한'
            name='memRole'
            value={filters.memRole}
            onChange={handleFilterChange('memRole')}
            options={ROLE_OPTIONS}
            placeholder='전체'
          />
          <Select
            label='계정 상태'
            name='isUsing'
            value={filters.isUsing}
            onChange={handleFilterChange('isUsing')}
            options={STATUS_OPTIONS}
            placeholder='전체'
          />
        </div>

        {/* 버튼 행 */}
        <div className={styles.buttonRow}>
          <Button
            variant='primary'
            onClick={handleSearch}
            disabled={loading}
          >
            <IoSearchOutline /> {loading ? '조회 중...' : '조회'}
          </Button>
          <Button
            variant='secondary'
            onClick={handleReset}
            disabled={loading}
          >
            <IoRefreshOutline /> 초기화
          </Button>
        </div>
      </div>

      {/* ── 결과 건수 ─────────────────────────────────────── */}
      <p className={styles.resultCount}>
        총 <span>{totalElements.toLocaleString()}</span>명
      </p>

      {/* ── 로딩 상태 ─────────────────────────────────────── */}
      {loading ? (
        <p className={styles.loading}>로딩 중...</p>
      ) : members.length === 0 ? (
        /* ── 결과 없음 메시지 ────────────────────────────── */
        <p className={styles.emptyMsg}>조회된 회원이 없습니다.</p>
      ) : (
        <>
          {/* ── 회원 목록 테이블 (ManageBookList.jsx 패턴) ─ */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>이메일</th>
                  <th>이름</th>
                  <th>전화번호</th>
                  <th>권한</th>
                  <th>상태</th>
                  <th>가입 방식</th>
                  <th>가입일</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.memEmail}>
                    {/* 순번: 전체 기준 역순 번호 (최신 가입자 = 높은 번호) */}
                    <td>{totalElements - ((currentPage - 1) * 10) - index}</td>
                    <td className={styles.emailCell}>{member.memEmail}</td>
                    <td>{member.memName}</td>
                    <td>{member.memTel ?? '-'}</td>
                    {/* 권한 뱃지: StatusBadge 공통 컴포넌트 활용 */}
                    <td>
                      <StatusBadge type='role' value={member.memRole} />
                    </td>
                    {/* 상태 뱃지: StatusBadge 공통 컴포넌트 활용 */}
                    <td>
                      <StatusBadge type='status' value={member.isUsing} />
                    </td>
                    {/* 가입 방식 뱃지 */}
                    <td>
                      <StatusBadge type='provider' value={member.provider} />
                    </td>
                    <td>{formatDate(member.joinDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── 페이지네이션 (ManageBookList.jsx 패턴) ──── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default ManageMemberList
