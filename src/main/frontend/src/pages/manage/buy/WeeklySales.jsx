import React, { useState } from 'react'
import { getWeeklySales } from '../../../api/buyManageApi'
import styles from './WeeklySales.module.css'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const WeeklySales = () => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchedYear, setSearchedYear] = useState(null)
  const [searchedMonth, setSearchedMonth] = useState(null)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await getWeeklySales(year, month)
      console.log('response:', response)
      if (response.success) {
        setSalesData(response.weeklySales)
        setSearchedYear(year)
        setSearchedMonth(month)
        setSearched(true)
      }
    } catch (error) {
      console.error('주간 매출 조회 실패:', error)
      alert(error.message || '주간 매출 조회에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>주간 매출 관리</h2>

      {/* 필터 섹션 */}
      <div className={styles.filterSection}>
        <Input
          label='연도'
          type='number'
          name='year'
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder='연도 입력'
          className={styles.yearInput}
        />
        <Input
          label='월'
          type='number'
          name='month'
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder='월 입력'
          className={styles.monthInput}
        />
        <Button
          variant='primary'
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? '조회 중...' : '조회'}
        </Button>
      </div>

      {searched && (
        <>
          {/* 요약 카드 */}
          <div className={styles.summaryRow}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>총 매출</p>
              <p className={styles.summaryValue}>
                {salesData.reduce((sum, item) => sum + item.totalSales, 0).toLocaleString()}원
              </p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>총 주문 건수</p>
              <p className={styles.summaryValue}>
                {salesData.reduce((sum, item) => sum + item.orderCount, 0).toLocaleString()}건
              </p>
            </div>
          </div>

          {salesData.length === 0 ? (
            <p className={styles.emptyMsg}>조회된 매출 데이터가 없습니다.</p>
          ) : (
            <>
              {/* 차트 */}
              <div className={styles.chartSection}>
                <h3 className={styles.sectionTitle}>{searchedYear}년 {searchedMonth}월 주간 매출</h3>
                <ResponsiveContainer width='100%' height={300}>
                  <AreaChart data={salesData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#333' />
                    <XAxis dataKey='label' tick={{ fill: '#aaa', fontSize: 13 }} />
                    <YAxis
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
                      tick={{ fill: '#aaa', fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()}원`, '매출']}
                      contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px' }}
                      labelStyle={{ color: '#e0e0e0' }}
                    />
                    <Area type='monotone' dataKey='totalSales' stroke='#4a9eff' fill='#4a9eff' fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 테이블 */}
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>주차</th>
                      <th>총 매출</th>
                      <th>주문 건수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map(item => (
                      <tr key={item.label}>
                        <td>{item.label}</td>
                        <td>{item.totalSales?.toLocaleString()}원</td>
                        <td>{item.orderCount}건</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default WeeklySales