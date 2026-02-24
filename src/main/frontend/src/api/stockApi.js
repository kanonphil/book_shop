import axiosInstance from "./axiosInstance";

// 재고 목록 조회
// keyword: 검색어, lowStockOnly: 재고부족만 볼지 여부
export const getStockList = async (keyword = '', lowStockOnly = false) => {
  try {
    const response = await axiosInstance.get('/books/stock', {
      params: { keyword, lowStockOnly }
    })

    return response.data
  } catch (error) {
    throw error.response?.data || { message: '재고 목록 조회에 실패했습니다.' }
  }
}

// 재고 직접 수정 (인라인 수정)
// quantity: 새로 설정할 수량 (덮어쓰기)
export const updateStock = async (bookNum, quantity) => {
  try {
    const response = await axiosInstance.patch(`/books/stock/${bookNum}`, null, {
      params: { quantity }
    })

    return response.data
  } catch (error) {
    throw error.response?.data || { message: '재고 수정에 실패했습니다.' }
  }
}

// 입고 처리 (현재 수량에 더하기)
// addQuantity: 추가할 수량
export const restockBook = async (bookNum, addQuantity) => {
  try {
    const response = await axiosInstance.post(`/books/restock/${bookNum}`, null, {
      params: { addQuantity }
    })

    return response.data
  } catch (error) {
    throw error.response?.data || { message: '입고 처리에 실패했습니다.' }
  }
}