import React, { useEffect, useState } from 'react'
import styles from './BookForm.module.css'
import Form from '../../components/common/Form'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { registerBook } from '../../api/bookApi';
import { getCategories } from '../../api/categoryApi';

const BookForm = () => {
  const [bookData, setBookData] = useState({
    cateNum: '',
    bookTitle: '',
    author: '',
    bookPrice: '',
    bookIntro: '',
    publishDate: ''
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({
    cateNum: '',
    bookTitle: '',
    author: '',
    bookPrice: ''
  })

  const isFormValid =
    !errors.cateNum &&
    !errors.bookTitle &&
    !errors.bookPrice &&
    !errors.author &&
    bookData.cateNum &&
    bookData.bookTitle.trim() &&
    bookData.bookPrice &&
    bookData.author.trim();

  // 숫자를 1,000 형식으로 변환
  const formatPrice = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 1,000 형식을 숫자로 변환
  const parsePrice = (value) => {
    return value.replace(/,/g, '')
  }

  useEffect(() => {
    fetchCategories()

    // 초기 에러 상태 설정
    setErrors({
      cateNum: validateField('cateNum', ''),
      bookTitle: validateField('bookTitle', ''),
      author: validateField('author', ''),
      bookPrice: validateField('bookPrice', '')
    })
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      alert('카테고리 목록을 불러오는데 실패했습니다.')
    }
  }

  const validateField = (field, value) => {
    switch (field) {
      case 'cateNum':
        if (!value) return '카테고리를 선택해주세요'
        return '';

      case 'bookTitle':
        if (!value || !value.trim()) return '도서명을 입력해주세요'
        if (value.length > 30) return '도서명은 30자 이하로 입력해주세요'
        return '';

      case 'author':
        if (!value || !value.trim()) return '저자를 입력해주세요'
        if (value.length > 20) return '저자는 20자 이하로 입력해주세요'
        return '';

      case 'bookPrice':
        if (!value) return '가격을 입력해주세요'
        if (!value < 0) return '가격은 0원보다 커야 합니다'
        if (!value > 999999) return '가격이 너무 큽니다'
        return '';
    
      default:
        return '';
    }
  }

  const validate = () => {
    const newErrors = {
      cateNum: validateField('cateNum', bookData.cateNum),
      bookTitle: validateField('bookTitle', bookData.bookTitle),
      author: validateField('author', bookData.author),
      bookPrice: validateField('bookPrice', bookData.bookPrice)
    }

    setErrors(newErrors)

    // 에러가 하나라도 있으면 false
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    // 가격 필드는 콤마 제거 후 저장
    if (name === 'bookPrice') {
      processedValue = parsePrice(value)
    }

    setBookData(prev => ({
      ...prev,
      [name]: processedValue
    }))

    // 실시간 검증
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, processedValue)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 전체 유효성 검사
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // 백엔드로 보낼 데이터 변환
      const submitData = {
        ...bookData,
        cateNum: Number(bookData.cateNum),
        bookPrice: Number(bookData.bookPrice),
        publishDate: bookData.publishDate || null
        // publishDate: bookData.publishDate ? new Date(bookData.publishDate).toISOString() : null
      };
      
      console.log('전송 데이터:', submitData); // 디버깅용
      
      await registerBook(submitData);
      alert('도서가 성공적으로 등록되었습니다.');
      
      // 폼 초기화
      setBookData({
        cateNum: '',
        bookTitle: '',
        author: '',
        bookPrice: '',
        bookIntro: '',
        publishDate: ''
      });

      // 에러 메시지 재설정
      setErrors({
        cateNum: validateField('cateNum', ''),
        bookTitle: validateField('bookTitle', ''),
        author: validateField('author', ''),
        bookPrice: validateField('bookPrice', '')
      });

    } catch (error) {
      alert('도서 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Form 
      title='상품 등록' 
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault()
        }
      }}
    >
      {/* 카테고리 선택 */}
      <div className={styles.formGroup}>
        <label>Book Category</label>
        <select 
          name="cateNum"
          value={bookData.cateNum}
          onChange={handleChange}
          className={styles.select}
          required
        >
          <option value="">카테고리 선택</option>
          {categories.map(category => (
            <option key={category.cateNum} value={category.cateNum}>
              {category.cateName}
            </option>
          ))}
        </select>
        {errors.cateNum && <span className={styles.error}>{errors.cateNum}</span>}
      </div>

      {/* 도서명 */}
      <Input
        label="Book Title"
        type="text"
        name="bookTitle"
        value={bookData.bookTitle}
        onChange={handleChange}
        placeholder="도서명을 입력하세요"
        required
      />
      {errors.bookTitle && <span className={styles.error}>{errors.bookTitle}</span>}

      {/* 가격 | 저자 */}
      <div className={styles.rowGroup}>
        <Input
          label="Price"
          type="number"
          name="bookPrice"
          value={formatPrice(bookData.bookPrice)} // format
          onChange={handleChange}
          placeholder="가격"
          required
        />
        <Input
          label="Author"
          type="text"
          name="author"
          value={bookData.author}
          onChange={handleChange}
          placeholder="저자명"
          required
        />
      </div>
      {/* 통합 에러 */}
      {(errors.bookPrice || errors.author) && (
        <span className={styles.error}>
          {errors.bookPrice && errors.author
            ? '가격과 저자를 입력해주세요'
            : errors.bookPrice || errors.author}
        </span>
      )}

      {/* 도서 소개 */}
      <div className={styles.formGroup}>
        <label>Introduce</label>
        <textarea
          name="bookIntro"
          value={bookData.bookIntro}
          onChange={handleChange}
          placeholder="도서 소개를 입력하세요"
          className={styles.textarea}
          maxLength={50}
        />
      </div>

      {/* 출판일 */}
      <Input
        label="Publish Date"
        type="date"
        name="publishDate"
        value={bookData.publishDate}
        onChange={handleChange}
      />

      {/* 제출 버튼 */}
      <Button 
        type="submit" 
        variant="primary" 
        fullWidth
        disabled={loading || !isFormValid}
      >
        {loading ? '등록 중...' : '도서 등록'}
      </Button>
    </Form>
  )
}

export default BookForm