import axiosInstance from './axiosInstance';

// 주문 등록
export const createBuy = async (buyData) => {
  try {
    const response = await axiosInstance.post('./buy-list', buyData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '구매에 실패했습니다.' }
  }
}

// 내 주문 목록 조회
export const getBuyList = async () => {
  try {
    const response = await axiosInstance.get('./buy-list')
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '구매 목록 조회를 실패했습니다.' }
  }
}

// 내 주문 단건 조회
export const getBuyByNum = async (buyNum) => {
  try {
    const response = await axiosInstance.get(`./buy-list/${buyNum}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '구매 상세 조회를 실패했습니다.' }
  }
}