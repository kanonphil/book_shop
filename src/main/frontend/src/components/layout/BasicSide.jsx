import styles from './BasicSide.module.css'
import { useNavigate } from 'react-router-dom'
import { IoCartOutline, IoPersonOutline, IoReceiptOutline } from 'react-icons/io5'

const BasicSide = () => {
  const navigate = useNavigate()
  
  return (
    <div className={styles.container}>
      <div className={styles.menu_section}>
        <ul className={styles.menu}>
          <li onClick={() => navigate('/mypage/cart')}><IoCartOutline /> 장바구니</li>
          <li onClick={() => navigate('/mypage/buy-list')}><IoReceiptOutline /> 구매내역</li>
          <li onClick={() => navigate('/mypage/profile-edit')}><IoPersonOutline /> 내정보수정</li>
        </ul>
      </div>
    </div>
  )
}

export default BasicSide