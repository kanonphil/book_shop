import React from 'react'

// Web Storage(cookie, localStorage, sessionStorage)
// 문자열 데이터만 저장 가능
const WebStorage = () => {
  // Local Storage에 데이터 저장
  localStorage.setItem('local-name', 'kim')
  localStorage.setItem('local-age', '20')

  // Session Storage에 데이터 저장
  sessionStorage.setItem('session-name', 'lee')
  sessionStorage.setItem('session-age', '30')
  
  return (
    <div>WebStorage</div>
  )
}

export default WebStorage