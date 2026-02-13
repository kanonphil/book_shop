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
    fetchBookDetail()
  }, [bookNum])

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

  const handleQuantityChange = (e) => {
    const value = e.target.value

    // 빈 값 허용 (입력 중)
    if (value === '') {
      setQuantity('');
      setQuantityError('');
      return;
    }

    // 숫자만 허용
    if (!/^\d+$/.test(value)) {
      setQuantityError('숫자만 입력 가능합니다.');
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

    // TODO: 구매 페이지로 이동
    alert(`${book.bookTitle}을(를) ${qty}개 구매합니다. (구매 기능은 추후 구현)`);
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

  const totalPrice = book.bookPrice * quantity

  return (
    <div className={styles.container}>
      {/* 상단 영역 */}
      <div className={styles.topSection}>
        {/* 이미지 */}
        <div className={styles.imageSection}>
          <img 
            src="/main_react.jpg" 
            alt={book.bookTitle}
            className={styles.image}
          />
        </div>

        {/* 정보 영역 */}
        <div className={styles.infoSection}>
          <h1 className={styles.title}>{book.bookTitle}</h1>

          <div className={styles.infoItem}>
            <span className={styles.label}>저자 :</span>
            <span className={styles.value}>{book.author}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>가격 :</span>
            <span className={styles.value}>{book.bookPrice?.toLocaleString()}원</span>
          </div>

          {/* 수량 */}
          <div className={styles.infoItem}>
            <span className={styles.label}>수량 :</span>
            <div className={styles.quantityWrapper}>
              <Input
                type="number"
                name="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                error={quantityError}
                placeholder="수량"
                min="1"
                max={book.bookStock}
              />
              {!quantityError && (
                <span className={styles.stockInfo}>
                  (재고: {book.bookStock}개)
                </span>
              )}
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>총 구매 가격 :</span>
            <span className={styles.value}>{totalPrice?.toLocaleString()}원</span>
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonGroup}>
            <Button
              variant="success"
              onClick={handleAddToCart}
              fullWidth
            >
              장바구니 담기
            </Button>
            <Button
              variant="primary"
              onClick={handleBuyNow}
              fullWidth
            >
              바로 구매
            </Button>
          </div>
        </div>
      </div>

      {/* 도서 소개 영역 */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.sectionTitle}>도서 소개</h2>
        <div className={styles.descriptionBox}>
          <img 
            src="/리액트 다루는 기술 상세이미지1.jpg" 
            alt={book.bookIntro} 
            className={styles.descriptionImage}
          />
          <div className={styles.descriptionText}>
            {book.bookIntro || '도서 소개 내용이 없습니다.'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail