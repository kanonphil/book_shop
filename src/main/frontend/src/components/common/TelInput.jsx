import React from 'react'
import styles from './TelInput.module.css'

const TelInput = ({ label }) => {
  return (
    <div className={styles.input_group}>
      {label && <label>{label}</label>}
      <div className={styles.tel_group}>
        <input type="text" maxLength="3" defaultValue="010" />
        <input type="text" maxLength="4" />
        <input type="text" maxLength="4" />
      </div>
    </div>
  )
}

export default TelInput