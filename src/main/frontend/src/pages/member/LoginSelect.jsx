import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginSelect.module.css'
import Button from '../../components/common/Button'
import Form from '../../components/common/Form'
import { SiKakao, SiNaver } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";

const LoginSelect = () => {
  const navigate = useNavigate()

  return (
    <Form 
      title='책과 함께하는 시간'
      subtitle='다양한 도서 구매부터 리뷰까지 당신의 독서 생활을 더 풍요롭게'
    >
      {/* SNS 로그인 버튼들 */}
      <div className={styles.snsButtons}>
        {/* <a href="http://localhost:8080/oauth2/authorization/kakao">
          <Button variant='kakao' fullWidth={true}>
            <SiKakao /> 카카오 계정으로 계속하기
          </Button>
        </a> */}

        <a href="http://localhost:8080/oauth2/authorization/google">
          <Button variant='google' fullWidth={true}>
            <FcGoogle /> 구글 계정으로 계속하기
          </Button>
        </a>

        <a href="http://localhost:8080/oauth2/authorization/naver">
          <Button variant='naver' fullWidth={true}>
            <SiNaver /> 네이버 계정으로 계속하기
          </Button>
        </a>

        <Button 
          variant='email' 
          fullWidth={true}
          onClick={() => navigate('/login')}
        >
          이메일로 계속하기
        </Button>
      </div>

      {/* 회원가입 링크 */}
      <div className={styles.footer}>
        <span>계정이 없으신가요? </span>
        <span className={styles.link} onClick={() => navigate('/join')}>
          회원가입
        </span>
      </div>
    </Form>
  )
}

export default LoginSelect