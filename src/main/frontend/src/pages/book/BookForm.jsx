import React, { useEffect, useState } from 'react'
import styles from './BookForm.module.css'
import Form from '../../components/common/Form'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { getCategories, registerBook } from '../../api/bookApi';

const BookForm = () => {
  const [bookData, setBookData] = useState({
    bookTitle: '',
    author: '',
    bookPrice: '',
    bookStock: 10,
    bookIntro: '',
    publishDate: '',
    cateNum: ''
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({
    cateNum: '',
    bookTitle: '',
    author: '',
    bookPrice: ''
  })

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

    setBookData(prev => ({
      ...prev,
      [name]: value
    }))

    // 실시간 검증
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
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
        bookPrice: Number(bookData.bookPrice),
        bookStock: Number(bookData.bookStock),
        cateNum: Number(bookData.cateNum),
        // publishDate가 빈 문자열이면 null로 보냄
        publishDate: bookData.publishDate || null
      };
      
      console.log('전송 데이터:', submitData); // 디버깅용
      
      await registerBook(submitData);
      alert('도서가 성공적으로 등록되었습니다.');
      
      // 폼 초기화
      setBookData({
        bookTitle: '',
        author: '',
        bookPrice: '',
        bookStock: 10,
        bookIntro: '',
        publishDate: '',
        cateNum: ''
      });
    } catch (error) {
      alert('도서 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Form title='도서 등록' onSubmit={handleSubmit}>
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
          value={bookData.bookPrice}
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
        disabled={loading}
      >
        {loading ? '등록 중...' : '도서 등록'}
      </Button>
    </Form>
  )
}

export default BookForm