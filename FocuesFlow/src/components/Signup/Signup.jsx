import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Signup.module.css'

export default function Signup() {
  const [agree, setAgree] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    // Validate terms agreement
    if (!agree) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to create account
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Create account with', form, 'agree:', agree)
      
      // Navigate to login page with success message
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please sign in.',
          email: form.email 
        } 
      })
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Link to="/login" className={styles.floatButton}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Login
      </Link>

      <div className={styles.blobTopLeft} />

      <div className={styles.layout}>
        <div className={styles.promo}>
          <span className={styles.badge}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M4 9h13a3 3 0 0 1 0 6h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 9v7a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Premium Focus
          </span>

          <h1 className={styles.headline}>Brew Your Most Productive Self.</h1>

          <p className={styles.subtext}>
            Join 50,000+ professionals using BrewTask to cultivate deep focus and master their daily rituals.
          </p>

          <div className={styles.proofRow}>
            <div className={styles.testimonialCard}>
              <div className={styles.avatars}>
                <span className={styles.avatar} style={{ background: '#f3ece2' }} />
                <span className={styles.avatar} style={{ background: '#cfc6bb' }} />
                <span className={styles.avatar} style={{ background: '#e8d9c4' }} />
              </div>
              <p className={styles.quote}>&quot;The only task manager that actually feels calm.&quot;</p>
            </div>

            <div className={styles.ratingCard}>
              <p className={styles.ratingScore}>4.9/5</p>
              <p className={styles.ratingLabel}>App Store Rating</p>
            </div>
          </div>
        </div>

        <form className={styles.card} onSubmit={handleSubmit}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Create Account</h2>
            <p className={styles.cardSubtext}>Start your journey toward intentional productivity today.</p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Full name</label>
            <div className={styles.inputWrap}>
              <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M4 20c0-4 3.58-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Elias Thorne"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
                placeholder="elias@brewtask.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirmPassword">Confirm</label>
              <div className={styles.inputWrap}>
                <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <span
              className={`${styles.customCheckbox} ${agree ? styles.checked : ''}`}
              onClick={() => setAgree((a) => !a)}
              role="checkbox"
              aria-checked={agree}
              tabIndex={0}
            />
            <span>
              I agree to the <Link to="/terms" className={styles.inlineLink}>Terms of Service</Link> and{' '}
              <Link to="/privacy" className={styles.inlineLink}>Privacy Policy</Link>.
            </span>
          </label>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Creating Account...
              </>
            ) : (
              <>
                Begin My Ritual
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>

          <div className={styles.divider}>
            <span />
            <p>or join with</p>
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

          <p className={styles.loginPrompt}>
            Already part of the community? <Link to="/login" className={styles.loginLink}>Log in here</Link>
          </p>
        </form>
      </div>
    </div>
  )
}