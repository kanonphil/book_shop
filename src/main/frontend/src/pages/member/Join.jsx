import React from 'react'
import styles from './Join.module.css'

const Join = () => {
  return (
    <div className={styles.container}>
      {/* Email */}
      <div className={styles.input_group}>
        <label>Email</label>
        <div className={styles.input_with_button}>
          <input type="text" placeholder='이메일을 입력하세요' />
          <button type="button">중복확인</button>
        </div>
      </div>

      {/* Password */}
      <div className={styles.input_group}>
        <label>Password</label>
        <input type="text" placeholder='비밀번호를 입력하세요' />
      </div>

      {/* Confirm Password */}
      <div className={styles.input_group}>
        <label>Confirm Password</label>
        <input type="text" placeholder='비밀번호를 다시 입력하세요' />
      </div>

      {/* Name */}
      <div className={styles.input_group}>
        <label>Name</label>
        <input type="text" placeholder='이름을 입력하세요' />
      </div>

      {/* Tel */}
      <div className={styles.input_group}>
        <label>Tel</label>
        <div className={styles.tel_group}>
          <input type="text" maxLength="3" placeholder='010' />
          <input type="text" maxLength="4" placeholder='0000' />
          <input type="text" maxLength="4" placeholder='0000' />
        </div>
      </div>

      {/* Address */}
      <div className={styles.input_group}>
        <label>Address</label>
        <div className={styles.input_with_button}>
          <input type="text" placeholder="우편번호" />
          <button>검색</button>
        </div>
        <input type="text" placeholder="상세주소" className={styles.full_input} />
      </div>

      {/* Submit Button */}
      <div className={styles.button_group}>
        <button className={styles.submit_button}>회원가입</button>
      </div>
    </div>
  )
}

export default Join