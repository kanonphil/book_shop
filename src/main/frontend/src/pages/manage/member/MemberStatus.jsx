import React, { useCallback, useEffect, useState } from 'react'
import styles from './MemberStatus.module.css'
import { getMemberList, updateMemberRole, updateMemberStatus } from '../../../api/memberManageApi'
import Input from '../../../components/common/Input'
import Select from '../../../components/common/Select'
import Button from '../../../components/common/Button'
import { IoRefreshOutline, IoSearchOutline } from 'react-icons/io5'
import StatusBadge from '../../../components/common/StatusBadge'
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

const CHANGE_ROLE_OPTIONS = [
  { value: 'USER', label: 'USER' },
  { value: 'MANAGER', label: 'MANAGER' },
  { value: 'ADMIN', label: 'ADMIN' }
]

const MemberStatus = () => {
  // 검색 필터
  const [filters, setFilters] = useState({
    keyword: '',
    memRole: '',
    isUsing: '',
  })

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  // 데이터 & UI
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)

  // 확인 모달 상태
  const [confirmModal, setConfirmModal] = useState(null)

  // 모달 내부 처리 로딩 (버튼 비활성화)
  const [modalLoading, setModalLoading] = useState(false)

  // 회원 목록 조회
  const fetchMembers = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = {...filters, page, size: 10}
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

  const handleStatusClick = (member) => {
    const newValue = member.isUsing === 'Y' ? 'N' : 'Y'
    setConfirmModal({
      type: 'status',
      memEmail: member.memEmail,
      memName: member.memName,
      currentValue: member.isUsing,
      newValue,
    })
  }

  const handleRoleChange = (member, newRole) => {
    if (newRole === member.memRole) return

    setConfirmModal({
      type: 'role',
      memEmail: member.memEmail,
      memName: member.memName,
      currentValue: member.isUsing,
      newValue: newRole,
    })
  }

  const handleConfirm = async () => {
    if (!confirmModal) return
    setModalLoading(true)

    const { type, memEmail, newValue } = confirmModal

    try {
      if (type === 'status') {
        await updateMemberStatus(memEmail, newValue)

        setMembers(prev =>
          prev.map(m =>
            m.memEmail === memEmail
              ? { ...m, isUsing: newValue }
              : m
          )
        )
      } else {
        await updateMemberRole(memEmail, newValue)

        setMembers(prev =>
          prev.map(m =>
            m.memEmail === memEmail
              ? { ...m, memRole: newValue }
              : m
          )
        )
      }
      setConfirmModal(null)
    } catch (error) {
      alert(error.message || '변경에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setConfirmModal(null)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return
    return dateStr.split('T')[0]
  }

  const getModalMessage = () => {
    if (!confirmModal) return ''
    const { type, memName, memEmail, currentValue, newValue } = confirmModal

    if (type === 'status') {
      const action = newValue === 'Y' ? '활성화' : '비활성화'
      return `${memName} (${memEmail}) 님의 계정을 ${action}하시겠습니까?`
    }
    return `${memName} (${memEmail}) 님의 권한을 "${currentValue}" → "${newValue}"으로 변경하시겠습니까?`
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원 상태 변경</h2>

      {/* ── 검색 필터 섹션 (ManageMemberList.jsx와 동일 구조) ─ */}
      <div className={styles.filterSection}>
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
        <div className={styles.buttonRow}>
          <Button variant='primary' onClick={handleSearch} disabled={loading}>
            <IoSearchOutline /> {loading ? '조회 중...' : '조회'}
          </Button>
          <Button variant='secondary' onClick={handleReset} disabled={loading}>
            <IoRefreshOutline /> 초기화
          </Button>
        </div>
      </div>

      {/* 결과 건수 */}
      <p className={styles.resultCount}>
        총 <span>{totalElements.toLocaleString()}</span>명
      </p>

      {/* ── 로딩 / 빈 목록 / 테이블 ──────────────────────── */}
      {loading ? (
        <p className={styles.loading}>로딩 중...</p>
      ) : members.length === 0 ? (
        <p className={styles.emptyMsg}>조회된 회원이 없습니다.</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>이메일</th>
                  <th>이름</th>
                  <th>현재 상태</th>
                  <th>현재 권한</th>
                  <th>가입일</th>
                  {/* 변경 액션 컬럼 */}
                  <th>상태 변경</th>
                  <th>권한 변경</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.memEmail}>
                    <td>{totalElements - ((currentPage - 1) * 10) - index}</td>
                    <td className={styles.emailCell}>{member.memEmail}</td>
                    <td>{member.memName}</td>

                    {/* 현재 상태 뱃지 */}
                    <td>
                      <StatusBadge type='status' value={member.isUsing} />
                    </td>

                    {/* 현재 권한 뱃지 */}
                    <td>
                      <StatusBadge type='role' value={member.memRole} />
                    </td>

                    <td>{formatDate(member.joinDate)}</td>

                    {/* ── 상태 변경 버튼 ─────────────────────
                        현재 상태가 'Y'면 "비활성화" (danger),
                        현재 상태가 'N'이면 "활성화" (primary) */}
                    <td>
                      <Button
                        variant={member.isUsing === 'Y' ? 'danger' : 'primary'}
                        size='small'
                        onClick={() => handleStatusClick(member)}
                      >
                        {member.isUsing === 'Y' ? '비활성화' : '활성화'}
                      </Button>
                    </td>

                    {/* ── 권한 변경 인라인 셀렉트 ────────────
                        ManageStock의 inlineInput 패턴과 유사하게
                        셀렉트 박스를 직접 행에 배치
                        onChange 시 확인 모달을 거친 후 API 호출 */}
                    <td>
                      <select
                        className={styles.roleSelect}
                        value={member.memRole}
                        onChange={(e) => handleRoleChange(member, e.target.value)}
                      >
                        {CHANGE_ROLE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* ── 확인 모달 (ManageStock.jsx의 restockModal 패턴) ──
          overlay 클릭 시 취소, 모달 내부 클릭은 stopPropagation */}
      {confirmModal && (
        <div
          className={styles.modalOverlay}
          onClick={handleCancel}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 타이틀 */}
            <h3 className={styles.modalTitle}>
              {confirmModal.type === 'status' ? '계정 상태 변경' : '권한 변경'}
            </h3>

            {/* 안내 메시지 */}
            <p className={styles.modalMessage}>{getModalMessage()}</p>

            {/* 변경 후 상태 미리보기 */}
            <div className={styles.modalPreview}>
              <span className={styles.previewLabel}>변경 후:</span>
              <StatusBadge
                type={confirmModal.type === 'status' ? 'status' : 'role'}
                value={confirmModal.newValue}
              />
            </div>

            {/* 버튼 행 */}
            <div className={styles.modalButtons}>
              <Button
                variant='primary'
                onClick={handleConfirm}
                disabled={modalLoading}
              >
                {modalLoading ? '처리 중...' : '확인'}
              </Button>
              <Button
                variant='secondary'
                onClick={handleCancel}
                disabled={modalLoading}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberStatus