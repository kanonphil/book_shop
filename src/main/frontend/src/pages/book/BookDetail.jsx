import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookDetail } from '../../api/bookApi'
import Button from '../../components/common/Button'
import styles from './BookDetail.module.css'
import Input from '../../components/common/Input'
import { useSelector } from 'react-redux'
import { addToCart } from '../../api/cartApi'

const BookDetail = () => {
  const { bookNum } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.auth)

  const [book, setBook] = useState(null)
  const [quantity, setQuantity] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [quantityError, setQuantityError] = useState('')

  useEffect(() => {
    const fetchBookDetail = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getBookDetail(bookNum)

        if (response.success) {
          setBook(response.data)
        }
      } catch (error) {
        setError(error.message || '도서 정보를 불러오는데 실패했습니다.')
        console.error('도서 상세 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookDetail()
  }, [bookNum])

  const handleQuantityChange = (e) => {
    // 붙여넣기 대비 숫자 외 문자 제거
    const value = e.target.value.replace(/[^0-9]/g, '')

    // 빈 값 허용 (입력 중)
    if (value === '') {
      setQuantity('');
      setQuantityError('');
      return;
    }

    const numValue = parseInt(value);
    
    // 유효성 검사
    if (numValue < 1) {
      setQuantityError('최소 1개 이상 입력하세요.');
      setQuantity(value);
      return;
    }
    
    if (book && numValue > book.bookStock) {
      setQuantityError(`재고는 ${book.bookStock}개 입니다.`);
      setQuantity(value);
      return;
    }
    
    // 정상
    setQuantityError('');
    setQuantity(value);
  }

  // 장바구니 담기
  const handleAddToCart = async () => {
    const qty = parseInt(quantity) || 0

    if (qty < 1) {
      alert('수량을 입력해주세요')
      return;
    }

    // 로그인 체크
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }

    try {
      await addToCart(book.bookNum, qty)

      const goToCart = confirm('장바구니에 추가되었습니다. \n장바구니로 이동하시겠습니까?')

      if (goToCart) {
        navigate('/carts')
      }
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert(error.message || '장바구니 추가에 실패했습니다.')
    }
  }

  // 바로 구매
  const handleBuyNow = () => {
    const qty = parseInt(quantity) || 0;
    
    if (qty < 1) {
      alert('수량을 입력해주세요.');
      return;
    }

    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    // 구매 페이지로 이동
    navigate('/order', {
      state: {
        items: [{
          bookNum: book.bookNum,
          bookTitle: book.bookTitle,
          bookPrice: book.bookPrice,
          cartCnt: qty,
          uploadFileName: mainImg?.uploadFileName || null,
          cartNum: null
        }]
      }
    })
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <Button onClick={() => navigate('/books')}>목록으로</Button>
      </div>
    )
  }

  if (!book) {
    return null
  }

  // 이미지 분리
  const mainImg = book.images?.find(img => img.isMain === 'Y')
  const subImgs = book.images?.filter(img => img.isMain === 'N')

  const totalPrice = book.bookPrice * quantity

  // 한글/영문 키 입력 자체를 막기
  const handleKeyDown = (e) => {
    // 허용할 키 목록
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'
    ]
    
    // 숫자도 아니고 허용 키도 아니면 입력 차단
    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault()  // 입력 자체를 막음
    }
  }

  return (
    <div className={styles.container}>
      {/* 상단 영역 */}
      <div className={styles.topSection}>
        {/* 이미지 */}
        <div className={styles.imageSection}>
          <img 
            src={mainImg ? `/upload/${mainImg.uploadFileName}` : '/placeholder.jpg'}
            alt={book.bookTitle}
            className={styles.image}
          />
        </div>

        {/* 정보 영역 */}
        <div className={styles.infoSection}>
          {/* 상단 영역 */}
          <div className={styles.infoTop}>
            <h1 className={styles.title}>{book.bookTitle}</h1>
            <p className={styles.author}>{book.author}</p>
  
            {/* 가격 영역 */}
            <div className={styles.priceSection}>
              <span>{book.bookPrice?.toLocaleString()}원</span>
            </div>
  
            <hr className={styles.divider}/>
  
            {/* 수량 */}
            <div className={styles.quantityRow}>
              <span className={styles.label}>수량</span>
              {book.bookStock === 0 ? (
                <span className={styles.outOfStock}>현재 품절된 상품입니다.</span>
              ) : (
                <div className={styles.quantityWrapper}>
                  <div className={styles.quantityControl}>
                    <button 
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => {
                        const val = Math.max(1, (parseInt(quantity) || 1) - 1)
                        setQuantity(String(val))
                        setQuantityError('')
                      }}
                    >-</button>
                    <Input
                      type="text"
                      name="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      onKeyDown={handleKeyDown}
                      onBlur={() => {
                        if (quantity === '' || quantity === '0') {
                          setQuantity('1')
                          setQuantityError('')
                        }
                      }}
                      placeholder="수량"
                      min="1"
                      max={book.bookStock}
                      className={styles.quantityInput}
                    />
                    <button 
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => {
                        const val = (parseInt(quantity) || 1) + 1
                        if (val > book.bookStock) {
                          setQuantityError(`재고는 ${book.bookStock}개 입니다.`)
                          return
                        }
                        setQuantity(String(val))
                        setQuantityError('')
                      }}
                    >+</button>
                  </div>
                </div>
              )}
              
              {/* 재고 | 에러 */}
              {quantityError
                ? <span className={styles.qtyError}>{quantityError}</span>
                : <span className={styles.stockInfo}>재고: {book.bookStock}개</span>
              }
            </div>
  
            <hr className={styles.divider}/>
          </div>

          {/* 하단 영역 */}
          <div className={styles.infoBottom}>
            {/* 총 금액 */}
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>총 상품 금액</span>
              <div className={styles.totalRight}>
                <span className={styles.totalQty}>총 수량 {quantity || 0}개</span>
                <strong className={styles.totalValue}>
                  <span className={styles.totalValueNum}>
                    {totalPrice?.toLocaleString()}
                  </span>
                  <span className={styles.totalValueUnit}>원</span>
                </strong>
              </div>
            </div>
  
            {/* 버튼 영역 */}
            <div className={styles.buttonGroup}>
              {book.bookStock === 0 ? (
                <Button
                  variant="secondary"
                  fullWidth
                  disabled
                >
                  품절
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleAddToCart}
                    fullWidth
                  >
                    장바구니
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleBuyNow}
                    fullWidth
                  >
                    구매하기
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 도서 소개 영역 */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.sectionTitle}>도서 소개</h2>
        <div className={styles.descriptionBox}>
          <div className={styles.descriptionText}>
            {book.bookIntro || '도서 소개 내용이 없습니다.'}
          </div>
          {/* subImgs */}
          {subImgs?.length > 0 ? (
            subImgs.map(img => (
              <img 
                key={img.imgNum}
                src={`/upload/${img.uploadFileName}`} 
                alt={book.bookIntro} 
                className={styles.descriptionImage}
              />
            ))
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default BookDetail