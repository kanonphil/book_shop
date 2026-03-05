import React, { useEffect, useState } from 'react'
import { getDashboard } from '../../api/dashboardApi'
import styles from './ManageMain.module.css'
import { IoCalendarOutline, IoCartOutline, IoCashOutline, IoTrendingUpOutline } from 'react-icons/io5'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const ManageMain = () => {
  const [stats, setStats] = useState(null)
  const [recentSales, setRecentSales] = useState([])
  const [buyRank, setBuyRank] = useState([])
  const [bookRank, setBookRank] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard()
      setStats(data.stats)
      setRecentSales(data.recentSales)
      setBuyRank(data.buyRank)
      setBookRank(data.bookRank)
    } catch (error) {
      console.error('대시보드 조회 실패:', error);
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (price == null) return '0'
    return Number(price).toLocaleString()
  }

  const getMedal = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>대시보드</h2>

      {/* 상단: 통계 카드 + 차트 */}
      <div className={styles.topGrid}>

        {/* 통계 카드 2*2 */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.blue}`}>
            <div className={styles.statIcon}><IoCartOutline /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>오늘 주문건수</span>
              <span className={styles.statValue}>{stats?.todayOrderCount ?? 0}</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.green}`}>
            <div className={styles.statIcon}><IoCalendarOutline /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>이달의 주문건수</span>
              <span className={styles.statValue}>{stats?.monthOrderCount ?? 0}</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.orange}`}>
            <div className={styles.statIcon}><IoCashOutline /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>오늘의 매출금액</span>
              <span className={styles.statValue}>{formatPrice(stats?.todaySales)}</span>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.purple}`}>
            <div className={styles.statIcon}><IoTrendingUpOutline /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>이달의 매출금액</span>
              <span className={styles.statValue}>{formatPrice(stats?.monthSales)}</span>
            </div>
          </div>
        </div>

        {/* 최근 10일간 매출 */}
        <div className={styles.chartCard}>
          <h3 className={styles.cartTitle}>최근 10일 매출</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={recentSales} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#4a93ff' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#4a93ff' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='#eee' />
              <XAxis dataKey='label' tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${formatPrice(value)}원`, '매출']} />
              <Area 
                type='monotone'
                dataKey='totalSales'
                stroke='#4a9eff'
                fill='url(#salesGradient)'
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 하단: 구매 랭킹 + 도서 랭킹 */}
      <div className={styles.bottomGrid}>

        {/* 구매 랭킹 */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>구매 랭킹</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>랭킹</th>
                <th>이메일</th>
                <th>구매건수</th>
                <th>구매금액</th>
              </tr>
            </thead>
            <tbody>
              {buyRank.map((item) => (
                <tr key={item.rank}>
                  <td className={styles.rankCell}>{getMedal(item.rank)}</td>
                  <td>{item.memEmail}</td>
                  <td>{item.orderCount}건</td>
                  <td>{formatPrice(item.totalSales)}원</td>
                </tr>
              ))}
              {buyRank.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.empty}>데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 도서 랭킹 */}
        <div className={styles.tableCard}>
          <h3 className={styles.tableTitle}>도서 랭킹</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.rankCell}>랭킹</th>
                <th className={styles.bookTitle}>도서명</th>
                <th>저자</th>
                <th>판매건수</th>
              </tr>
            </thead>
            <tbody>
              {bookRank.map((item) => (
                <tr key={item.rank}>
                  <td>{getMedal(item.rank)}</td>
                  <td>{item.bookTitle}</td>
                  <td>{item.author}</td>
                  <td>{item.totalQty}</td>
                </tr>
              ))}
              {bookRank.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.empty}>데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageMain