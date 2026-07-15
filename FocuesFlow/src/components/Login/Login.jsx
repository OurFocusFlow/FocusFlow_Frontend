import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
  Stack,
  Fade,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      console.log('Login attempt with:', { email, password });
      // Navigate to dashboard after successful login
      navigate('/');
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const handleNavigateToSignup = () => {
    navigate('/signup');
  };

  const handleNavigateToForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Box className={styles.pageContainer}>
      {!isMobile && (
        <>
          <div className={styles.bgBlob1} />
          <div className={styles.bgBlob2} />
          <div className={styles.bgBlob3} />
        </>
      )}
      
      <Container 
        maxWidth={isMobile ? false : "sm"} 
        className={styles.container}
        disableGutters={isMobile}
      >
        <Fade in timeout={800}>
          <Paper elevation={0} className={`${styles.paper} ${isMobile ? styles.paperMobile : ''} ${isTablet ? styles.paperTablet : ''}`}>
            {isDesktop && (
              <Box className={styles.topBar}>
                <span className={styles.barDot} />
                <span className={styles.barDot} />
                <span className={styles.barDot} />
              </Box>
            )}

            <Box className={`${styles.header} ${isMobile ? styles.headerMobile : ''}`}>
              <Box className={`${styles.logoWrapper} ${isMobile ? styles.logoWrapperMobile : ''}`}>
                <Box className={styles.logoIcon}>
                  <svg width={isMobile ? "28" : "32"} height={isMobile ? "28" : "32"} viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="8" fill="url(#gradient)" />
                    <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </svg>
                </Box>
                <Typography variant={isMobile ? "h5" : "h4"} component="h1" className={styles.title}>
                  FocusFlow
                </Typography>
              </Box>
              <Typography variant={isMobile ? "body2" : "body1"} className={styles.subtitle}>
                Your workspace for disciplined performance.
              </Typography>
            </Box>

            <form onSubmit={handleLogin} className={`${styles.form} ${isMobile ? styles.formMobile : ''}`}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                placeholder="name@company.com"
                variant="outlined"
                className={styles.inputField}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon className={styles.inputIcon} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                  className: styles.inputLabel,
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                variant="outlined"
                className={styles.inputField}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className={styles.inputIcon} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size={isMobile ? "small" : "medium"}
                        className={styles.passwordToggle}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                  className: styles.inputLabel,
                }}
              />

              <Box className={styles.forgotPasswordWrapper}>
                <span 
                  className={`${styles.forgotPassword} ${isMobile ? styles.forgotPasswordMobile : ''}`}
                  onClick={handleNavigateToForgotPassword}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleNavigateToForgotPassword();
                    }
                  }}
                >
                  Forgot password?
                </span>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size={isMobile ? "medium" : "large"}
                disabled={isLoading}
                className={`${styles.loginButton} ${isMobile ? styles.loginButtonMobile : ''}`}
                endIcon={!isLoading && <ArrowForwardIcon />}
              >
                {isLoading ? (
                  <CircularProgress size={isMobile ? 20 : 24} color="inherit" />
                ) : (
                  'Login to Workspace'
                )}
              </Button>

              <Box className={styles.dividerWrapper}>
                <Divider className={styles.divider}>
                  <Typography variant="caption" className={styles.dividerText}>
                    or continue with
                  </Typography>
                </Divider>
              </Box>

              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={isMobile ? 1.5 : 2} 
                className={styles.socialButtons}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialLogin('Google')}
                  className={`${styles.socialButton} ${isMobile ? styles.socialButtonMobile : ''}`}
                  size={isMobile ? "medium" : "large"}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={() => handleSocialLogin('GitHub')}
                  className={`${styles.socialButton} ${isMobile ? styles.socialButtonMobile : ''}`}
                  size={isMobile ? "medium" : "large"}
                >
                  GitHub
                </Button>
              </Stack>

              <Box className={styles.signupWrapper}>
                <Typography variant="body2" className={`${styles.signupText} ${isMobile ? styles.signupTextMobile : ''}`}>
                  Don't have an account?{' '}
                  <span 
                    className={`${styles.signupLink} ${isMobile ? styles.signupLinkMobile : ''}`}
                    onClick={handleNavigateToSignup}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleNavigateToSignup();
                      }
                    }}
                  >
                    Sign up for free
                  </span>
                </Typography>
              </Box>
            </form>

            {isDesktop && (
              <Box className={styles.bottomBar}>
                <span className={styles.barLine} />
                <span className={styles.barLine} />
                <span className={styles.barLine} />
              </Box>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;