import React from 'react'
import styles from './Input.module.css'

const Input = ({ 
  label, 
  type = "text", 
  placeholder, 
  defaultValue,
  maxLength,
  button,
  onButtonClick
}) => {
  return (
    <div className={styles.input_group}>
      {label && <label>{label}</label>}
      {button ? (
        <div className={styles.input_with_button}>
          <input 
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            maxLength={maxLength}
          />
          <button type="button" onClick={onButtonClick}>
            {button}
          </button>
        </div>
      ) : (
        <input 
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          maxLength={maxLength}
        />
      )}
    </div>
  )
}

export default Input