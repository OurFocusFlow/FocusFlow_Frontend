import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../ForgetPassword/ForgetPassword.module.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // In the handleSubmit function, replace the setIsSubmitted(true) with:

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to verification page with email
    navigate('/verify', { state: { email } });
  } catch (err) {
    setError('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={styles.page}>
      <div className={styles.blobTopLeft} />
      <div className={styles.blobBottomRight} />

      <Link to="/login" className={styles.backButton}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Login
      </Link>

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
        <p className={styles.tagline}>Reset your password</p>
      </div>

      <div className={styles.card}>
        {!isSubmitted ? (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Forgot Password?</h2>
              <p className={styles.cardSubtext}>
                Enter your email address and we'll send you a verification code to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner} />
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>

            <div className={styles.footer}>
              <p className={styles.loginPrompt}>
                Remember your password? <Link to="/login" className={styles.loginLink}>Log in here</Link>
              </p>
            </div>
          </>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#4a3427" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="#4a3427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Check your email</h2>
            <p className={styles.successText}>
              We've sent a password reset verification code to <strong>{email}</strong>.
              <br />
              Please check your inbox and follow the instructions.
            </p>
            <button 
              className={styles.resendButton}
              onClick={() => {
                setIsSubmitted(false)
                setEmail('')
              }}
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}