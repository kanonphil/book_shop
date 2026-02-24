import React, { useCallback, useEffect, useState } from 'react'
import { getStockList, restockBook, updateStock } from '../../api/stockApi'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { IoAddCircleOutline, IoSearchOutline, IoWarningOutline } from 'react-icons/io5'
import styles from './ManageStock.module.css'

const ManageStock = () => {
  // 재고 목록 처리 데이터
  const [stocks, setStocks] = useState([])

  // 검색어
  const [keyword, setKeyword] = useState('')

  // 재고 부족 필터 (true면 stock <= 5만 표시)
  const [lowStockOnly, setLowStockOnly]= useState(false)

  // 현재 인라인 수정 중인 행의 bookNum (null이면 수정 중 없음)
  const [editingId, setEditingId] = useState(null)

  // 수정 중인 input의 값
  const [editValue, setEditValue] = useState('')

  // 입고 모달 관련
  const [restockModal, setRestockModal] = useState(null)  // null or { bookNum, bookTitle }
  const [restockValue, setRestockValue] = useState('')

  const [loading, setLoading] = useState(false)
  
  const fetchStocks = useCallback(async (kw = keyword, low = lowStockOnly) => {
    setLoading(true)
    try {
      const response = await getStockList(kw, low)
      console.log('응답 데이터:', response)
      setStocks(response.data)
    } catch (error) {
      alert('재고 목록 조회에 실패했습니다.')
    } finally {
      // finally는 성공/실패 상관없이 항상 실행
      setLoading(false)
    }
  }, [keyword, lowStockOnly])
  
  // 컴포넌트가 처음 렌더링 될 때 목록 불러오기
  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])
  
  // 검색 실행
  const handleSearch = () => {
    fetchStocks(keyword, lowStockOnly)
  }

  // 재고부족 필터링 토글
  const handleLowStockToggle = () => {
    const newValue = !lowStockOnly
    setLowStockOnly(newValue)
    fetchStocks(keyword, newValue)
    // 왜 state를 바로 쓰지 않냐면, setState는 비동기라 바로 반영이 안 됨.
    // 새 값을 변수로 들고 API에 직접 넘겨줘야 함.
  }

  // 인라인 수정 시작 - 행을 클릭했을 때
  const handleEditStart = (bookNum, currentStock) => {
    setEditingId(bookNum)
    setEditValue(String(currentStock))
    // String() 변환 이유: input의 value는 문자열이어야 함.
  }

  // 인라인 수정 완료 - Enter 또는 포커스 아웃 시
  const handleEditSave = async (bookNum) => {
    // bookNum이 없으면 즉시 종료
    if (!bookNum) return

    const quantity = Number(editValue)

    if (isNaN(quantity) || quantity < 0) {
      alert('올바른 수량을 입력해주세요.')
      setEditingId(null)
      return
    }

    try {
      await updateStock(bookNum, quantity)
      // API 성공 후 화면 데이터도 업데이트
      // 전체 재조회 대신 해당 항목만 바꾸는게 효율적
      setStocks(prev =>
        prev.map(s => 
          s.bookNum === bookNum 
            ? { ...s, bookStock: quantity } 
            : s
        )
      )
      setEditingId(null)
    } catch (error) {
      alert('재고 수정에 실패했습니다.')
    }
  }

  // 입고 처리
  const handleRestock = async () => {
    const addQty = Number(restockValue)

    if (isNaN(addQty) || addQty <= 0) {
      alert('1 이상의 수량을 입력해주세요')
      return
    }

    try {
      await restockBook(restockModal.bookNum, addQty)
      setStocks(prev =>
        prev.map(s =>
          s.bookNum === restockModal.bookNum
            ? { ...s, bookStock: s.bookStock + addQty }
            : s
        )
      )
      setRestockModal(null)
      setRestockValue('')
    } catch (error) {
      alert('입고 처리에 실패했습니다.')
    }
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>재고 관리</h2>
      
      {/* 필터 바 */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Input 
            name='keyword'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='도서명 검색'
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            variant='primary'
            size='medium'
          >
            <IoSearchOutline /> 검색
          </Button>
        </div>
        <Button
          onClick={handleLowStockToggle}
          variant={lowStockOnly ? 'secondary' : 'danger'}
          size='medium'
        >
          <IoWarningOutline /> {lowStockOnly ? '전체 보기' : '재고 부족'}
        </Button>
      </div>

      {/* 테이블 */}
      {loading ? (
        <p className={styles.loading}>로딩 중...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>도서명</th>
              <th>저자</th>
              <th>가격</th>
              <th>재고</th>
              <th>입고</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr 
                key={stock.bookNum} 
                className={
                  stock.bookStock === 0 
                    ? styles.lowStock 
                    : stock.bookStock <= 5
                      ? styles.lowWarningStock
                      : ''
              }>
                <td>{stock.bookNum}</td>
                <td>{stock.bookTitle}</td>
                <td>{stock.author}</td>
                <td>{stock.bookPrice?.toLocaleString()}원</td>
                <td
                  className={styles.stockCell}
                  onClick={() => handleEditStart(stock.bookNum, stock.bookStock)}
                >
                  {/* editingId가 이 행의 bookNum과 같으면 input 표시, 아니면 텍스트 */}
                  {editingId === stock.bookNum ? (
                    <input 
                      className={styles.inlineInput}
                      type="number" 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(stock.bookNum)
                        if (e.key === 'Escape') setEditingId(null)  // 취소
                      }}
                      onBlur={() => {
                        if (editingId === stock.bookNum) {
                          handleEditSave(stock.bookNum)
                        }
                      }}
                      autoFocus  // 클릭하면 자동으로 포커스
                      min={0}
                    />
                  ) : (
                    <span className={
                      stock.bookStock === 0 
                        ? styles.lowBadge 
                        : stock.bookStock <= 5
                          ? styles.lowWarningBadge
                          : ''
                    }>
                      {stock.bookStock}
                    </span>
                  )}
                </td>
                <td>
                  <Button
                    onClick={() => {
                      setRestockModal({ bookNum: stock.bookNum, bookTitle: stock.booktitle })
                      setRestockValue('')
                    }}
                    variant='primary'
                    size='small'
                  >
                    <IoAddCircleOutline /> 입고
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 입고 모달 */}
      {restockModal && (
        <div className={styles.modalOverlay} onClick={() => setRestockModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* e.stopPropagation(): 모달 안 클릭이 overlay까지 전파되지 않도록 막음 */}
            <h3>입고 처리</h3>
            <p className={styles.modalBookTitle}>{restockModal.bookTitle}</p>
            <Input
              label='추가 수량'
              type='text'
              name='restockValue'
              value={restockValue}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '')
                setRestockValue(val)
              }}
              placeholder='추가할 수량 입력'
              onKeyDown={(e) => e.key === 'Enter' && handleRestock()}
            />
            <div className={styles.modalButtons}>
              <Button onClick={handleRestock} variant='primary'>입고 처리</Button>
              <Button onClick={() => setRestockModal(null)} variant='secondary'>취소</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageStock