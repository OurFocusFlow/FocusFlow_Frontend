import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../Context/DarkModeContext';
import styles from '../ResetPassword/ResetPassword.module.css';

export default function ResetPassword() {
  const { isDarkMode } = useDarkMode();
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state (passed from Verification)
  const email = location.state?.email || 'your email';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`${styles.page} ${isDarkMode ? styles.darkPage : ''}`}>
        <div className={`${styles.blobTopLeft} ${isDarkMode ? styles.darkBlobTopLeft : ''}`} />
        <div className={`${styles.blobBottomRight} ${isDarkMode ? styles.darkBlobBottomRight : ''}`} />

        <Link to="/login" className={`${styles.backButton} ${isDarkMode ? styles.darkBackButton : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Login
        </Link>

        <div className={`${styles.header} ${isDarkMode ? styles.darkHeader : ''}`}>
          <div className={`${styles.brand} ${isDarkMode ? styles.darkBrand : ''}`}>
            <span className={`${styles.logoMark} ${isDarkMode ? styles.darkLogoMark : ''}`}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 9h13a3 3 0 0 1 0 6h-1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 9v7a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 6c0-1 1-1 1-2M11 6c0-1 1-1 1-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <h1 className={`${styles.brandName} ${isDarkMode ? styles.darkBrandName : ''}`}>BrewTask</h1>
          </div>
          <p className={`${styles.tagline} ${isDarkMode ? styles.darkTagline : ''}`}>Password reset successful</p>
        </div>

        <div className={`${styles.card} ${isDarkMode ? styles.darkCard : ''}`}>
          <div className={`${styles.successContainer} ${isDarkMode ? styles.darkSuccessContainer : ''}`}>
            <div className={`${styles.successIcon} ${isDarkMode ? styles.darkSuccessIcon : ''}`}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#4a3427" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="#4a3427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={`${styles.successTitle} ${isDarkMode ? styles.darkSuccessTitle : ''}`}>Password Reset Successful!</h2>
            <p className={`${styles.successText} ${isDarkMode ? styles.darkSuccessText : ''}`}>
              Your password has been successfully reset.
              <br />
              Redirecting you to login...
            </p>
            <div className={`${styles.spinner} ${isDarkMode ? styles.darkSpinner : ''}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} ${isDarkMode ? styles.darkPage : ''}`}>
      <div className={`${styles.blobTopLeft} ${isDarkMode ? styles.darkBlobTopLeft : ''}`} />
      <div className={`${styles.blobBottomRight} ${isDarkMode ? styles.darkBlobBottomRight : ''}`} />

      <Link to="/forgot-password" className={`${styles.backButton} ${isDarkMode ? styles.darkBackButton : ''}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      <div className={`${styles.header} ${isDarkMode ? styles.darkHeader : ''}`}>
        <div className={`${styles.brand} ${isDarkMode ? styles.darkBrand : ''}`}>
          <span className={`${styles.logoMark} ${isDarkMode ? styles.darkLogoMark : ''}`}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 9h13a3 3 0 0 1 0 6h-1" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 9v7a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 6c0-1 1-1 1-2M11 6c0-1 1-1 1-2" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <h1 className={`${styles.brandName} ${isDarkMode ? styles.darkBrandName : ''}`}>BrewTask</h1>
        </div>
        <p className={`${styles.tagline} ${isDarkMode ? styles.darkTagline : ''}`}>Create a new password</p>
      </div>

      <div className={`${styles.card} ${isDarkMode ? styles.darkCard : ''}`}>
        <div className={styles.cardHeader}>
          <h2 className={`${styles.cardTitle} ${isDarkMode ? styles.darkCardTitle : ''}`}>Reset Password</h2>
          <p className={`${styles.cardSubtext} ${isDarkMode ? styles.darkCardSubtext : ''}`}>
            Create a new password for your account.
            <br />
            <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`${styles.form} ${isDarkMode ? styles.darkForm : ''}`}>
          <div className={`${styles.field} ${isDarkMode ? styles.darkField : ''}`}>
            <label className={`${styles.label} ${isDarkMode ? styles.darkLabel : ''}`} htmlFor="newPassword">New Password</label>
            <div className={`${styles.inputWrap} ${isDarkMode ? styles.darkInputWrap : ''}`}>
              <svg className={`${styles.icon} ${isDarkMode ? styles.darkIcon : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.newPassword}
                onChange={handleChange}
                required
                className={isDarkMode ? styles.darkInput : ''}
              />
              <button
                type="button"
                className={`${styles.eyeButton} ${isDarkMode ? styles.darkEyeButton : ''}`}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`${styles.field} ${isDarkMode ? styles.darkField : ''}`}>
            <label className={`${styles.label} ${isDarkMode ? styles.darkLabel : ''}`} htmlFor="confirmPassword">Confirm New Password</label>
            <div className={`${styles.inputWrap} ${isDarkMode ? styles.darkInputWrap : ''}`}>
              <svg className={`${styles.icon} ${isDarkMode ? styles.darkIcon : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={isDarkMode ? styles.darkInput : ''}
              />
              <button
                type="button"
                className={`${styles.eyeButton} ${isDarkMode ? styles.darkEyeButton : ''}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          {error && <div className={`${styles.errorMessage} ${isDarkMode ? styles.darkErrorMessage : ''}`}>{error}</div>}

          <button type="submit" className={`${styles.submitButton} ${isDarkMode ? styles.darkSubmitButton : ''}`} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={`${styles.spinner} ${isDarkMode ? styles.darkSpinner : ''}`} />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className={`${styles.footer} ${isDarkMode ? styles.darkFooter : ''}`}>
            <p className={`${styles.loginPrompt} ${isDarkMode ? styles.darkLoginPrompt : ''}`}>
              Remember your password? <Link to="/login" className={`${styles.loginLink} ${isDarkMode ? styles.darkLoginLink : ''}`}>Log in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}