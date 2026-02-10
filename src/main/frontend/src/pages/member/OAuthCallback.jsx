import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const OAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const email = searchParams.get('email')
    const name = decodeURIComponent(searchParams.get('name'))
    const role = searchParams.get('role')

    if (email && name) {
      // AuthContext에 로그인 정보 저장
      login({
        memEmail: email,
        memName: name,
        memRole: role
      })

      alert(`환영합니다, ${name}님!`)
      navigate('/', { replace: true })  // replace: true 추가
    } else {
      navigate('/login-select', { replace: true })
    }
  }, []) // 의존성 배열 비우기

  return <div>로그인 중...</div>
}

export default OAuthCallback