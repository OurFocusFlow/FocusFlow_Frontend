import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styles from './Login.module.css'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const location = useLocation()

  // Check for success message from location state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      if (location.state?.email) {
        setForm(prev => ({ ...prev, email: location.state.email }))
      }
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call to authenticate user
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Sign in with', form, 'remember:', remember)
      
      // Store user session
      localStorage.setItem('authToken', 'demo-token-123456')
      localStorage.setItem('userEmail', form.email)
      localStorage.setItem('userName', form.email.split('@')[0]) // Use email prefix as name
      
      // Navigate to dashboard
      navigate('/home')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Link to="/Home" className={styles.floatButton}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Home
      </Link>
      <div className={styles.blobTopLeft} />
      <div className={styles.blobBottomRight} />

      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 9h13a3 3 0 0 1 0 6h-1" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 9v7a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 6c0-1 1-1 1-2M11 6c0-1 1-1 1-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <h1 className={styles.brandName}>BrewTask</h1>
        </div>
        <p className={styles.tagline}>Enter your sanctuary of productivity.</p>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        {successMessage && (
          <div className={styles.successMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#059669" strokeWidth="2" />
              <path d="M8 12l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {successMessage}
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#e74c3c" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email address</label>
          <div className={styles.inputWrap}>
            <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="password">Password</label>
            <Link to="/forgot-password" className={styles.forgotLink}>Forgot?</Link>
          </div>
          <div className={styles.inputWrap}>
            <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className={styles.checkbox}
          />
          <label htmlFor="remember">Remember me for 30 days</label>
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className={styles.spinner} />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className={styles.divider}>
          <span />
          <p>or continue with</p>
          <span />
        </div>

        <div className={styles.oauthRow}>
          <button type="button" className={styles.oauthButton}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.87z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.3v3.09A12 12 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.3a12 12 0 0 0 0 10.76z" />
              <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.3 6.62l3.97 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
            </svg>
            Google
          </button>
          <button type="button" className={styles.oauthButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.365 1.43c0 1.14-.462 2.24-1.216 3.03-.83.87-2.15 1.53-3.24 1.44-.15-1.1.42-2.26 1.19-3.02.83-.85 2.28-1.5 3.27-1.45zM20.6 17.24c-.53 1.22-.78 1.77-1.46 2.85-.95 1.5-2.29 3.37-3.95 3.39-1.47.02-1.85-.96-3.85-.95-2 .01-2.42.97-3.9.95-1.66-.02-2.93-1.71-3.88-3.2-2.68-4.2-2.96-9.13-1.31-11.75 1.17-1.87 3.02-2.97 4.76-2.97 1.77 0 2.89.98 4.35.98 1.42 0 2.29-.98 4.35-.98 1.55 0 3.2.85 4.37 2.31-3.84 2.11-3.22 7.61.52 9.37z" />
            </svg>
            Apple
          </button>
        </div>
      </form>

      <div className={styles.footer}>
        <p className={styles.signupPrompt}>
          Don&apos;t have an account? <Link to="/signup" className={styles.signupLink}>Start your free trial</Link>
        </p>
        <p className={styles.copyright}>© 2024 BrewTask. Crafted for focused minds.</p>
      </div>
    </div>
  )
}