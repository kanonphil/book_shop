import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCartList } from '../../api/cartApi'
import { getBuyList } from '../../api/buyApi'
import styles from './MyPageMain.module.css'
import { IoCartOutline, IoReceiptOutline } from 'react-icons/io5'

const MyPagemain = () => {
  const navigate = useNavigate()
  const { member } = useSelector(state => state.auth)
  
  const [cartItems, setCartItems] = useState([])
  const [buyItems, setBuyItems] = useState([])

  useEffect(() => {
    const fetchCartPreview = async () => {
      try {
        const response = await getCartList()
        if (response.success) {
          setCartItems(response.cartList.slice(0, 3))
        }
      } catch (error) {
        console.error('장바구니 조회 실패:', error);
      }
    }

    const fetchBuyPreview = async () => {
      try {
        const response = await getBuyList()
        if (response.success) {
          setBuyItems(response.buyList.slice(0, 3))
        }
      } catch (error) {
        console.error('주문내역 조회 실패:', error);
      }
    }
    
    fetchCartPreview()
    fetchBuyPreview()
  }, [])
  
  return (
    <div className={styles.container}>
      
      {/* 내 정보 섹션 */}
      <section className={styles.profileSection}>
        <div className={styles.profileIcon}>
          {member?.memName?.charAt(0)}
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{member?.memName}</h2>
          <p className={styles.profileEmail}>{member?.memEmail}</p>
          {member?.memTel && <p className={styles.profileTel}>{member?.memTel}</p>}
          {member?.memAddr && (
            <p className={styles.profileAddr}>
              {member?.memAddr} {member?.addrDetail}
            </p>
          )}
        </div>
        <button 
          type="button"
          className={styles.editBtn}
          onClick={() => navigate('/mypage/profile-edit')}
        >
          정보 수정
        </button>
      </section>

      {/* 장바구니 미리보기 */}
      <section className={styles.previewSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}><IoCartOutline /> 장바구니</h3>
          <span
            className={styles.viewAll}
            onClick={() => navigate('/mypage/cart')}
          >
            전체보기
          </span>
        </div>

        {cartItems.length === 0 ? (
          <p className={styles.emptyMsg}>장바구니가 비어있습니다.</p>
        ) : (
          <div className={styles.cartPreviewList}>
            {cartItems.map(item => (
              <div key={item.cartNum} className={styles.cartPreviewItem}>
                <img 
                  src={item.uploadFileName ? `/upload/${item.uploadFileName}` : '/placeholder.jpg'} 
                  alt={item.bookTitle}
                  className={styles.cartPreviewImg}
                />
                <div className={styles.cartPreviewInfo}>
                  <p className={styles.cartPreviewTitle}>{item.bookTitle}</p>
                  <p className={styles.cartPreviewPrice}>
                    {(item.bookPrice * item.cartCnt).toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 주문내역 미리보기 */}
      <section className={styles.previewSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}><IoReceiptOutline /> 구매내역</h3>
          <span
            className={styles.viewAll}
            onClick={() => navigate('/mypage/buy-list')}
          >
            전체보기
          </span>
        </div>

        {buyItems.length === 0 ? (
          <p className={styles.emptyMsg}>구매 내역이 없습니다.</p>
        ) : (
          <div className={styles.buyPreviewList}>
            {buyItems.map(item => (
              <div key={item.buyNum} className={styles.buyPreviewItem}>
                <span className={styles.buyDate}>
                  {item.buyDate?.split('T')[0]}
                </span>
                <span className={styles.buyTitle}>
                  {item.details?.[0]?.bookTitle}
                  {item.details?.length > 1 && ` 외 ${item.details.length - 1}개`}
                </span>
                <span className={styles.buyPrice}>
                  {item.buyPrice?.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default MyPagemain