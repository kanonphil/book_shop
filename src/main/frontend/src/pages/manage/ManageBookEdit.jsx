import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookDetail, updateBook } from '../../api/bookApi'
import { getCategories } from '../../api/categoryApi'
import { addBookImgs, deleteBookImg } from '../../api/bookImgApi'
import styles from './ManageBookEdit.module.css'
import Select from '../../components/common/Select'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import { IoCloseCircle } from 'react-icons/io5'
import Button from '../../components/common/Button'

const ManageBookEdit = () => {
  const { bookNum } = useParams()
  // useParams()는 URL의 :bookNum 부분을 꺼내주는 Hook
  // /manage/book-edit/5로 접속하면 bookNum="5"
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

  // 기본 이미지 (DB에서 불러온 것)
  const [existingImgs, setExistingImgs] = useState([])
  // 삭제 할 이미지 번호 등록 (저장 버튼 누를 때 한꺼번에 삭제)
  const [deleteImgNums, setDeleteImgNums] = useState([])
  // 새로 추가할 이미지 파일
  const [newImgs, setNewImgs] = useState([])
  // 새 이미지 미리보기 URL
  const [newImgPreviews, setNewImgPreviews] = useState([])

  const [loading, setLoading] = useState(false)

  // 도서 상세 + 카테고리 목록 불러오기
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Promise.all: 두 API를 동시에 호출
      // 순서대로 기다리면 시간이 두 배 걸리지만, 동시에 호출하면 더 빠르게 처리
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
  // 실제 삭제는 저장 버튼 누를 때
  // 미리 표시만 해두고 화면에서는 안 보이게 처리
  const handleImgDeleteMark = (imgNum) => {
    setDeleteImgNums(prev => [...prev, imgNum])
    // 화면에서도 바로 제거
    setExistingImgs(prev => prev.filter(img => img.imgNum !== imgNum))
  }

  // 새 이미지 파일 선택
  const handleNewImgChange = (e) => {
    const files = [...e.target.files]
    setNewImgs(prev => [...prev, ...files])

    // 이미보기 URL 생성
    // URL.createObjectURL: 파일을 브라우저 메모리에 임시 URL로 만듦
    // 실제 서버에 올라간 게 아니라 브라우저 내에서만 볼 수 있음
    const previews = files.map(file => URL.createObjectURL(file))
    setNewImgPreviews(prev => [...prev, ...previews])
  }

  // 새 이미지 추가 취소
  const handleNewImgRemove = (index) => {
    // 메모리 해제 - createObjectURL로 만든 URL은 쓰고 나면 해제해줘야 메모리 누수 방지
    URL.revokeObjectURL(newImgPreviews[index])

    setNewImgs(prev => prev.filter((_, i) => i !== index))
    setNewImgPreviews(prev => prev.filter((_, i) => i !== index))
    // filter의 (_, i)에서 _는 "값은 안 쓰고 인덱스만 씀" 관례적 표현
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

      // 2. 삭제 표시된 이미지 삭제 (Promise.all로 동시 처리)
      if (deleteImgNums.length > 0) {
        await Promise.all(
          deleteImgNums.map(imgNum => deleteBookImg(bookNum, imgNum))
        )
      }

      // 3. 새 이미지 추가
      if (newImgs.length > 0) {
        await addBookImgs(bookNum, null, newImgs)
        // 첫 번째 null은 mainImg 자리
        // 수정 시엔 대표이미지를 별도로 교체하지 않으므로 null로 전달
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

  // 이미지 분리
  const mainImg = existingImgs.find(img => img.isMain === 'Y')
  const subImgs = existingImgs.filter(img => img.isMain === 'N')
  
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

        {/* 이미지 섹션 */}
        <div className={styles.imgSection}>
          <p className={styles.imgLabel}>이미지 관리</p>

          {/* 대표 이미지 */}
          {mainImg && (
            <div className={styles.imgGroup}>
              <span className={styles.imgTag}>대표</span>
              <div className={styles.imgItem}>
                <img src={`/upload/${mainImg.uploadFileName}`} alt="대표이미지" />
                <button
                  type='button'
                  className={styles.imgDeleteBtn}
                  onClick={() => handleImgDeleteMark(mainImg.imgNum)}
                >
                  <IoCloseCircle />
                </button>
              </div>
            </div>
          )}

          {/* 서브 이미지 */}
          {subImgs.length > 0 && (
            <div className={styles.imgGroup}>
              <span className={styles.imgTag}>서브</span>
              <div className={styles.imgList}>
                {subImgs.map(img => (
                  <div key={img.imgNum} className={styles.imgItem}>
                    <img src={`/upload/${img.uploadFileName}`} alt='서브이미지' />
                    <button
                      className={styles.imgDeleteBtn}
                      onClick={() => handleImgDeleteMark(img.imgNum)}
                    >
                      <IoCloseCircle />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        
          {/* 새 이미지 미리보기 */}
          {newImgPreviews.length > 0 && (
            <div className={styles.imgGroup}>
              <span className={styles.imgTag}>추가</span>
              <div className={styles.imgList}>
                {newImgPreviews.map((url, index) => (
                  <div key={index} className={styles.imgItem}>
                    <img src={url} alt={`새이미지${index}`} />
                    <button
                      className={styles.imgDeleteBtn}
                      onClick={() => handleNewImgRemove(index)}
                    >
                      <IoCloseCircle />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 이미지 추가 */}
          <Input
            type='file'
            name='newImgs'
            onChange={handleNewImgChange}
            multiple={true}
          />
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