import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <Provider store={store}>
      {/* <AuthProvider> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      {/* </AuthProvider> */}
    </Provider>
  </ThemeProvider>
  
)
