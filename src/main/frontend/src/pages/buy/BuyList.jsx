import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBuyList } from '../../api/buyApi'
import styles from './BuyList.module.css'
import Button from '../../components/common/Button'
import Pagenation from '../../components/common/Pagination'
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5'

const PAGE_SIZE = 5

const BuyList = () => {
  const navigate = useNavigate()
  const [buyList, setBuyList] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // 아코디언 열림 상태: Set으로 현재 펼쳐진 buyNum을 관리
  const [openItems, setOpenItems] = useState(new Set())

  useEffect(() => {
    fetchBuyList()
  }, [])

  const fetchBuyList = async () => {
    try {
      const response = await getBuyList()
      if (response.success) {
        setBuyList(response.buyList)
        // 기본적으로 모든 항목을 펼친 상태로 초기화
        setOpenItems(new Set(response.buyList.map(b => b.buyNum)))
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

  /**
   * 아코디언 토글 핸들러
   * 이미 열린 항목이면 닫고, 닫힌 항목이면 엶
   * @param {number} buyNum - 토글할 주문 번호
   */
  const toggleAccordion = (buyNum) => {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(buyNum)) {
        next.delete(buyNum)
      } else {
        next.add(buyNum)
      }
      return next
    })
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
      <h1 className={styles.title}>구매 내역</h1>

      {buyList.length === 0 ? (
        <div className={styles.empty}>
          <p>구매 내역이 없습니다.</p>
          <Button variant='primary' onClick={() => navigate('/')}>
            쇼핑 계속하기
          </Button>
        </div>
      ) : (
        <>
          {pagedList.map(buy => {
            // 현재 항목이 펼쳐진 상태인지 확인
            const isOpen = openItems.has(buy.buyNum)

            return (
              <div key={buy.buyNum} className={styles.buyCard}>

                {/* 주문 헤더 - 클릭 시 아코디언 토글 */}
                <div
                  className={styles.buyHeader}
                  onClick={() => toggleAccordion(buy.buyNum)}
                >
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

                  {/* 업/다운 아이콘: 열리면 위쪽 화살표, 닫히면 아래쪽 화살표 */}
                  <span className={styles.chevron}>
                    {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </span>
                </div>

                {/* 주문 상세 테이블 - isOpen일 때만 렌더링 (아코디언) */}
                {isOpen && (
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
                                onClick={(e) => {
                                  // 헤더 클릭 이벤트(아코디언)와 분리
                                  e.stopPropagation()
                                  navigate(`/books/${detail.bookNum}`)
                                }}
                                className={styles.bookInfo}
                              >
                                {detail.uploadFileName && (
                                  <img
                                      src={detail.uploadFileName ? `/upload/${detail.uploadFileName}` : '/placeholder.jpg'}
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
                )}
              </div>
            )
          })}

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
