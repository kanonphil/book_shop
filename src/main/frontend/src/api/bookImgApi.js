import axiosInstance from "./axiosInstance";

// 이미지 삭제
export const deleteBookImg = async (bookNum, imgNum) => {
  try {
    const response = await axiosInstance.delete(`/books/${bookNum}/images/${imgNum}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '이미지 삭제에 실패했습니다.' }
  }
}

// 이미지 추가
export const addBookImgs = async (bookNum, mainImg, subImgs) => {
  try {
    const formData = new FormData()
    if (mainImg) formData.append('mainImg', mainImg)
    if (subImgs?.lenght > 0) {
      subImgs.forEach(img => formData.append('subImgs', img))
    }
    const response = await axiosInstance.post(`/books/${bookNum}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: '이미지 추가에 실패했습니다.' }
  }
}