import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookDetail, updateBook } from '../../../api/bookApi'
import { getCategories } from '../../../api/categoryApi'
import { addBookImgs, deleteBookImg } from '../../../api/bookImgApi'
import styles from './ManageBookEdit.module.css'
import Select from '../../../components/common/Select'
import Input from '../../../components/common/Input'
import Textarea from '../../../components/common/Textarea'
import { IoCloseCircle } from 'react-icons/io5'
import Button from '../../../components/common/Button'

const ManageBookEdit = () => {
  const { bookNum } = useParams()
  const navigate = useNavigate()

  const [bookData, setBookData] = useState({
    cateNum: '',
    bookTitle: '',
    author: '',
    bookPrice: '',
    bookIntro: '',
    publishDate: ''
  })

  const [categories, setCategories] = useState([])

  // 기존 이미지 (DB에서 불러온 것)
  const [existingImgs, setExistingImgs] = useState([])
  // 삭제할 이미지 번호 목록
  const [deleteImgNums, setDeleteImgNums] = useState([])

  // 새 대표 이미지 (1장만)
  const [newMainImg, setNewMainImg] = useState(null)
  const [newMainImgPreview, setNewMainImgPreview] = useState(null)

  // 새 서브 이미지 (여러 장)
  const [newSubImgs, setNewSubImgs] = useState([])
  const [newSubImgPreviews, setNewSubImgPreviews] = useState([])

  const [loading, setLoading] = useState(false)

  // 도서 상세 + 카테고리 목록 불러오기
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [bookRes, cateRes] = await Promise.all([
        getBookDetail(bookNum),
        getCategories()
      ])

      const book = bookRes.data
      setBookData({
        cateNum: book.cateNum,
        bookTitle: book.bookTitle,
        author: book.author,
        bookPrice: book.bookPrice,
        bookIntro: book.bookIntro || '',
        publishDate: book.publishDate
      })
      setExistingImgs(book.images || [])
      setCategories(cateRes)
    } catch (error) {
      alert('도서 정보를 불러오는데 실패했습니다.')
      navigate('/manage/book-edit')
    } finally {
      setLoading(false)
    }
  }, [bookNum, navigate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 텍스트 필드 변경
  const handleChange = (e) => {
    const { name, value } = e.target
    setBookData(prev => ({ ...prev, [name]: value }))
  }

  // 기존 이미지 삭제 표시
  const handleImgDeleteMark = (imgNum) => {
    setDeleteImgNums(prev => [...prev, imgNum])
    setExistingImgs(prev => prev.filter(img => img.imgNum !== imgNum))
  }

  // 새 대표 이미지 선택 (1장만 허용)
  const handleNewMainImgChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 기존 미리보기 URL 해제
    if (newMainImgPreview) {
      URL.revokeObjectURL(newMainImgPreview)
    }

    setNewMainImg(file)
    setNewMainImgPreview(URL.createObjectURL(file))
  }

  // 새 대표 이미지 제거
  const handleNewMainImgRemove = () => {
    URL.revokeObjectURL(newMainImgPreview)
    setNewMainImg(null)
    setNewMainImgPreview(null)
  }

  // 새 서브 이미지 선택 (여러 장)
  const handleNewSubImgsChange = (e) => {
    const files = [...e.target.files]
    setNewSubImgs(prev => [...prev, ...files])

    const previews = files.map(file => URL.createObjectURL(file))
    setNewSubImgPreviews(prev => [...prev, ...previews])
  }

  // 새 서브 이미지 제거
  const handleNewSubImgRemove = (index) => {
    URL.revokeObjectURL(newSubImgPreviews[index])
    setNewSubImgs(prev => prev.filter((_, i) => i !== index))
    setNewSubImgPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // 저장
  const handleSubmit = async () => {
    if (!bookData.bookTitle.trim()) {
      alert('도서명을 입력해주세요')
      return
    }

    setLoading(true)
    try {
      // 1. 텍스트 정보 수정
      await updateBook(bookNum, {
        ...bookData,
        cateNum: Number(bookData.cateNum),
        bookPrice: Number(bookData.bookPrice)
      })

      // 2. 삭제 표시된 이미지 삭제
      if (deleteImgNums.length > 0) {
        await Promise.all(
          deleteImgNums.map(imgNum => deleteBookImg(bookNum, imgNum))
        )
      }

      // 3. 새 이미지 추가 (mainImg / subImgs 구분해서 전달)
      const hasNewMain = newMainImg !== null
      const hasNewSubs = newSubImgs.length > 0

      if (hasNewMain || hasNewSubs) {
        await addBookImgs(
          bookNum,
          hasNewMain ? newMainImg : null,
          hasNewSubs ? newSubImgs : null
        )
      }

      alert('수정이 완료되었습니다.')
      navigate('/manage/book-edit')
    } catch (error) {
      alert('수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>로딩 중...</p>

  // 기존 이미지 분리
  const existingMainImg = existingImgs.find(img => img.isMain === 'Y')
  const existingSubImgs = existingImgs.filter(img => img.isMain === 'N')

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>상품 정보 수정</h2>

      <div className={styles.formWrap}>
        {/* 카테고리 */}
        <Select
          label='Category'
          name='cateNum'
          value={bookData.cateNum}
          onChange={handleChange}
          options={categories.map(c => ({ value: c.cateNum, label: c.cateName }))}
        />

        {/* 도서명 */}
        <Input
          label='Book Title'
          name='bookTitle'
          value={bookData.bookTitle}
          onChange={handleChange}
        />

        {/* 가격 | 저자 */}
        <div className={styles.rowGroup}>
          <Input
            label='Price'
            name='bookPrice'
            value={bookData.bookPrice}
            onChange={handleChange}
          />
          <Input
            label='Author'
            name='author'
            value={bookData.author}
            onChange={handleChange}
          />
        </div>

        {/* 출판일 */}
        <Input
          label='Publish Date'
          type='date'
          name='publishDate'
          value={bookData.publishDate}
          onChange={handleChange}
        />

        {/* 도서 소개 */}
        <Textarea
          label='Introduce'
          name='bookIntro'
          value={bookData.bookIntro}
          onChange={handleChange}
          rows={4}
          maxLength={50}
          showCount={true}
        />

        {/* ===== 이미지 섹션 ===== */}
        <div className={styles.imgSection}>
          <p className={styles.imgLabel}>이미지 관리</p>

          {/* --- 대표 이미지 --- */}
          <div className={styles.imgGroup}>
            <span className={styles.imgTag}>대표</span>

            {/* 기존 대표 이미지 */}
            {existingMainImg && (
              <div className={styles.imgItem}>
                <img src={`/upload/${existingMainImg.uploadFileName}`} alt='대표이미지' />
                <button
                  type='button'
                  className={styles.imgDeleteBtn}
                  onClick={() => handleImgDeleteMark(existingMainImg.imgNum)}
                >
                  <IoCloseCircle />
                </button>
              </div>
            )}

            {/* 새 대표 이미지 미리보기 */}
            {newMainImgPreview && (
              <div className={styles.imgItem}>
                <img src={newMainImgPreview} alt='새 대표이미지' />
                <button
                  type='button'
                  className={styles.imgDeleteBtn}
                  onClick={handleNewMainImgRemove}
                >
                  <IoCloseCircle />
                </button>
              </div>
            )}

            {/* 대표 이미지가 없을 때만 업로드 input 노출 */}
            {!existingMainImg && !newMainImgPreview && (
              <Input
                type='file'
                name='newMainImg'
                onChange={handleNewMainImgChange}
                accept='image/*'
              />
            )}
          </div>

          {/* --- 서브 이미지 --- */}
          <div className={styles.imgGroup}>
            <span className={styles.imgTag}>서브</span>

            <div className={styles.imgList}>
              {/* 기존 서브 이미지 */}
              {existingSubImgs.map(img => (
                <div key={img.imgNum} className={styles.imgItem}>
                  <img src={`/upload/${img.uploadFileName}`} alt='서브이미지' />
                  <button
                    type='button'
                    className={styles.imgDeleteBtn}
                    onClick={() => handleImgDeleteMark(img.imgNum)}
                  >
                    <IoCloseCircle />
                  </button>
                </div>
              ))}

              {/* 새 서브 이미지 미리보기 */}
              {newSubImgPreviews.map((url, index) => (
                <div key={index} className={styles.imgItem}>
                  <img src={url} alt={`새 서브이미지 ${index + 1}`} />
                  <button
                    type='button'
                    className={styles.imgDeleteBtn}
                    onClick={() => handleNewSubImgRemove(index)}
                  >
                    <IoCloseCircle />
                  </button>
                </div>
              ))}
            </div>

            {/* 서브 이미지 추가 input */}
            <Input
              type='file'
              name='newSubImgs'
              onChange={handleNewSubImgsChange}
              multiple={true}
              accept='image/*'
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles.buttonGroup}>
          <Button
            onClick={() => navigate('/manage/book-edit')}
            variant='secondary'
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant='primary'
            disabled={loading}
          >
            {loading ? '저장 중...' : '수정 완료'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ManageBookEdit