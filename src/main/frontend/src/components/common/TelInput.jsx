import React from 'react'
import styles from './TelInput.module.css'

const TelInput = ({ label, value1 = '010', value2 = '', value3 = '', onChange }) => {
  const handleChange = (index) => (e) => {
    const values = [value1, value2, value3]
    values[index] = e.target.value
    
    if (onChange) {
      onChange(values[0], values[1], values[2])
    }
  }

  return (
    <div className={styles.input_group}>
      {label && <label>{label}</label>}
      <div className={styles.tel_group}>
        <input 
          type="text" 
          maxLength="3" 
          value={value1}
          onChange={handleChange(0)}
        />
        <input 
          type="text" 
          maxLength="4"
          value={value2}
          onChange={handleChange(1)}
        />
        <input 
          type="text" 
          maxLength="4"
          value={value3}
          onChange={handleChange(2)}
        />
      </div>
    </div>
  )
}

export default TelInput