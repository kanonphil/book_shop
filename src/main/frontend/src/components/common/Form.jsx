import React from 'react'
import styles from './Form.module.css'

const Form = ({
  children,
  title,
  onSubmit
}) => {
  return (
    <div className={styles.form_container}>
      {title && <h2 className={styles.form_title}>{title}</h2>}
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  )
}

export default Form