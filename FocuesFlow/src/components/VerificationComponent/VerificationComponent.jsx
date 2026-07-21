import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../Context/DarkModeContext';
import styles from '../VerificationComponent/VerificationComponent.module.css';

export default function Verification() {
  const { isDarkMode } = useDarkMode();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state (passed from ForgotPassword)
  const email = location.state?.email || 'your email';

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [code]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^[0-9]$/.test(value) && value !== '') return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.replace(/\D/g, '').split('');

    if (digits.length > 0) {
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (i < 6) newCode[i] = digit;
      });
      setCode(newCode);

      // Focus the next empty input or the last one
      const nextIndex = Math.min(digits.length, 5);
      if (nextIndex < 6) {
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  const handleSubmit = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo: accept any 6-digit code
      // In real app, you'd verify against backend
      if (verificationCode === '123456') {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/reset-password', { state: { email } });
        }, 2000);
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(30);
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message or toast
    } catch (err) {
      // Handle error
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
          <p className={`${styles.tagline} ${isDarkMode ? styles.darkTagline : ''}`}>Verification successful</p>
        </div>

        <div className={`${styles.card} ${isDarkMode ? styles.darkCard : ''}`}>
          <div className={`${styles.successContainer} ${isDarkMode ? styles.darkSuccessContainer : ''}`}>
            <div className={`${styles.successIcon} ${isDarkMode ? styles.darkSuccessIcon : ''}`}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#4a3427" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="#4a3427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={`${styles.successTitle} ${isDarkMode ? styles.darkSuccessTitle : ''}`}>Verification Successful!</h2>
            <p className={`${styles.successText} ${isDarkMode ? styles.darkSuccessText : ''}`}>
              Your code has been verified.
              <br />
              Redirecting you to reset your password...
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
        <p className={`${styles.tagline} ${isDarkMode ? styles.darkTagline : ''}`}>Enter verification code</p>
      </div>

      <div className={`${styles.card} ${isDarkMode ? styles.darkCard : ''}`}>
        <div className={styles.cardHeader}>
          <h2 className={`${styles.cardTitle} ${isDarkMode ? styles.darkCardTitle : ''}`}>Verify Your Email</h2>
          <p className={`${styles.cardSubtext} ${isDarkMode ? styles.darkCardSubtext : ''}`}>
            We've sent a verification code to <strong>{email}</strong>.
            <br />
            Please enter the 6-digit code below.
          </p>
        </div>

        {/* 6-digit code inputs */}
        <div className={`${styles.codeContainer} ${isDarkMode ? styles.darkCodeContainer : ''}`}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              autoFocus={index === 0}
              disabled={isLoading}
              className={`${styles.codeInput} ${isDarkMode ? styles.darkCodeInput : ''}`}
            />
          ))}
        </div>

        {error && <div className={`${styles.errorMessage} ${isDarkMode ? styles.darkErrorMessage : ''}`}>{error}</div>}

        <button
          className={`${styles.submitButton} ${isDarkMode ? styles.darkSubmitButton : ''}`}
          onClick={handleSubmit}
          disabled={isLoading || code.some(digit => digit === '')}
        >
          {isLoading ? (
            <>
              <span className={`${styles.spinner} ${isDarkMode ? styles.darkSpinner : ''}`} />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </button>

        <div className={`${styles.footer} ${isDarkMode ? styles.darkFooter : ''}`}>
          <p className={`${styles.loginPrompt} ${isDarkMode ? styles.darkLoginPrompt : ''}`}>
            Didn't receive the code?{' '}
            <button
              className={`${styles.resendButton} ${isDarkMode ? styles.darkResendButton : ''}`}
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </p>
        </div>

        <div className={`${styles.footer} ${isDarkMode ? styles.darkFooter : ''}`}>
          <p className={`${styles.loginPrompt} ${isDarkMode ? styles.darkLoginPrompt : ''}`}>
            Remember your password? <Link to="/login" className={`${styles.loginLink} ${isDarkMode ? styles.darkLoginLink : ''}`}>Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}