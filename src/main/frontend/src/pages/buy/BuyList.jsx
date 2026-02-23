import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBuyList } from '../../api/buyApi'
import styles from './BuyList.module.css'
import Button from '../../components/common/Button'
import Pagenation from '../../components/common/Pagination'

const PAGE_SIZE = 5

const BuyList = () => {
  const navigate = useNavigate()
  const [buyList, setBuyList] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchBuyList()
  }, [])

  const fetchBuyList = async () => {
    try {
      const response = await getBuyList()
      if (response.success) {
        setBuyList(response.buyList)
      }
    } catch (error) {
      console.error('구매 목록 조회 실패:', error);
    } finally {
      setLoading(false)
    }
  }

  // 날짜 포맷 (2026-02-23T00:00:00 -> 2026-02-23)
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return dateStr.split('T')[0]
  }

  // 대표 도서명 표시 (첫 번째 도서명 + 나머지 개수)
  const getRepresentTitle = (details) => {
    if (!details || details.length === 0) return ''
    const first = details[0].bookTitle
    const rest = details.length - 1
    return rest > 0 ? `${first} 외 ${rest}개` : first
  }

  // 페이지네이션 계산
  const totalPage = Math.ceil(buyList.length / PAGE_SIZE)
  const pagedList = buyList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  if (loading) return <div className={styles.loading}>로딩 중...</div>
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>주문 내역</h1>

      {buyList.length === 0 ? (
        <div className={styles.empty}>
          <p>주문 내역이 없습니다.</p>
          <Button variant='primary' onClick={() => navigate('/')}>
            쇼핑 계속하기
          </Button>
        </div>
      ) : (
        <>
          {pagedList.map(buy => (
            <div key={buy.buyNum} className={styles.buyCard}>

              {/* 주문 헤더 */}
              <div className={styles.buyHeader}>
                <div className={styles.buyHeaderLeft}>
                  <span className={styles.buyNum}>{buy.buyNum}</span>
                  <span className={styles.separator}>|</span>
                  <span className={styles.buyTitle}>
                    {getRepresentTitle(buy.details)}
                  </span>
                  <span className={styles.separator}>|</span>
                  <span className={styles.buyPrice}>
                    {buy.buyPrice?.toLocaleString()}원
                  </span>
                  <span className={styles.separator}>|</span>
                  <span className={styles.buyDate}>
                    {formatDate(buy.buyDate)}
                  </span>
                </div>
                <Button
                  variant='outline'
                  size='small'
                  onClick={() => navigate(`/buy-list/${buy.buyNum}`)}
                >
                  상세보기
                </Button>
              </div>

              {/* 주문 상세 테이블 */}
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.noCol}>No</th>
                      <th className={styles.bookCol}>도서 정보</th>
                      <th className={styles.priceCol}>가격</th>
                      <th className={styles.quantityCol}>수량</th>
                      <th className={styles.totalCol}>구매가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buy.details?.map((detail, index) => (
                      <tr key={detail.buyDetailNum}>
                        <td>{index + 1}</td>
                        <td>
                          <div 
                            onClick={() => navigate(`/books/${detail.bookNum}`)}
                            className={styles.bookInfo}
                          >
                            {detail.uploadFileName && (
                              <img
                                  src={detail.uploadFileName ? `upload/${detail.uploadFileName}` : '/placeholder.jpg'}
                                  alt={detail.bookTitle}
                                  className={styles.bookImg}
                              />
                            )}
                            <span className={styles.bookTitle}>
                              {detail.bookTitle}
                            </span>
                          </div>
                        </td>
                        <td>{detail.bookPrice?.toLocaleString()}원</td>
                        <td>{detail.buyCnt}</td>
                        <td className={styles.itemTotal}>
                          {(detail.bookPrice * detail.buyCnt).toLocaleString()}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* 페이지네이션 */}
          {totalPage > 1 && (
            <Pagenation 
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  )
}

export default BuyList