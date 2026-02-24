import React, { useEffect, useRef, useState } from 'react'
import styles from './BookForm.module.css'
import Form from '../../components/common/Form'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import Textarea from '../../components/common/Textarea'
import { registerBook } from '../../api/bookApi';
import { getCategories } from '../../api/categoryApi';
import { IoCloseCircle } from 'react-icons/io5'

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

  // 이미지 파일 (FormData로 전송)
  const [mainImg, setMainImg] = useState(null)    // 대표 이미지 1개
  const [subImgs, setSubImgs] = useState([])      // 서브 이미지 여러개

  // 미리보기용 (화면 표시용)
  const [mainPreview, setMainPreview] = useState(null)
  const [subPreviews, setSubPreviews] = useState([])

  const subImgsRef = useRef(null)

  const [errors, setErrors] = useState({
    cateNum: '',
    bookTitle: '',
    author: '',
    bookPrice: '',
    publishDate: ''
  })

  const isFormValid =
    !errors.cateNum &&
    !errors.bookTitle &&
    !errors.bookPrice &&
    !errors.author &&
    !errors.publishDate &&
    bookData.cateNum &&
    bookData.bookTitle.trim() &&
    bookData.bookPrice &&
    bookData.author.trim() &&
    bookData.publishDate

    
  // img
  const handleFileChange = (e) => {
    const { name, files } = e.target

    if (name === 'mainImg') {
      // 기존 미리보기 URL 메모리 해제
      if (mainPreview) URL.revokeObjectURL(mainPreview)

      setMainImg(files[0])        // 단일 파일
      setMainPreview(URL.createObjectURL(files[0]))  // 미리보기 URL 생성

    } else if (name === 'subImgs') {
      const fileArray = [...files]

      // 기존 서브 미리보기 URL 메모리 해제
      subPreviews.forEach(url => URL.revokeObjectURL(url))

      setSubImgs(fileArray)      // 여러 파일을 배열로 변환
      setSubPreviews(fileArray.map(file => URL.createObjectURL(file)))  // 각 파일마다 미리보기 URL 생성
    }
  }

  // 서브 이미지 개별 삭제
  const handleSubImgRemove = (index) => {
    URL.revokeObjectURL(subPreviews[index])
    const newImgs = subImgs.filter((_, i) => i !== index)
    const newPreviews = subPreviews.filter((_, i) => i !== index)
    setSubImgs(newImgs)
    setSubPreviews(newPreviews)

    // 모두 삭제됐으면 input 초기화
    if (newImgs.length === 0 && subImgsRef.current) {
      subImgsRef.current.value = ''
    }
  }

  // 숫자를 1,000 형식으로 변환
  const formatPrice = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 1,000 형식을 숫자로 변환
  const parsePrice = (value) => {
    if (!value) return '';
    const numbers = value.replace(/[^\d,]/g, '');
    return numbers.replace(/,/g, '');
  }

  useEffect(() => {
    fetchCategories()

    // 초기 에러 상태 설정
    setErrors({
      cateNum: validateField('cateNum', ''),
      bookTitle: validateField('bookTitle', ''),
      author: validateField('author', ''),
      bookPrice: validateField('bookPrice', ''),
      publishDate: validateField('publishDate', '')
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
        if (value.length > 25) return '도서명은 25자 이하로 입력해주세요'
        return '';

      case 'author':
        if (!value || !value.trim()) return '저자명을 입력해주세요'
        if (value.length > 20) return '저자는 20자 이하로 입력해주세요'
        return '';

      case 'bookPrice': {
        if (!value) return '가격을 입력해주세요'
        const numPrice = Number(value.replace(/,/g, ''))
        if (numPrice <= 0) return '가격은 0원보다 커야 합니다'
        if (numPrice > 99999999) return '가격이 너무 큽니다'
        return '';
      }

      case 'publishDate':
        if (!value) return '출판일을 선택해주세요'
        return ''
    
      default:
        return '';
    }
  }

  const validate = () => {
    const newErrors = {
      cateNum: validateField('cateNum', bookData.cateNum),
      bookTitle: validateField('bookTitle', bookData.bookTitle),
      author: validateField('author', bookData.author),
      bookPrice: validateField('bookPrice', bookData.bookPrice),
      publishDate: validateField('publishDate', bookData.publishDate)
    }

    setErrors(newErrors)

    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === 'bookPrice') {
      const parsed = parsePrice(value)
      if (parsed && Number(parsed) > 99999999) {
        return
      }
      processedValue = parsed
    }

    setBookData(prev => ({
      ...prev,
      [name]: processedValue
    }))

    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, processedValue)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        ...bookData,
        cateNum: Number(bookData.cateNum),
        bookPrice: Number(bookData.bookPrice),
        publishDate: bookData.publishDate || null
      };
      
      await registerBook(submitData, mainImg, subImgs);  // 이미지 같이 전송
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
      setMainImg(null)
      setSubImgs([])

      // 초기화 할 때 URL 메모리 해제
      if (mainPreview) URL.revokeObjectURL(mainPreview)
      subPreviews.forEach(url => URL.revokeObjectURL(url))
      setMainPreview(null)
      setSubPreviews([])

      setErrors({
        cateNum: validateField('cateNum', ''),
        bookTitle: validateField('bookTitle', ''),
        author: validateField('author', ''),
        bookPrice: validateField('bookPrice', ''),
        publishDate: validateField('publishDate', '')
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
      <Select 
        label='Book Category'
        name='cateNum'
        value={bookData.cateNum}
        onChange={handleChange}
        options={categories.map(category => ({
          value: category.cateNum,
          label: category.cateName
        }))}
        placeholder='카테고리 선택'
        error={errors.cateNum}
        required
      />

      {/* 도서명 */}
      <Input
        label="Book Title"
        type="text"
        name="bookTitle"
        value={bookData.bookTitle}
        onChange={handleChange}
        placeholder="도서명을 입력하세요"
        error={errors.bookTitle}
        required
      />

      {/* 가격 | 저자 */}
      <div className={styles.rowGroup}>
        <Input
          label="Price"
          type="text"
          name="bookPrice"
          value={formatPrice(bookData.bookPrice)}
          onChange={handleChange}
          placeholder="가격"
          error={errors.bookPrice}
          required
        />
        <Input
          label="Author"
          type="text"
          name="author"
          value={bookData.author}
          onChange={handleChange}
          placeholder="저자명"
          error={errors.author}
          required
        />
      </div>

      {/* 도서 소개 */}
      <Textarea 
        label='Introduce'
        name='bookIntro'
        value={bookData.bookIntro}
        onChange={handleChange}
        placeholder='도서 소개를 입력하세요'
        maxLength={50}
        showCount={true}
        rows={4}
      />

      {/* 출판일 */}
      <Input
        label="Publish Date"
        type="date"
        name="publishDate"
        value={bookData.publishDate}
        onChange={handleChange}
        error={errors.publishDate}
        required
      />

      {/* 대표 이미지 */}
      <div className={styles.imgSection}>
        <p className={styles.imgLabel}>Book Image</p>

        {/* 대표 이미지 미리보기 */}
        {mainPreview ? (
          <div className={styles.imgGroup}>
            <span className={styles.imgTag}>대표</span>
            <div className={styles.imgItem}>
              <img src={mainPreview} alt='대표이미지 미리보기' />
              <button
                type='button'
                className={styles.imgDeleteBtn}
                onClick={() => {
                  URL.revokeObjectURL(mainPreview)
                  setMainImg(null)
                  setMainPreview(null)
                }}
              >
                <IoCloseCircle />
              </button>
            </div>
          </div>
        ) : (
          <Input
            label='대표 이미지'
            type='file'
            name='mainImg'
            onChange={handleFileChange}
            className={styles.bookImg}
            required
          />
        )}
        {/* 미리보기가 있으면 input 숨기고 이미지 표시, */}
        {/* 없으면 input 표시해요. X 누르면 다시 input이 나타나요. */}

        {/* 서브 이미지 */}
        {subPreviews.length > 0 && (
          <div className={styles.imgGroup}>
            <span className={styles.imgTag}>서브</span>
            <div className={styles.imgList}>
              {subPreviews.map((url, index) => (
                <div key={index} className={styles.imgItem}>
                  <img src={url} alt={`서브이미지${index + 1}`} />
                  <button
                    type='button'
                    className={styles.imgDeleteBtn}
                    onClick={() => handleSubImgRemove(index)}
                  >
                    <IoCloseCircle />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 서브 이미지 추가 input (항상 표시) */}
        <Input
          type='file'
          name='subImgs'
          onChange={handleFileChange}
          className={styles.bookImg}
          multiple={true}
          ref={subImgsRef}
        />
      </div>

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