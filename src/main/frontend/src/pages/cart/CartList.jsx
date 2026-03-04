import React, { useCallback, useEffect, useState } from 'react'
import { deleteCart, deleteCartList, getCartList, updateCartCnt } from '../../api/cartApi'
import styles from './CartList.module.css'
import Button from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CartList = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)

  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // 장바구니 목록 조회
  const fetchCartList = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getCartList()

      if (response.success) {
        setCartItems(response.cartList)
        setSelectedItems(response.cartList.map(item => item.cartNum))
      }
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      
      // 401 에러면 로그인 페이지로
      if (error.status === 401) {
        alert('로그인이 필요합니다.')
        navigate('/login')
      } else {
        alert(error.message || '장바구니 조회에 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }
    fetchCartList()
  }, [isAuthenticated, navigate, fetchCartList])

  // 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // 체크박스가 체크되면 -> 모든 cartNum을 selectedItems에 담음
      setSelectedItems(cartItems.map(item => item.cartNum))
    } else {
      // 체크 해제되면 -> selectedItems를 빈 배열로 초기화
      setSelectedItems([])
    }
  }

  // 개별 선택/해제
  const handleSelectItem = (cartNum) => {
    setSelectedItems(prev => {
      if (prev.includes(cartNum)) {
        // 이미 선택된 항목이면 -> filter로 해당 cartNum 제거 (선택 해제)
        return prev.filter(id => id !== cartNum )
      } else {
        // 선택 안 된 항목이면 -> 스프레드로 기존 배열에 추가 (선택)
        return [...prev, cartNum]
      }
    })
  }

  // 수량 증가
  const handleIncrease = async (cartNum, currentCnt, maxStock) => {
    if (currentCnt >= maxStock) {
      alert(`최대 ${maxStock}개까지 구매 가능합니다.`)
      return
    }

    await handleQuantityChange(cartNum, currentCnt + 1)
  }

  // 수량 감소
  const handleDecrease = async (cartNum, currentCnt) => {
    if (currentCnt <= 1) {
      // alert('최소 1개 이상이어야 합니다.')
      return
    }

    await handleQuantityChange(cartNum, currentCnt - 1)
  }

  // 수량 변경
  const handleQuantityChange = async (cartNum, newCnt) => {
    if (newCnt < 1) {
      // alert('수량은 1개 이상이어야 합니다.')
      return
    }

    // 재고 체크
    const item = cartItems.find(i => i.cartNum === cartNum);
    if (item && newCnt > item.bookStock) {
      alert(`재고는 ${item.bookStock}개 입니다.`);
      return;
    }

    // 낙관적 업데이트 - 서버 요청 전에 UI 먼저 반영
    setCartItems(prev =>
      prev.map(i => i.cartNum === cartNum ? {...i, cartCnt: newCnt} : i)
    )
    
    try {
      const response = await updateCartCnt(cartNum, newCnt)

      if (!response.success) {
        // 전체 목록 다시 조회 (총 가격도 같이 업데이트)
        // await fetchCartList() 이 내용을 사용하고 싶으면 ! 빼고 주석 해제
        // 실패 시 원래대로 복구
        fetchCartList()
      }
    } catch (error) {
      console.error('수량 변경 실패:', error)
      alert(error.message || '수량 변경에 실패했습니다.')

      // 실패 시 원래 상태로 복구
      fetchCartList()
    }
  }

  // 도서 상세 정보 이동
  const handleBookClick = (bookNum) => {
    navigate(`/books/${bookNum}`)
  }

  // 단일 삭제
  const handleDeleteItem = async (cartNum) => {
    if (!confirm('장바구니에서 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteCart(cartNum)
      fetchCartList()
      alert('삭제되었습니다.')
    } catch (error) {
      console.error('삭제 실패:', error)
      alert(error.message || '삭제에 실패했습니다.')
    }
  }

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.')
      return
    }

    if (!confirm(`선택한 ${selectedItems.length}개 상품을 삭제하시겠습니까?`)) {
      return
    }

    try {
      await deleteCartList(selectedItems)
      setSelectedItems([])
      fetchCartList()
      alert('선택한 상품이 삭제되었습니다.')
    } catch (error) {
      console.error('선택 삭제 실패:', error);
      alert(error.message || '선택 삭제에 실패했습니다.')      
    }
  }

  // 선택 구매
  const handlePurchaseSelected = () => {
    if (selectedItems.length === 0) {
      alert('구매할 상품을 선택해주세요')
      return
    }

    // 선택한 아이템만 필터링해서 OrderPage로 전달
    const selectedCartItems = cartItems.filter(item =>
      selectedItems.includes(item.cartNum)
    )

    navigate('/order', {
      state: { items: selectedCartItems }
    })
  }

  // 선택한 상품들의 총 가격 계산
  const getSelectedTotalPrice = () => {
    return cartItems
      // 1. 선택된 항목만 필터링
      // selectedItems = [1, 3, 5] 처럼 선택된 cartNum 목록
      // cartItems 중 selectedItems에 포함된 것만 추합
      .filter(item => selectedItems.includes(item.cartNum))
      // 2. 필터링된 항목들의 가격 합산
      // sum: 누적값 (초기값 0)
      // item: 현재 항목
      // 가격 * 수량을 누적해서 더함
      .reduce((sum, item) => sum + (item.bookPrice * item.cartCnt), 0)
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>장바구니</h1>
        <div className={styles.empty}>
          <p>장바구니가 비어있습니다.</p>
          <Button onClick={() => window.location.href = '/'} variant='primary'>
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>장바구니</h1>

      {cartItems.length === 0 ? (
        <div className={styles.empty}>
          <p>장바구니가 비어있습니다.</p>
          <Button onClick={() => navigate('/')} variant="primary">
            쇼핑 계속하기
          </Button>
        </div>
      ) : (
        <>
          {/* 장바구니 테이블 */}
          <div className={styles.tableWrapper}>
            <table className={styles.cartTable}>
              <thead>
                <tr>
                  <th className={styles.noCol}>No</th>
                  <th>
                    <input 
                      type='checkbox'
                      checked={selectedItems.length === cartItems.length}
                      onChange={handleSelectAll}
                      className={styles.checkbox}
                    />
                  </th>
                  <th className={styles.bookCol}>도서 정보</th>
                  <th className={styles.priceCol}>가격</th>
                  <th className={styles.quantityCol}>수량</th>
                  <th className={styles.totalCol}>구매가격</th>
                  <th className={styles.dateCol}>장바구니 등록 일자</th>
                  <th className={styles.actionCol}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.cartNum} className={styles.cartRow}>
                    <td>{cartItems.length - index}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(item.cartNum)}
                        onChange={() => handleSelectItem(item.cartNum)}
                        className={styles.checkbox}
                      />
                    </td>
                    <td className={styles.bookInfo} onClick={() => handleBookClick(item.bookNum)}>
                      <div className={styles.bookContent}>
                        <img 
                          src={item.uploadFileName ? `/upload/${item.uploadFileName}` : '/placeholder.jpg'}
                          alt={item.bookTitle}
                          className={styles.bookImage}
                        />
                        <div className={styles.bookDetails}>
                          <div className={styles.bookTitle}>{item.bookTitle}</div>
                          <div className={styles.bookAuthor}>{item.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>{item.bookPrice?.toLocaleString()}원</td>
                    <td>
                      <div className={styles.quantityControl}>
                        <button 
                          className={styles.quantityBtn}
                          onClick={() => handleDecrease(item.cartNum, item.cartCnt)}
                        >
                          -
                        </button>
                        <input
                            type="number"
                            className={styles.quantityInput}
                            value={item.cartCnt}
                            min={1}
                            max={item.bookStock}
                            onChange={(e) => {
                              const value = e.target.value

                              // 숫자가 아니면 무시 (기존 값 유지)
                              if (value !== '' && !/^\d+$/.test(value)) return

                              handleQuantityChange(item.cartNum, parseInt(value) || item.cartCnt)
                            }}
                        />
                        <button 
                          className={styles.quantityBtn}
                          onClick={() => handleIncrease(item.cartNum, item.cartCnt, item.bookStock)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className={styles.totalPrice}>
                      {(item.bookPrice * item.cartCnt).toLocaleString()}원
                    </td>
                    <td>
                      {new Date(item.cartDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <Button 
                        variant='danger'
                        size='small'
                        onClick={() => handleDeleteItem(item.cartNum)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 총 구매 가격 */}
          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>총 구매 가격: </span>
            <span className={styles.totalAmount}>
              {selectedItems.length > 0
                ? `${getSelectedTotalPrice().toLocaleString()}원`
                : `0원`
              }
            </span>
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonGroup}>
            <Button
              variant='danger'
              size='large'
              onClick={handleDeleteSelected}
            >
              선택 삭제
            </Button>
            <Button
              variant='primary'
              size='large'
              onClick={handlePurchaseSelected}
            >
              선택 구매
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default CartList