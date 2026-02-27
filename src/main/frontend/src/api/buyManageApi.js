import axiosInstance from "./axiosInstance";

// 전체 구매내역 조회
export const getBuyHistory = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/manage/buy/history', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '구매내역 조회에 실패했습니다.' }
  }
}

// 월별 매출 조회
export const getMonthlySales = async (year) => {
  try {
    const response = await axiosInstance.get('/manage/buy/monthly', { params: { year } })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '월별 매출 조회에 실패했습니다.' }
  }
}

// 주간 매출 조회
export const getWeeklySales = async (year, month) => {
  try {
    const response = await axiosInstance.get('/manage/buy/weekly', { params: { year, month } })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '주간 매출 조회에 실패했습니다.' }
  }
}