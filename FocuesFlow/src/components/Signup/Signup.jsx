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
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

const Signup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'agreeTerms' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Account created successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signing up with ${provider}`);
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleNavigateToTerms = () => {
    navigate('/terms');
  };

  const handleNavigateToPrivacy = () => {
    navigate('/privacy');
  };

  return (
    <Box className={styles.pageContainer}>
      <div className={styles.bgBlob1} />
      <div className={styles.bgBlob2} />
      <div className={styles.bgBlob3} />
      
      <Container maxWidth="xs" className={styles.container}>
        <Fade in timeout={600}>
          <Paper elevation={0} className={styles.paper}>
            <Box className={styles.topBar}>
              <span className={styles.barDot} />
              <span className={styles.barDot} />
              <span className={styles.barDot} />
            </Box>

            <Box className={styles.header}>
              <Box className={styles.logoWrapper}>
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
                <Typography variant="h5" component="h1" className={styles.title}>
                  FocusFlow
                </Typography>
              </Box>
              <Typography variant="body2" className={styles.subtitle}>
                Create your account
              </Typography>
            </Box>

            {successMessage && (
              <Alert 
                icon={<CheckCircleIcon />} 
                severity="success" 
                className={styles.successAlert}
                onClose={() => setSuccessMessage('')}
              >
                {successMessage}
              </Alert>
            )}

            {errors.submit && (
              <Alert 
                severity="error" 
                className={styles.errorAlert}
                onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}
              >
                {errors.submit}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                placeholder="John Doe"
                variant="outlined"
                size="small"
                className={styles.inputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon className={styles.inputIcon} />
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
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="name@company.com"
                variant="outlined"
                size="small"
                className={styles.inputField}
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
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                size="small"
                className={styles.inputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className={styles.inputIcon} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
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

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                variant="outlined"
                size="small"
                className={styles.inputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className={styles.inputIcon} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                        className={styles.passwordToggle}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                  className: styles.inputLabel,
                }}
              />

              <Box className={styles.termsWrapper}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className={styles.termsCheckbox}
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: '#667eea',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" className={styles.termsLabel}>
                      I agree to the{' '}
                      <span 
                        className={styles.termsLink}
                        onClick={handleNavigateToTerms}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleNavigateToTerms();
                          }
                        }}
                      >
                        Terms
                      </span>
                      {' '}&{' '}
                      <span 
                        className={styles.termsLink}
                        onClick={handleNavigateToPrivacy}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleNavigateToPrivacy();
                          }
                        }}
                      >
                        Privacy Policy
                      </span>
                    </Typography>
                  }
                />
                {errors.agreeTerms && (
                  <Typography variant="caption" className={styles.termsError}>
                    {errors.agreeTerms}
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="medium"
                disabled={isLoading}
                className={styles.signupButton}
                endIcon={!isLoading && <ArrowForwardIcon />}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Box className={styles.dividerWrapper}>
                <Divider className={styles.divider}>
                  <Typography variant="caption" className={styles.dividerText}>
                    or
                  </Typography>
                </Divider>
              </Box>

              <Stack direction="row" spacing={1.5} className={styles.socialButtons}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialSignup('Google')}
                  size="small"
                  className={styles.socialButton}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={() => handleSocialSignup('GitHub')}
                  size="small"
                  className={styles.socialButton}
                >
                  GitHub
                </Button>
              </Stack>

              <Box className={styles.signinWrapper}>
                <Typography variant="body2" className={styles.signinText}>
                  Already have an account?{' '}
                  <span 
                    className={styles.signinLink}
                    onClick={handleNavigateToLogin}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleNavigateToLogin();
                      }
                    }}
                  >
                    Sign in
                  </span>
                </Typography>
              </Box>

              <Box className={styles.trialInfo}>
                <Typography variant="caption" className={styles.trialText}>
                  Free 14-day trial. No credit card required.
                </Typography>
              </Box>
            </form>

            <Box className={styles.bottomBar}>
              <span className={styles.barLine} />
              <span className={styles.barLine} />
              <span className={styles.barLine} />
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Signup;