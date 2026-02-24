import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMemberInfo, updateMember, deleteMember, logout } from '../../api/memberApi'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import TelInput from '../../components/common/TelInput'
import AddressInput from '../../components/common/AddressInput'
import styles from './ProfileEdit.module.css'
import { logoutReducer } from '../../redux/authSlice'

const ProfileEdit = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { member } = useSelector(state => state.auth)

  const { state } = useLocation()

  const [formData, setFormData] = useState({
    memTel1: '010',
    memTel2: '',
    memTel3: '',
    memAddr: '',
    addrDetail: '',
    memPw: '',
    memPwConfirm: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // 비밀번호 확인 없이 직접 접근하면 차단
  useEffect(() => {
    if (!state?.verified) {
      navigate('/mypage/profile-edit')
    }
  }, [])

  // 기존 회원 정보 불러오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const data = await getMemberInfo(member.memEmail)
        // "010-1234-5678" → ["010", "1234", "5678"]
        const telParts = data.memTel?.split('-') || ['010', '', '']
        setFormData(prev => ({
          ...prev,
          memTel1: telParts[0] || '010',
          memTel2: telParts[1] || '',
          memTel3: telParts[2] || '',
          memAddr: data.memAddr || '',
          addrDetail: data.addrDetail || ''
        }))
      } catch (error) {
        alert('회원 정보를 불러오는데 실패했습니다.')
      }
    }
    if (member?.memEmail) fetchMemberInfo()
  }, [member])

  const handleTelChange = (tel1, tel2, tel3) => {
    setFormData(prev => ({ ...prev, memTel1: tel1, memTel2: tel2, memTel3: tel3 }))
  }

  const handleAddressChange = (addr, detail) => {
    setFormData(prev => ({ ...prev, memAddr: addr, addrDetail: detail }))
  }

  // 수정 저장
  const handleSubmit = async () => {
    if (!formData.memTel2 || !formData.memTel3) {
      alert('전화번호를 입력해주세요.')
      return
    }

    if (!formData.memAddr) {
      alert('주소를 입력해주세요.')
      return
    }
    
    if (formData.memPw && formData.memPw !== formData.memPwConfirm) {
      setErrors(prev => ({ ...prev, memPwConfirm: '비밀번호가 일치하지 않습니다.' }))
      return
    }

    setLoading(true)
    try {
      await updateMember(member.memEmail, {
        memTel: `${formData.memTel1}-${formData.memTel2}-${formData.memTel3}`,
        memAddr: formData.memAddr,
        addrDetail: formData.addrDetail,
        memPw: formData.memPw || null
      })
      alert('회원 정보가 수정되었습니다.')
    } catch (error) {
      alert(error.message || '수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 회원 탈퇴
  const handleDeleteMember = async () => {
    const memPw = prompt('회원 탈퇴를 위해 비밀번호를 입력해주세요.')
    if (!memPw) return

    const confirmed = confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    if (!confirmed) return

    setLoading(true)
    try {
      await deleteMember(member.memEmail, memPw)
      alert('회원 탈퇴가 완료되었습니다.')
      logout()
      // Redux store 초기화
      dispatch(logoutReducer())
      navigate('/')
    } catch (error) {
      alert(error.message || '탈퇴에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내 정보 수정</h2>

      <div className={styles.formWrap}>
        {/* 수정 불가 */}
        <Input
          label='Email'
          value={member?.memEmail || ''}
          readOnly
          disabled
        />
        <Input
          label='Name'
          value={member?.memName || ''}
          readOnly
          disabled
        />

        {/* 전화번호 */}
        <TelInput
          label='Tel'
          name='memTel'
          value1={formData.memTel1}
          value2={formData.memTel2}
          value3={formData.memTel3}
          onChange={handleTelChange}
        />

        {/* 주소 */}
        <AddressInput
          label='Address'
          name='memAddr'
          addrValue={formData.memAddr}
          detailValue={formData.addrDetail}
          onChange={handleAddressChange}
        />

        {/* 비밀번호 변경 */}
        <div className={styles.divider}>
          <span>비밀번호 변경 (선택)</span>
        </div>

        <Input
          label='New Password'
          type='password'
          name='memPw'
          value={formData.memPw}
          onChange={(e) => setFormData(prev => ({ ...prev, memPw: e.target.value }))}
          placeholder='변경할 비밀번호 (변경 없으면 비워두세요)'
        />
        <Input
          label='Confirm Password'
          type='password'
          name='memPwConfirm'
          value={formData.memPwConfirm}
          onChange={(e) => setFormData(prev => ({ ...prev, memPwConfirm: e.target.value }))}
          placeholder='비밀번호 확인'
          error={errors.memPwConfirm}
        />

        {/* 버튼 */}
        <div className={styles.buttonGroup}>
          <Button
            variant='outline'
            onClick={handleDeleteMember}
            disabled={loading}
          >
            회원 탈퇴
          </Button>
          <Button
            variant='primary'
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileEdit