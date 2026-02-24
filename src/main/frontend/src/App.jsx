import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BasicLayout from './components/layout/BasicLayout'
import ManagerLayout from './components/layout/ManagerLayout'
import Join from './pages/member/Join'
import './reset.css'
import BookList from './pages/book/BookList'
import Login from './pages/member/Login'
import LoginSelect from './pages/member/LoginSelect'
import OAuthCallback from './pages/member/OAuthCallback'
import BookForm from './pages/manage/BookForm'
import BookDetail from './pages/book/BookDetail'
import CartList from './pages/cart/CartList'
import BuyList from './pages/buy/BuyList'
import OrderPage from './pages/buy/OrderPage'
import ManageStock from './pages/manage/ManageStock'
import ManageBookList from './pages/manage/ManageBookList'
import ManageBookEdit from './pages/manage/ManageBookEdit'
import MyPageLayout from './components/layout/MyPageLayout'
import ProfileEdit from './pages/member/ProfileEdit'
import PasswordCheck from './pages/member/PasswordCheck'

function App() {
  

  return (
    <>
      <Routes>

        {/* Route를 아래와 같이 중복으로 사용하면 두 컴포넌트를 함께 띄울 수 있음 */}
        {/* 컴포넌트에 접근하는 url은 바깥 Route와 안쪽 Route의 path로로 나열하여 지정 */}
        {/* 단, 안쪽 Route의 path 속성값은 '/'를 붙이지 않는다. */}
        {/* 바깥 컴포넌트에 <Outlet /> 컴포넌트를 사용하여 함께 열리는 컴포넌트의 위치를 지정한다. */}

        {/* 일반 회원이 접근하는 페이지들 */}
        <Route path='/' element={<BasicLayout />}>
          <Route index element={<BookList />} />
          <Route path='join' element={<Join />} />
          <Route path='login' element={<Login />} />
          <Route path='books/:bookNum' element={<BookDetail />} />
          <Route path='carts' element={<CartList />} />
          <Route path='buy-list' element={<BuyList />} />
          <Route path='order' element={<OrderPage />} />
          {/* <Route path='login-select' element={<LoginSelect />} /> */}
          {/* <Route path='oauth-callback' element={<OAuthCallback />} /> */}
        </Route>

        {/* 마이페이지 */}
        <Route path='/mypage' element={<MyPageLayout />}>
          <Route index element={<CartList />} />
          <Route path='buy-list' element={<BuyList />} />
          <Route path='profile-edit' element={<PasswordCheck />} />
          <Route path='profile-edit/form' element={<ProfileEdit />} />
        </Route>

        {/* 매니저 권한의 회원이 접근하는 페이지들 */}
        <Route path='/manage' element={<ManagerLayout />}>
          <Route path='book-form' element={<BookForm />} />
          <Route path='stock' element={<ManageStock />} />
          <Route path='book-edit' element={<ManageBookList />} />
          <Route path='book-edit/:bookNum' element={<ManageBookEdit />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
