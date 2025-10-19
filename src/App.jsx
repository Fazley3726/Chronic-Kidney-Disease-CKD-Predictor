import { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Predictor from './pages/Predictor.jsx'
import Login from './pages/Login.jsx'
import History from './pages/History.jsx'
import Home from './pages/Home.jsx'
import './App.css'

function RequireAuth({ children }) {
  const isAuthed = Boolean(localStorage.getItem('kd_current_user'))
  return isAuthed ? children : <Navigate to="/login" replace />
}

function HomeRedirect() {
  const isAuthed = Boolean(localStorage.getItem('kd_current_user'))
  return <Navigate to={isAuthed ? '/predict' : '/'} replace />
}

function LogoutButton() {
  const navigate = useNavigate()
  function handleLogout() {
    localStorage.removeItem('kd_current_user')
    window.dispatchEvent(new Event('kd-auth-change'))
    navigate('/login', { replace: true })
  }
  return (
    <button className="kd-button kd-logout" onClick={handleLogout}>Logout</button>
  )
}

function App() {
  const [isAuthed, setIsAuthed] = useState(Boolean(localStorage.getItem('kd_current_user')))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => {
    const update = () => setIsAuthed(Boolean(localStorage.getItem('kd_current_user')))
    window.addEventListener('storage', update)
    window.addEventListener('kd-auth-change', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('kd-auth-change', update)
    }
  }, [])
  useEffect(() => { setIsMenuOpen(false) }, [location.pathname, isAuthed])
  return (
    <>
      <nav className="kd-nav">
        <div className="kd-nav-inner">
          <Link to="/" className="kd-brand">CKD Predictor</Link>
          <button className="kd-hamburger" aria-label="Toggle menu" onClick={() => setIsMenuOpen((v) => !v)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`kd-nav-links ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/">Home</Link>
            <Link to="/predict">Predict</Link>
            <Link to="/history">History</Link>
            {isAuthed ? (
              <LogoutButton />
            ) : (
              <Link to="/login" className="kd-button kd-logout" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Login</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="kd-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/predict" element={<RequireAuth><Predictor /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <footer className="kd-footer">
        <div className="kd-footer-inner">© {new Date().getFullYear()} CKD Predictor </div>
      </footer>
    </>
  )
}

export default App
