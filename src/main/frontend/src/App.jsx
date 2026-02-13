import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BasicLayout from './components/layout/BasicLayout'
import ManagerLayout from './components/layout/ManagerLayout'
import Join from './pages/member/Join'
import './reset.css'
import BookList from './pages/book/BookList'
import Login from './pages/member/Login'
import LoginSelect from './pages/member/LoginSelect'
import OAuthCallback from './pages/member/OAuthCallback'
import BookForm from './pages/book/BookForm'
import BookDetail from './pages/book/BookDetail'
import CartList from './pages/cart/CartList'

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
          <Route path='' element={<BookList />} />
          <Route path='join' element={<Join />} />
          <Route path='login' element={<Login />} />
          <Route path='books/:bookNum' element={<BookDetail />} />
          <Route path='carts' element={<CartList />} />
          {/* <Route path='login-select' element={<LoginSelect />} /> */}
          {/* <Route path='oauth-callback' element={<OAuthCallback />} /> */}
        </Route>

        {/* 매니저 권한의 회원이 접근하는 페이지들 */}
        <Route path='/manage' element={<ManagerLayout />}>
          <Route path='book-form' element={<BookForm />} />
          <Route />
        </Route>
      </Routes>
    </>
  )
}

export default App
