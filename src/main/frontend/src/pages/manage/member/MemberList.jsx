import React, { useCallback, useEffect, useState } from 'react'
import styles from './MemberList.module.css'
import { getMemberList } from '../../../api/memberManageApi'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import Button from '../../../components/common/Button'
import StatusBadge from '../../../components/common/StatusBadge'
import { IoRefreshOutline, IoSearchOutline } from 'react-icons/io5'
import Pagination from '../../../components/common/Pagination'

const ROLE_OPTIONS = [
  { value: 'USER', label: '일반 회원' },
  { value: 'MANAGER', label: '매니저' },
  { value: 'ADMIN', label: '관리자' }
]

const STATUS_OPTIONS = [
  { value: 'Y', label: '활성' },
  { value: 'N', label: '비활성' }
]

const MemberList = () => {

  const [filters, setFilters] = useState({
    keyword: '',
    memRole: '',
    isUsing: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchMembers = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = {
        ...filters,
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
  }, [filters])

  useEffect(() => {
    fetchMembers(currentPage)
  }, [fetchMembers])

  const handleFilterChange = (filed) => (e) => {
    setFilters(prev => ({
      ...prev,
      [filed]: e.target.value
    }))
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchMembers(1)
  }

  const handleReset = () => {
    setFilters({
      keyword: '',
      memRole: '',
      isUsing: '',
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchMembers(page)
  }

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

export default MemberList