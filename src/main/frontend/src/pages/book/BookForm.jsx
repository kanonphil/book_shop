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

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      alert('카테고리 목록을 불러오는데 실패했습니다.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 유효성 검사
    if (!bookData.cateNum || !bookData.bookTitle || !bookData.author || !bookData.bookPrice) {
      alert('필수 항목을 모두 입력해주세요.');
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
        cateNum: '',
        bookTitle: '',
        bookPrice: '',
        author: '',
        bookIntro: '',
        publishDate: '',
        bookStock: 10
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