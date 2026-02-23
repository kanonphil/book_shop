import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createBuy } from '../../api/buyApi'
import { deleteCartList } from '../../api/cartApi'
import styles from './OrderPage.module.css'
import Button from '../../components/common/Button'

const OrderPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // CartList에서 navigate('/order', {state: {items}})로 넣어온 데이터
  const items = location.state?.items || []

  const [isLoading, setIsLoading] = useState(false)

  // 아이템 없으면 장바구니로 리다이렉트
  useEffect(() => {
    if (items.length === 0) {
      alert('주문할 상품이 없습니다.')
      navigate('/carts')
    }
  }, [items.length, navigate])

  // 총 주문 금액
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.bookPrice * item.cartCnt), 0
  )

  // 주문 확정
  const handleOrder = async () => {
    if (!confirm('주문을 확정하시겠습니까?')) return

    setIsLoading(true)
    try {
      const buyData = {
        buyPrice: totalPrice,
        details: items.map(item => ({
          bookNum: item.bookNum,
          buyCnt: item.cartCnt,
          buyPrice: item.bookPrice * item.cartCnt
        }))
      }

      console.log('주문 데이터:', buyData)
      console.log('items:', items)

      const response = await createBuy(buyData)

      if (response.success) {
        const cartNumList = items
        .map(item => item.cartNum)
        .filter(cartNum => cartNum !== null)
        
        // 주문 성공 후 장바구니에서 삭제
        if (cartNumList.length > 0) {
          await deleteCartList(cartNumList)
        }

        alert('주문이 완료되었습니다.')
        navigate('/buy-list')
      }
    } catch (error) {
      alert(error.message || '주문에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>주문서</h1>

      {/* 주문 상품 목록 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>주문 상품</h2>
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
              {items.map((item, index) => (
                <tr key={item.cartNum}>
                  <td>{index + 1}</td>
                  <td>
                    <div className={styles.bookInfo}>
                      <img 
                        src={item.uploadFileName
                          ? `upload/${item.uploadFileName}`
                          : '/placeholder.jpg'
                        }
                        alt={item.bookTitle}
                         className={styles.bookImg} 
                      />
                      <span className={styles.bookTitle}>
                        {item.bookTitle}
                      </span>
                    </div>
                  </td>
                  <td>{item.bookPrice?.toLocaleString()}원</td>
                  <td>{item.cartCnt}</td>
                  <td className={styles.itemTotal}>
                    {(item.bookPrice * item.cartCnt).toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 총 주문 금액 */}
      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>총 주문 금액</span>
        <div className={styles.totalRight}>
          <span className={styles.totalQty}>
            총 {items.reduce((sum, item) => sum + item.cartCnt, 0)}개
          </span>
          <span className={styles.totalValue}>
            <span className={styles.totalValueNum}>
              {totalPrice.toLocaleString()}
            </span>원
          </span>
        </div>
      </div>

      {/* 버튼 */}
      <div className={styles.buttonGroup}>
        <Button
          variant='secondary'
          size='large'
          onClick={() => navigate('/carts')}
        >
          장바구니로 돌아가기
        </Button>
        <Button
          variant='primary'
          size='large'
          onClick={handleOrder}
          disabled={isLoading}
        >
          {isLoading ? '주문 처리 중...' : '주문 확정'}
        </Button>
      </div>
    </div>
  )
}

export default OrderPage