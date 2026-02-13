import axiosInstance from './axiosInstance'

// 장바구니 목록 조회
export const getCartList = async () => {
  try {
    const response = await axiosInstance.get('/carts')
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '장바구니 조회에 실패했습니다.' }
  }
}

// 장바구니 추가
export const addToCart = async (bookNum, cartCnt) => {
  try {
    const response = await axiosInstance.post('/carts', {
      bookNum,
      cartCnt
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '장바구니 추가에 실패했습니다.' }
  }
}

// 수량 변경
export const updateCartCnt = async (cartNum, cartCnt) => {
  try {
    const response = await axiosInstance.put(`/carts/${cartNum}`, {
      cartCnt
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '수량 변경에 실패했습니다.' }
  }
}

// 단일 삭제
export const deleteCart = async (cartNum) => {
  try {
    const response = await axiosInstance.delete(`/carts/${cartNum}`)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: '삭제에 실패했습니다.' }
  }
}

// 선택 삭제
export const deleteCartList = async (cartNumList) => {
  try {
    const response = await axiosInstance.delete('/carts', {
      data: {cartNumList}
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '선택 삭제에 실패했습니다.' }
  }
}