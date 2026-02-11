import axios from './axios'

export const memberApi = {
  checkEmail: (email) => {
    return axios.get(`/members/check-email/${email}`)
  },

  join: (data) => {
    return axios.post('/members/join', data)
  },

  login: (data) => {
    return axios.post('/members/login', data)
  }
}

// 또는 개별 export 유지
export const checkEmail = (email) => 
  axios.get(`/members/check-email/${email}`)

export const joinMember = (data) => 
  axios.post('/members/join', data)

export const loginMember = (data) => 
  axios.post('/members/login', data)