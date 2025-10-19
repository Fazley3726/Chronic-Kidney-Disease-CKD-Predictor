import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_USER = { phone: '01627884903', password: 'admin' }

function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [error, setError] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    // Check default credentials first
    if (phone === DEFAULT_USER.phone && password === DEFAULT_USER.password) {
      localStorage.setItem('kd_current_user', JSON.stringify({ phone, name: 'Admin' }))
      window.dispatchEvent(new Event('kd-auth-change'))
      navigate('/predict')
      return
    }
    // Check registered users
    const users = JSON.parse(localStorage.getItem('kd_users') || '[]')
    const found = users.find((u) => u.phone === phone && u.password === password)
    if (found) {
      localStorage.setItem('kd_current_user', JSON.stringify({ phone: found.phone, name: found.name }))
      window.dispatchEvent(new Event('kd-auth-change'))
      navigate('/predict')
    } else {
      setError('Invalid phone or password')
    }
  }

  function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim() || !password) {
      setError('All fields are required')
      return
    }
    const users = JSON.parse(localStorage.getItem('kd_users') || '[]')
    if (users.some((u) => u.phone === phone)) {
      setError('Phone already registered')
      return
    }
    users.push({ name: name.trim(), phone: phone.trim(), password })
    localStorage.setItem('kd_users', JSON.stringify(users))
    localStorage.setItem('kd_current_user', JSON.stringify({ phone: phone.trim(), name: name.trim() }))
    window.dispatchEvent(new Event('kd-auth-change'))
    navigate('/predict')
  }

  return (
    <div className="kd-container">
      <div className="kd-card" style={{ maxWidth: 480 }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 12px' }}>{mode === 'login' ? 'LOG IN' : 'Sign Up'}</h2>
        {error && <p className="kd-error">{error}</p>}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="kd-form-grid">
            <div className="kd-form-item" style={{ gridColumn: '1 / -1' }}>
              <label className="kd-label" htmlFor="phone">Phone Number</label>
              <input id="phone" className="kd-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Number" required />
            </div>
            <div className="kd-form-item" style={{ gridColumn: '1 / -1' }}>
              <label className="kd-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="kd-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
            <div className="kd-form-item" style={{ gridColumn: '1 / -1', marginTop: -8 }}>
              <p className="kd-info" style={{ margin: 0 }}>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
                >
                   Don't have an account?{' '}
                </button>
              </p>
            </div>
            <div className="kd-actions">
              <button className="kd-button" type="submit" style={{ padding: '0 36px' }}>Login</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="kd-form-grid">
            <div className="kd-form-item" style={{ gridColumn: '1 / -1' }}>
              <label className="kd-label" htmlFor="name">Full Name</label>
              <input id="name" className="kd-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required />
            </div>
            <div className="kd-form-item" style={{ gridColumn: '1 / -1' }}>
              <label className="kd-label" htmlFor="phone2">Phone Number</label>
              <input id="phone2" className="kd-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 01XXXXXXXXX" required />
            </div>
            <div className="kd-form-item" style={{ gridColumn: '1 / -1' }}>
              <label className="kd-label" htmlFor="password2">Password</label>
              <input id="password2" type="password" className="kd-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
            </div>
            <div className="kd-form-item" style={{ gridColumn: '1 / -1', marginTop: -8 }}>
              <p className="kd-info" style={{ margin: 0 }}>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
                >
                   Already have an account?{' '}
                </button>
              </p>
            </div>
            <div className="kd-actions">
              <button className="kd-button" type="submit">Create Account</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login


