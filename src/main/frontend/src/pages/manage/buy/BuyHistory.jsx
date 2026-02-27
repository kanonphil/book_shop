import React, { useState } from 'react'
import { getBuyHistory } from '../../../api/buyManageApi'
import styles from './BuyHistory.module.css'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import { IoSearchOutline } from 'react-icons/io5'

const BuyHistory = () => {
  const [filters, setFilters] = useState({
    memEmail: '',
    startDate: '',
    endDate: '',
    bookTitle: ''
  })
  const [buyHistory, setBuyHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleChange = (field) => (e) => {
  setFilters(prev => ({ ...prev, [field]: e.target.value }))
}

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await getBuyHistory(filters)
      if (response.success) {
        setBuyHistory(response.buyHistory)
        setSearched(true)
      }
    } catch (error) {
      console.error(resizeBy.buyHistory);
      alert(error.message || '구매내역 조회에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return dateStr.split('T')[0]
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>구매내역 조회</h2>

      {/* 필터 섹션 */}
      <div className={styles.filterSection}>
        <div className={styles.filterRow}>
          <Input 
            label='회원 이메일'
            type='text'
            name='memEamil'
            value={filters.memEmail}
            onChange={handleChange('memEmail')}
            placeholder='이메일 입력'
          />
          <Input 
            label='도서명'
            type='text'
            name='bookTitle'
            value={filters.bookTitle}
            onChange={handleChange('bookTitle')}
            placeholder='도서명 입력'
          />
        </div>
        <div className={styles.filterRow}>
          <Input 
            label='시작일'
            type='date'
            name='startDate'
            value={filters.startDate}
            onChange={handleChange('startDate')}
          />
          <Input 
            label='종료일'
            type='date'
            name='endDate'
            value={filters.endDate}
            onChange={handleChange('endDate')}
          />
        </div>
        <Button
          variant='primary'
          onClick={handleSearch}
          disabled={loading}
        >
          <IoSearchOutline /> {loading ? '조회 중...' : '조회'}
        </Button>
      </div>

      {/* 결과 테이블 */}
      {searched && (
        <>
          <p className={styles.resultCount}>
            총 <span>{buyHistory.length}</span>건
          </p>

          {buyHistory.length === 0 ? (
            <p className={styles.emptyMsg}>조회된 구매내역이 없습니다.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>주문번호</th>
                    <th>회원 이메일</th>
                    <th>도서 정보</th>
                    <th>결제 금액</th>
                    <th>주문일</th>
                  </tr>
                </thead>
                <tbody>
                  {buyHistory.map(buy => (
                    <tr key={buy.buyNum}>
                      <td>{buy.buyNum}</td>
                      <td>{buy.memEmail}</td>
                      <td>
                        {buy.details?.[0]?.bookTitle}
                        {buy.details?.length > 1 && (
                          <span className={styles.moreBooks}>
                            {` 외 ${buy.details.length - 1}권`}
                          </span>
                        )}
                      </td>
                      <td>{buy.buyPrice?.toLocaleString()}원</td>
                      <td>{formatDate(buy.buyDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BuyHistory