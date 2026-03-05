import axiosInstance from "./axiosInstance";

// 대시보드 전체 데이터 조회 (통계 + 차트 + 랭킹)
export const getDashboard = async () => {
  try {
    const response = await axiosInstance.get('/manage/dashboard')
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '대시보드 조회에 실패했습니다.' }
  }
}