import { useState, FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/LoginPage.css'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({ username: false, password: false })

  const validateUsername = (value: string) => {
    if (!value.trim()) return 'Username is required'
    if (value.length < 3) return 'Min 3 characters'
    return ''
  }

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required'
    if (value.length < 4) return 'Min 4 characters'
    return ''
  }

  const usernameError = touched.username ? validateUsername(username) : ''
  const passwordError = touched.password ? validatePassword(password) : ''
  const isFormValid = !validateUsername(username) && !validatePassword(password)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ username: true, password: true })

    if (!isFormValid) return

    setIsLoading(true)
    setError('')

    const result = await login(username, password)

    if (result.success) {
      navigate('/pokemon/list')
    } else {
      setError(result.error || 'Login failed')
    }

    setIsLoading(false)
  }

  return (
    <>
      <Helmet>
        <title>Login - Pokédex</title>
        <meta name="description" content="Login to access the Pokédex" />
      </Helmet>

      <div className="login-page">
        <div className="login-card">
          {/* Visual side - Desktop only */}
          <div className="login-visual">
            <div className="login-visual-content">
              <div className="pokeball-visual">
                <div className="center-circle"></div>
              </div>
              <h2>Pokédex</h2>
              <p>Gotta Catch 'Em All!</p>
            </div>
          </div>

          {/* Form side */}
          <div className="login-form-section">
            {/* Mobile brand */}
            <div className="mobile-brand">
              <div className="mobile-pokeball"></div>
              <h1>Pokédex</h1>
              <p>Gotta Catch 'Em All!</p>
            </div>

            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to continue</p>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-alert">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className={`input-group ${usernameError ? 'error' : ''}`}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  placeholder="Enter username"
                  disabled={isLoading}
                />
                {usernameError && <span className="error-text">{usernameError}</span>}
              </div>

              <div className={`input-group ${passwordError ? 'error' : ''}`}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="Enter password"
                  disabled={isLoading}
                />
                {passwordError && <span className="error-text">{passwordError}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="demo-hint">
              <span>Demo:</span> admin / admin
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
