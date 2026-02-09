import axios from './axios'

export const checkEmail = (email) => {
  return axios.get(`/members/check-email/${email}`)
}

export const joinMember = (data) => {
  return axios.post('/members/join', data)
}

export const loginMember = (data) => {
  return axios.post('/members/login', data)
}
