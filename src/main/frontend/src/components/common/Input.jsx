import React from 'react'
import styles from './Input.module.css'
import Button from './Button'

const Input = ({ 
  label, 
  type = "text", 
  name,
  placeholder, 
  value,
  onChange,
  maxLength,
  button,
  onButtonClick,
  className,
  readOnly = false,
  ...props
}) => {
  return (
    <div className={`${styles.input_group} ${className || ''}`}>
      {label && <label>{label}</label>}
      {button ? (
        <div className={styles.input_with_button}>
          <input 
            type={type}
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            maxLength={maxLength}
            readOnly={readOnly}
            {...props}
          />
          <Button onClick={onButtonClick} variant='primary'>
            {button}
          </Button>
        </div>
      ) : (
        <input 
          type={type}
          name={name}
          placeholder={type === 'date' ? undefined : placeholder}
          value={value || ''}
          onChange={onChange}
          readOnly={readOnly}
          onClick={(e) => {
            if (type === 'date') {
              e.target.showPicker?.();
            }
          }}
          {...props}
        />
      )}
    </div>
  )
}

export default Input