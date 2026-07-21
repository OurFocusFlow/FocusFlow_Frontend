import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../Context/DarkModeContext';
import { useAccentColor } from '../Context/AccentColorContext';
import styles from './Profile.module.css';

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '251, 188, 0';
};

// Helper function to check if accent color is the default amber
const isDefaultAmber = (hex) => {
  return hex && hex.toLowerCase() === '#fbbc00';
};

// ==================== CUSTOM SWITCH COMPONENT ====================
const CustomSwitch = ({ 
  checked, 
  onChange, 
  size = 'medium',
  disabled = false,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const switchSize = size === 'small' ? 'switchSmall' : size === 'large' ? 'switchLarge' : '';
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label className={`${styles.switch} ${switchSize}`}>
      <input
        type="checkbox"
        id={switchId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      />
      <span className={styles.switchSlider}></span>
    </label>
  );
};

// ==================== SWITCH WITH LABEL COMPONENT ====================
const SwitchWithLabel = ({ 
  checked, 
  onChange, 
  label,
  size = 'medium',
  disabled = false,
}) => {
  const switchId = `switch-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.switchWrapper}>
      <CustomSwitch
        id={switchId}
        checked={checked}
        onChange={onChange}
        size={size}
        disabled={disabled}
        aria-labelledby={`${switchId}-label`}
      />
      <span id={`${switchId}-label`} className={styles.switchLabel}>
        {label}
      </span>
    </div>
  );
};

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { accentColor } = useAccentColor();
  
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [userData, setUserData] = useState({
    fullName: 'Alex Rivera',
    email: 'alex@company.com',
    bio: 'Product Designer & Creative Director. Passionate about creating beautiful, functional experiences.',
    location: 'San Francisco, CA',
    company: 'BrewTask Inc.',
    role: 'Senior Product Designer',
    joinDate: 'January 2024',
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: isDarkMode,
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    language: 'English',
    timezone: 'America/Los_Angeles',
  });
  
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30 minutes',
    activeSessions: ['Chrome - Windows', 'Safari - MacBook', 'Chrome - Android'],
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [passwordErrors, setPasswordErrors] = useState({});

  // Determine if we should use accent color for elements
  const shouldUseAccent = isDarkMode && !isDefaultAmber(accentColor);
  
  // Get accent color RGB
  const accentRgb = hexToRgb(accentColor);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (name, value) => {
    if (name === 'darkMode') {
      toggleDarkMode();
      setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
      return;
    }
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      showSnackbar('Profile updated successfully!', 'success');
    }, 1500);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserData({
      fullName: 'Alex Rivera',
      email: 'alex@company.com',
      bio: 'Product Designer & Creative Director. Passionate about creating beautiful, functional experiences.',
      location: 'San Francisco, CA',
      company: 'BrewTask Inc.',
      role: 'Senior Product Designer',
      joinDate: 'January 2024',
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePassword()) {
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSnackbar('Password updated successfully!', 'success');
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
    showSnackbar('Account deletion initiated', 'error');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const stats = {
    tasksCompleted: 147,
    projects: 12,
    streak: 7,
    focusHours: 324,
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <Dialog
      open={showDeleteDialog}
      onClose={() => setShowDeleteDialog(false)}
      maxWidth="xs"
      fullWidth
      className={`${styles.deleteDialog} ${isDarkMode ? styles.darkDeleteDialog : ''}`}
      PaperProps={{
        className: `${styles.deleteDialogPaper} ${isDarkMode ? styles.darkDeleteDialogPaper : ''}`,
        style: shouldUseAccent ? {
          border: `1px solid rgba(${accentRgb}, 0.1)`,
          background: '#0D0D0D',
        } : undefined,
      }}
    >
      <Box className={`${styles.deleteDialogContent} ${isDarkMode ? styles.darkDeleteDialogContent : ''}`}>
        <Box className={`${styles.deleteDialogIconWrapper} ${isDarkMode ? styles.darkDeleteDialogIconWrapper : ''}`}>
          <WarningIcon className={`${styles.deleteDialogIcon} ${isDarkMode ? styles.darkDeleteDialogIcon : ''}`} />
        </Box>
        <Typography variant="h5" className={`${styles.deleteDialogTitle} ${isDarkMode ? styles.darkDeleteDialogTitle : ''}`}>
          Delete Account?
        </Typography>
        <Typography variant="body2" className={`${styles.deleteDialogText} ${isDarkMode ? styles.darkDeleteDialogText : ''}`}>
          This action cannot be undone. All your data, projects, and tasks will be permanently removed.
        </Typography>
        <Box className={styles.deleteDialogActions}>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            className={`${styles.deleteDialogCancel} ${isDarkMode ? styles.darkDeleteDialogCancel : ''}`}
            style={shouldUseAccent ? {
              borderColor: `rgba(${accentRgb}, 0.15)`,
              color: '#6A6255',
            } : undefined}
            onMouseEnter={(e) => {
              if (shouldUseAccent) {
                e.currentTarget.style.background = `rgba(${accentRgb}, 0.08)`;
                e.currentTarget.style.color = '#e9e9e9';
              }
            }}
            onMouseLeave={(e) => {
              if (shouldUseAccent) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6A6255';
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            className={`${styles.deleteDialogConfirm} ${isDarkMode ? styles.darkDeleteDialogConfirm : ''}`}
            startIcon={<DeleteIcon />}
          >
            Delete Account
          </Button>
        </Box>
      </Box>
    </Dialog>
  );

  return (
    <Box 
      className={`${styles.profileContainer} ${isDarkMode ? styles.darkProfileContainer : ""}`}
      style={{
        '--accent-color': accentColor,
        '--accent-rgb': accentRgb,
      }}
    >
      {/* Background */}
      <div className={`${styles.profileBg} ${isDarkMode ? styles.darkProfileBg : ''}`}>
        <div 
          className={styles.profileBgOrb}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.10) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={styles.profileBgOrb}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.06) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={styles.profileBgOrb}
          style={{
            background: shouldUseAccent ? `radial-gradient(circle, rgba(${accentRgb}, 0.04) 0%, rgba(${accentRgb}, 0) 70%)` : undefined,
          }}
        />
        <div 
          className={`${styles.profileBgGrid} ${isDarkMode ? styles.darkProfileBgGrid : ''}`}
          style={{
            backgroundImage: shouldUseAccent ? 
              `linear-gradient(rgba(${accentRgb}, 0.02) 1px, transparent 1px),
               linear-gradient(90deg, rgba(${accentRgb}, 0.02) 1px, transparent 1px)` : undefined,
          }}
        />
        <div 
          className={`${styles.profileBgGlow} ${isDarkMode ? styles.darkProfileBgGlow : ''}`}
          style={{
            background: shouldUseAccent ? 
              `radial-gradient(circle, rgba(${accentRgb}, 0.06) 0%, transparent 70%)` : undefined,
          }}
        />
      </div>

      <Container maxWidth="xl" className={styles.profileContent}>
        {/* Profile Header */}
        <Box className={`${styles.profileHeader} ${isDarkMode ? styles.darkProfileHeader : ''}`}>
          <Box className={styles.profileHeaderContent}>
            <Box className={styles.avatarSection}>
              <Box className={styles.avatarWrapper}>
                <Avatar 
                  className={`${styles.profileAvatar} ${isDarkMode ? styles.darkProfileAvatar : ''}`}
                  style={{
                    background: shouldUseAccent ? accentColor : undefined,
                    color: shouldUseAccent ? '#000000' : undefined,
                  }}
                >
                  {userData.fullName.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Tooltip title="Change Avatar" arrow>
                  <IconButton 
                    className={`${styles.avatarEditBtn} ${isDarkMode ? styles.darkAvatarEditBtn : ''}`} 
                    size="small"
                    style={{
                      color: shouldUseAccent ? accentColor : undefined,
                    }}
                  >
                    <PhotoCameraIcon className={`${styles.avatarEditIcon} ${isDarkMode ? styles.darkAvatarEditIcon : ''}`} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box className={styles.avatarInfo}>
                <Typography variant="h4" className={`${styles.profileName} ${isDarkMode ? styles.darkProfileName : ''}`}>
                  {userData.fullName}
                </Typography>
                <Typography variant="body2" className={`${styles.profileRole} ${isDarkMode ? styles.darkProfileRole : ''}`}>
                  {userData.role}
                </Typography>
                <Box className={styles.profileBadges}>
                  <Chip 
                    label="PRO ACCOUNT" 
                    size="small" 
                    className={`${styles.proChip} ${isDarkMode ? styles.darkProChip : ''}`}
                    icon={<CheckCircleIcon className={`${styles.chipIcon} ${isDarkMode ? styles.darkChipIcon : ''}`} />}
                    style={{
                      background: shouldUseAccent ? accentColor : undefined,
                      color: shouldUseAccent ? '#000000' : undefined,
                    }}
                  />
                  <Chip 
                    label="Active" 
                    size="small" 
                    className={`${styles.activeChip} ${isDarkMode ? styles.darkActiveChip : ''}`}
                  />
                </Box>
              </Box>
            </Box>
            <Box className={`${styles.quickStats} ${isDarkMode ? styles.darkQuickStats : ''}`}>
              {[
                { number: stats.tasksCompleted, label: 'Tasks Done' },
                { number: stats.projects, label: 'Projects' },
                { number: stats.streak, label: 'Day Streak' },
                { number: stats.focusHours, label: 'Focus Hours' },
              ].map((stat, index) => (
                <Box key={index} className={styles.quickStat}>
                  <span className={`${styles.quickStatNumber} ${isDarkMode ? styles.darkQuickStatNumber : ''}`}>{stat.number}</span>
                  <span className={`${styles.quickStatLabel} ${isDarkMode ? styles.darkQuickStatLabel : ''}`}>{stat.label}</span>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Paper className={`${styles.profilePaper} ${isDarkMode ? styles.darkProfilePaper : ''}`}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            className={`${styles.profileTabs} ${isDarkMode ? styles.darkProfileTabs : ''}`}
            TabIndicatorProps={{
              className: `${styles.tabIndicator} ${isDarkMode ? styles.darkTabIndicator : ''}`,
              style: {
                background: shouldUseAccent ? accentColor : undefined,
              },
            }}
          >
            <Tab 
              icon={<PersonIcon />} 
              label="Profile" 
              className={`${styles.profileTab} ${isDarkMode ? styles.darkProfileTab : ''}`}
              style={{
                color: shouldUseAccent ? accentColor : undefined,
              }}
            />
            <Tab 
              icon={<NotificationsIcon />} 
              label="Preferences" 
              className={`${styles.profileTab} ${isDarkMode ? styles.darkProfileTab : ''}`}
              style={{
                color: shouldUseAccent ? accentColor : undefined,
              }}
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Security" 
              className={`${styles.profileTab} ${isDarkMode ? styles.darkProfileTab : ''}`}
              style={{
                color: shouldUseAccent ? accentColor : undefined,
              }}
            />
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box className={`${styles.tabContent} ${isDarkMode ? styles.darkTabContent : ''}`}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6" className={`${styles.tabTitle} ${isDarkMode ? styles.darkTabTitle : ''}`}>
                  Personal Information
                </Typography>
                {!isEditing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    className={`${styles.editButton} ${isDarkMode ? styles.darkEditButton : ''}`}
                    style={{
                      color: shouldUseAccent ? accentColor : undefined,
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box className={styles.editActions}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      className={`${styles.cancelButton} ${isDarkMode ? styles.darkCancelButton : ''}`}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className={`${styles.saveButton} ${isDarkMode ? styles.darkSaveButton : ''}`}
                      style={{
                        background: shouldUseAccent ? accentColor : undefined,
                        color: shouldUseAccent ? '#000000' : undefined,
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Box>
              <Divider className={`${styles.tabDivider} ${isDarkMode ? styles.darkTabDivider : ''}`} />
              <Box className={styles.profileGrid}>
                {/* Left Column */}
                <Box className={styles.profileLeftColumn}>
                  <Box className={`${styles.avatarCard} ${isDarkMode ? styles.darkAvatarCard : ''}`}>
                    <Box className={styles.avatarCardContent}>
                      <Box className={styles.avatarCardAvatar}>
                        <Avatar 
                          className={`${styles.avatarCardImage} ${isDarkMode ? styles.darkAvatarCardImage : ''}`}
                          style={{
                            background: shouldUseAccent ? accentColor : undefined,
                            color: shouldUseAccent ? '#000000' : undefined,
                          }}
                        >
                          {userData.fullName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        {isEditing && (
                          <IconButton 
                            className={`${styles.avatarCardEdit} ${isDarkMode ? styles.darkAvatarCardEdit : ''}`} 
                            size="small"
                            style={{
                              color: shouldUseAccent ? accentColor : undefined,
                            }}
                          >
                            <PhotoCameraIcon className={`${styles.avatarCardEditIcon} ${isDarkMode ? styles.darkAvatarCardEditIcon : ''}`} />
                          </IconButton>
                        )}
                      </Box>
                      <Box className={styles.avatarCardInfo}>
                        <Typography variant="h6" className={`${styles.avatarCardName} ${isDarkMode ? styles.darkAvatarCardName : ''}`}>
                          {userData.fullName}
                        </Typography>
                        <Typography variant="body2" className={`${styles.avatarCardRole} ${isDarkMode ? styles.darkAvatarCardRole : ''}`}>
                          {userData.role}
                        </Typography>
                        <Box className={styles.avatarCardBadges}>
                          <Chip 
                            label="PRO" 
                            size="small" 
                            className={`${styles.avatarCardProChip} ${isDarkMode ? styles.darkAvatarCardProChip : ''}`}
                            icon={<CheckCircleIcon className={`${styles.avatarCardChipIcon} ${isDarkMode ? styles.darkAvatarCardChipIcon : ''}`} />}
                            style={{
                              background: shouldUseAccent ? accentColor : undefined,
                              color: shouldUseAccent ? '#000000' : undefined,
                            }}
                          />
                          <Chip 
                            label="Active" 
                            size="small" 
                            className={`${styles.avatarCardActiveChip} ${isDarkMode ? styles.darkAvatarCardActiveChip : ''}`}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box className={styles.statsGrid}>
                    <Box className={`${styles.statCard} ${isDarkMode ? styles.darkStatCard : ''}`}>
                      <Box className={`${styles.statCardIconWrapper} ${isDarkMode ? styles.darkStatCardIconWrapper : ''}`}>
                        <CheckCircleIcon className={`${styles.statCardIcon} ${isDarkMode ? styles.darkStatCardIcon : ''}`} />
                      </Box>
                      <Box className={styles.statCardInfo}>
                        <span className={`${styles.statCardNumber} ${isDarkMode ? styles.darkStatCardNumber : ''}`}>147</span>
                        <span className={`${styles.statCardLabel} ${isDarkMode ? styles.darkStatCardLabel : ''}`}>Tasks Done</span>
                      </Box>
                    </Box>
                    <Box className={`${styles.statCard} ${isDarkMode ? styles.darkStatCard : ''}`}>
                      <Box className={`${styles.statCardIconWrapper} ${isDarkMode ? styles.darkStatCardIconWrapper : ''}`}>
                        <PersonIcon className={`${styles.statCardIcon} ${isDarkMode ? styles.darkStatCardIcon : ''}`} />
                      </Box>
                      <Box className={styles.statCardInfo}>
                        <span className={`${styles.statCardNumber} ${isDarkMode ? styles.darkStatCardNumber : ''}`}>12</span>
                        <span className={`${styles.statCardLabel} ${isDarkMode ? styles.darkStatCardLabel : ''}`}>Projects</span>
                      </Box>
                    </Box>
                    <Box className={`${styles.statCard} ${isDarkMode ? styles.darkStatCard : ''}`}>
                      <Box className={`${styles.statCardIconWrapper} ${isDarkMode ? styles.darkStatCardIconWrapper : ''}`}>
                        <NotificationsIcon className={`${styles.statCardIcon} ${isDarkMode ? styles.darkStatCardIcon : ''}`} />
                      </Box>
                      <Box className={styles.statCardInfo}>
                        <span className={`${styles.statCardNumber} ${isDarkMode ? styles.darkStatCardNumber : ''}`}>7</span>
                        <span className={`${styles.statCardLabel} ${isDarkMode ? styles.darkStatCardLabel : ''}`}>Day Streak</span>
                      </Box>
                    </Box>
                    <Box className={`${styles.statCard} ${isDarkMode ? styles.darkStatCard : ''}`}>
                      <Box className={`${styles.statCardIconWrapper} ${isDarkMode ? styles.darkStatCardIconWrapper : ''}`}>
                        <LockIcon className={`${styles.statCardIcon} ${isDarkMode ? styles.darkStatCardIcon : ''}`} />
                      </Box>
                      <Box className={styles.statCardInfo}>
                        <span className={`${styles.statCardNumber} ${isDarkMode ? styles.darkStatCardNumber : ''}`}>324</span>
                        <span className={`${styles.statCardLabel} ${isDarkMode ? styles.darkStatCardLabel : ''}`}>Focus Hours</span>
                      </Box>
                    </Box>
                  </Box>
                  <Box className={`${styles.memberCard} ${isDarkMode ? styles.darkMemberCard : ''}`}>
                    <Box className={styles.memberCardContent}>
                      <Box className={`${styles.memberCardIconWrapper} ${isDarkMode ? styles.darkMemberCardIconWrapper : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </Box>
                      <Box>
                        <Typography variant="body2" className={`${styles.memberCardLabel} ${isDarkMode ? styles.darkMemberCardLabel : ''}`}>
                          Member since
                        </Typography>
                        <Typography variant="body1" className={`${styles.memberCardDate} ${isDarkMode ? styles.darkMemberCardDate : ''}`}>
                          {userData.joinDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Right Column - Form Fields */}
                <Box className={styles.profileRightColumn}>
                  <Box className={`${styles.formCard} ${isDarkMode ? styles.darkFormCard : ''}`}>
                    <Box className={`${styles.formCardHeader} ${isDarkMode ? styles.darkFormCardHeader : ''}`}>
                      <Typography variant="subtitle2" className={`${styles.formCardTitle} ${isDarkMode ? styles.darkFormCardTitle : ''}`}>
                        <PersonIcon className={`${styles.formCardIcon} ${isDarkMode ? styles.darkFormCardIcon : ''}`} />
                        Basic Information
                      </Typography>
                    </Box>
                    <Box className={`${styles.formCardContent} ${isDarkMode ? styles.darkFormCardContent : ''}`}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        size="medium"
                        className={`${styles.profileTextField} ${isDarkMode ? styles.darkProfileTextField : ''}`}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon className={`${styles.fieldIcon} ${isDarkMode ? styles.darkFieldIcon : ''}`} />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: `${styles.inputLabel} ${isDarkMode ? styles.darkInputLabel : ''}`,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        size="medium"
                        className={`${styles.profileTextField} ${isDarkMode ? styles.darkProfileTextField : ''}`}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon className={`${styles.fieldIcon} ${isDarkMode ? styles.darkFieldIcon : ''}`} />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: `${styles.inputLabel} ${isDarkMode ? styles.darkInputLabel : ''}`,
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className={`${styles.formCard} ${isDarkMode ? styles.darkFormCard : ''}`}>
                    <Box className={`${styles.formCardHeader} ${isDarkMode ? styles.darkFormCardHeader : ''}`}>
                      <Typography variant="subtitle2" className={`${styles.formCardTitle} ${isDarkMode ? styles.darkFormCardTitle : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <polyline points="9 12 11 14 15 10" />
                        </svg>
                        Additional Details
                      </Typography>
                    </Box>
                    <Box className={`${styles.formCardContent} ${isDarkMode ? styles.darkFormCardContent : ''}`}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        multiline
                        rows={3}
                        size="medium"
                        className={`${styles.profileTextField} ${isDarkMode ? styles.darkProfileTextField : ''}`}
                        placeholder="Tell us about yourself..."
                        InputLabelProps={{
                          shrink: true,
                          className: `${styles.inputLabel} ${isDarkMode ? styles.darkInputLabel : ''}`,
                        }}
                      />
                      <Box className={styles.formRow}>
                        <TextField
                          fullWidth
                          label="Location"
                          name="location"
                          value={userData.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          size="medium"
                          className={`${styles.profileTextField} ${isDarkMode ? styles.darkProfileTextField : ''}`}
                          InputLabelProps={{
                            shrink: true,
                            className: `${styles.inputLabel} ${isDarkMode ? styles.darkInputLabel : ''}`,
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Company"
                          name="company"
                          value={userData.company}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          size="medium"
                          className={`${styles.profileTextField} ${isDarkMode ? styles.darkProfileTextField : ''}`}
                          InputLabelProps={{
                            shrink: true,
                            className: `${styles.inputLabel} ${isDarkMode ? styles.darkInputLabel : ''}`,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Preferences Tab */}
          {activeTab === 1 && (
            <Box className={`${styles.tabContent} ${isDarkMode ? styles.darkTabContent : ''}`}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6" className={`${styles.tabTitle} ${isDarkMode ? styles.darkTabTitle : ''}`}>
                  Preferences
                </Typography>
              </Box>
              <Divider className={`${styles.tabDivider} ${isDarkMode ? styles.darkTabDivider : ''}`} />
              <Box className={`${styles.preferencesSection} ${isDarkMode ? styles.darkPreferencesSection : ''}`}>
                <Box className={styles.preferenceGroup}>
                  <Typography variant="subtitle1" className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ''}`}>
                    <NotificationsIcon className={`${styles.sectionIcon} ${isDarkMode ? styles.darkSectionIcon : ''}`} />
                    Notifications
                  </Typography>
                  <Box className={`${styles.preferenceItem} ${isDarkMode ? styles.darkPreferenceItem : ''}`}>
                    <SwitchWithLabel
                      checked={preferences.emailNotifications}
                      onChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                      label="Email Notifications"
                    />
                  </Box>
                  <Box className={`${styles.preferenceItem} ${isDarkMode ? styles.darkPreferenceItem : ''}`}>
                    <SwitchWithLabel
                      checked={preferences.pushNotifications}
                      onChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                      label="Push Notifications"
                    />
                  </Box>
                  <Box className={`${styles.preferenceItem} ${isDarkMode ? styles.darkPreferenceItem : ''}`}>
                    <SwitchWithLabel
                      checked={preferences.weeklyDigest}
                      onChange={(checked) => handlePreferenceChange('weeklyDigest', checked)}
                      label="Weekly Digest"
                    />
                  </Box>
                </Box>
                <Divider className={`${styles.preferenceDivider} ${isDarkMode ? styles.darkPreferenceDivider : ''}`} />
                <Box className={styles.preferenceGroup}>
                  <Typography variant="subtitle1" className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ''}`}>
                    <PaletteIcon className={`${styles.sectionIcon} ${isDarkMode ? styles.darkSectionIcon : ''}`} />
                    Appearance
                  </Typography>
                  <Box className={`${styles.preferenceItem} ${isDarkMode ? styles.darkPreferenceItem : ''}`}>
                    <div className={styles.switchWrapper}>
                      <CustomSwitch
                        checked={preferences.darkMode}
                        onChange={(checked) => handlePreferenceChange('darkMode', checked)}
                      />
                      <span className={`${styles.switchLabel} ${isDarkMode ? styles.darkSwitchLabel : ''}`}>
                        {preferences.darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                        <span style={{ marginLeft: '8px' }}>
                          {preferences.darkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </span>
                    </div>
                  </Box>
                </Box>
                <Divider className={`${styles.preferenceDivider} ${isDarkMode ? styles.darkPreferenceDivider : ''}`} />
                <Box className={styles.preferenceGroup}>
                  <Typography variant="subtitle1" className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ''}`}>
                    <LanguageIcon className={`${styles.sectionIcon} ${isDarkMode ? styles.darkSectionIcon : ''}`} />
                    Language & Region
                  </Typography>
                  <Box className={`${styles.preferenceItem} ${isDarkMode ? styles.darkPreferenceItem : ''}`}>
                    <Typography variant="body2" className={`${styles.preferenceLabel} ${isDarkMode ? styles.darkPreferenceLabel : ''}`}>
                      Language
                    </Typography>
                    <Typography variant="body1" className={`${styles.preferenceValue} ${isDarkMode ? styles.darkPreferenceValue : ''}`}>
                      {preferences.language}
                    </Typography>
                  </Box>
                  <Box className={`${styles.preferenceItem} ${isDarkMode ? styles.darkPreferenceItem : ''}`}>
                    <Typography variant="body2" className={`${styles.preferenceLabel} ${isDarkMode ? styles.darkPreferenceLabel : ''}`}>
                      Timezone
                    </Typography>
                    <Typography variant="body1" className={`${styles.preferenceValue} ${isDarkMode ? styles.darkPreferenceValue : ''}`}>
                      {preferences.timezone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Security Tab */}
          {activeTab === 2 && (
            <Box className={`${styles.tabContent} ${isDarkMode ? styles.darkTabContent : ''}`}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6" className={`${styles.tabTitle} ${isDarkMode ? styles.darkTabTitle : ''}`}>
                  Security
                </Typography>
              </Box>
              <Divider className={`${styles.tabDivider} ${isDarkMode ? styles.darkTabDivider : ''}`} />
              <Box className={`${styles.securitySection} ${isDarkMode ? styles.darkSecuritySection : ''}`}>
                <Box className={`${styles.securityItem} ${isDarkMode ? styles.darkSecurityItem : ''}`}>
                  <Box className={styles.securityItemHeader}>
                    <LockIcon className={`${styles.securityIcon} ${isDarkMode ? styles.darkSecurityIcon : ''}`} />
                    <Box>
                      <Typography variant="subtitle1" className={`${styles.securityItemTitle} ${isDarkMode ? styles.darkSecurityItemTitle : ''}`}>
                        Password
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className={isDarkMode ? styles.darkSecurityItemSubtitle : ''}>
                        Last changed 3 months ago
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setShowPasswordDialog(true)}
                    className={`${styles.changePasswordButton} ${isDarkMode ? styles.darkChangePasswordButton : ''}`}
                    style={{
                      borderColor: shouldUseAccent ? accentColor : undefined,
                      color: shouldUseAccent ? accentColor : undefined,
                    }}
                  >
                    Change Password
                  </Button>
                </Box>
                <Divider className={`${styles.securityDivider} ${isDarkMode ? styles.darkSecurityDivider : ''}`} />
                <Box className={`${styles.securityItem} ${isDarkMode ? styles.darkSecurityItem : ''}`}>
                  <Box className={styles.securityItemHeader}>
                    <SecurityIcon className={`${styles.securityIcon} ${isDarkMode ? styles.darkSecurityIcon : ''}`} />
                    <Box>
                      <Typography variant="subtitle1" className={`${styles.securityItemTitle} ${isDarkMode ? styles.darkSecurityItemTitle : ''}`}>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className={isDarkMode ? styles.darkSecurityItemSubtitle : ''}>
                        Add an extra layer of security
                      </Typography>
                    </Box>
                  </Box>
                  <SwitchWithLabel
                    checked={security.twoFactorAuth}
                    onChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))}
                    label="Enable 2FA"
                  />
                </Box>
                <Divider className={`${styles.securityDivider} ${isDarkMode ? styles.darkSecurityDivider : ''}`} />
                <Box className={`${styles.securityItem} ${isDarkMode ? styles.darkSecurityItem : ''}`}>
                  <Box className={styles.securityItemHeader}>
                    <Typography variant="subtitle1" className={`${styles.securityItemTitle} ${isDarkMode ? styles.darkSecurityItemTitle : ''}`}>
                      Active Sessions
                    </Typography>
                  </Box>
                  <Box className={styles.sessionsList}>
                    {security.activeSessions.map((session, index) => (
                      <Box key={index} className={`${styles.sessionItem} ${isDarkMode ? styles.darkSessionItem : ''}`}>
                        <Box className={styles.sessionInfo}>
                          <Typography variant="body2" className={`${styles.sessionName} ${isDarkMode ? styles.darkSessionName : ''}`}>
                            {session}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" className={isDarkMode ? styles.darkSessionSubtitle : ''}>
                            Active now
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          className={`${styles.sessionLogout} ${isDarkMode ? styles.darkSessionLogout : ''}`}
                          onClick={() => {
                            const updatedSessions = security.activeSessions.filter((_, i) => i !== index);
                            setSecurity(prev => ({ ...prev, activeSessions: updatedSessions }));
                            showSnackbar('Session terminated successfully', 'success');
                          }}
                        >
                          Logout
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Divider className={`${styles.securityDivider} ${isDarkMode ? styles.darkSecurityDivider : ''}`} />
                <Box className={`${styles.securityItem} ${isDarkMode ? styles.darkSecurityItem : ''}`}>
                  <Button
                    variant="contained"
                    className={`${styles.deleteAccountButton} ${isDarkMode ? styles.darkDeleteAccountButton : ''}`}
                    onClick={() => setShowDeleteDialog(true)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete Account
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Change Password Dialog with Eye Buttons */}
        <Dialog 
          open={showPasswordDialog} 
          onClose={() => setShowPasswordDialog(false)}
          maxWidth="sm"
          fullWidth
          className={`${styles.passwordDialog} ${isDarkMode ? styles.darkPasswordDialog : ""}`}
          PaperProps={{
            className: `${styles.passwordDialogPaper} ${isDarkMode ? styles.darkPasswordDialogPaper : ""}`,
            style: shouldUseAccent ? {
              border: `1px solid rgba(${accentRgb}, 0.15)`,
              background: '#0D0D0D',
            } : undefined,
          }}
        >
          <DialogTitle 
            className={`${styles.dialogTitle} ${isDarkMode ? styles.darkDialogTitle : ""}`}
            style={shouldUseAccent ? {
              color: '#e9e9e9',
              borderBottom: `1px solid rgba(${accentRgb}, 0.08)`,
            } : undefined}
          >
            <LockIcon 
              className={`${styles.dialogIcon} ${isDarkMode ? styles.darkDialogIcon : ""}`}
              style={shouldUseAccent ? {
                color: accentColor,
              } : undefined}
            />
            Change Password
          </DialogTitle>
          <DialogContent>
            <Box className={`${styles.dialogContent} ${isDarkMode ? styles.darkDialogContent : ""}`}>
              {/* Current Password */}
              <div className={`${styles.passwordField} ${isDarkMode ? styles.darkPasswordField : ""}`}>
                <label 
                  className={`${styles.passwordLabel} ${isDarkMode ? styles.darkPasswordLabel : ""}`}
                  style={shouldUseAccent ? {
                    color: '#e9e9e9',
                  } : undefined}
                >
                  Current Password
                </label>
                <div 
                  className={`${styles.passwordInputWrap} ${isDarkMode ? styles.darkPasswordInputWrap : ""}`}
                  style={shouldUseAccent ? {
                    background: '#1A1A1A',
                    border: `1px solid rgba(${accentRgb}, 0.15)`,
                    borderRadius: '10px',
                  } : undefined}
                >
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`${styles.passwordInput} ${passwordErrors.currentPassword ? styles.passwordInputError : ''} ${isDarkMode ? styles.darkPasswordInput : ''}`}
                    style={shouldUseAccent ? {
                      color: '#e9e9e9',
                      background: '#1A1A1A',
                      border: 'none',
                    } : undefined}
                  />
                  <button
                    type="button"
                    className={`${styles.passwordEyeBtn} ${isDarkMode ? styles.darkPasswordEyeBtn : ''}`}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                    style={shouldUseAccent ? {
                      color: '#6A6255',
                    } : undefined}
                    onMouseEnter={(e) => {
                      if (shouldUseAccent) {
                        e.currentTarget.style.color = '#e9e9e9';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (shouldUseAccent) {
                        e.currentTarget.style.color = '#6A6255';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {showCurrentPassword ? (
                      <VisibilityOffIcon className={`${styles.passwordEyeIcon} ${isDarkMode ? styles.darkPasswordEyeIcon : ''}`} />
                    ) : (
                      <VisibilityIcon className={`${styles.passwordEyeIcon} ${isDarkMode ? styles.darkPasswordEyeIcon : ''}`} />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <span className={`${styles.passwordError} ${isDarkMode ? styles.darkPasswordError : ''}`}>{passwordErrors.currentPassword}</span>
                )}
              </div>

              {/* New Password */}
              <div className={`${styles.passwordField} ${isDarkMode ? styles.darkPasswordField : ""}`}>
                <label 
                  className={`${styles.passwordLabel} ${isDarkMode ? styles.darkPasswordLabel : ""}`}
                  style={shouldUseAccent ? {
                    color: '#e9e9e9',
                  } : undefined}
                >
                  New Password
                </label>
                <div 
                  className={`${styles.passwordInputWrap} ${isDarkMode ? styles.darkPasswordInputWrap : ""}`}
                  style={shouldUseAccent ? {
                    background: '#1A1A1A',
                    border: `1px solid rgba(${accentRgb}, 0.15)`,
                    borderRadius: '10px',
                  } : undefined}
                >
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`${styles.passwordInput} ${passwordErrors.newPassword ? styles.passwordInputError : ''} ${isDarkMode ? styles.darkPasswordInput : ''}`}
                    style={shouldUseAccent ? {
                      color: '#e9e9e9',
                      background: '#1A1A1A',
                      border: 'none',
                    } : undefined}
                  />
                  <button
                    type="button"
                    className={`${styles.passwordEyeBtn} ${isDarkMode ? styles.darkPasswordEyeBtn : ''}`}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    style={shouldUseAccent ? {
                      color: '#6A6255',
                    } : undefined}
                    onMouseEnter={(e) => {
                      if (shouldUseAccent) {
                        e.currentTarget.style.color = '#e9e9e9';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (shouldUseAccent) {
                        e.currentTarget.style.color = '#6A6255';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {showNewPassword ? (
                      <VisibilityOffIcon className={`${styles.passwordEyeIcon} ${isDarkMode ? styles.darkPasswordEyeIcon : ''}`} />
                    ) : (
                      <VisibilityIcon className={`${styles.passwordEyeIcon} ${isDarkMode ? styles.darkPasswordEyeIcon : ''}`} />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <span className={`${styles.passwordError} ${isDarkMode ? styles.darkPasswordError : ''}`}>{passwordErrors.newPassword}</span>
                )}
              </div>

              {/* Confirm New Password */}
              <div className={`${styles.passwordField} ${isDarkMode ? styles.darkPasswordField : ""}`}>
                <label 
                  className={`${styles.passwordLabel} ${isDarkMode ? styles.darkPasswordLabel : ""}`}
                  style={shouldUseAccent ? {
                    color: '#e9e9e9',
                  } : undefined}
                >
                  Confirm New Password
                </label>
                <div 
                  className={`${styles.passwordInputWrap} ${isDarkMode ? styles.darkPasswordInputWrap : ""}`}
                  style={shouldUseAccent ? {
                    background: '#1A1A1A',
                    border: `1px solid rgba(${accentRgb}, 0.15)`,
                    borderRadius: '10px',
                  } : undefined}
                >
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`${styles.passwordInput} ${passwordErrors.confirmPassword ? styles.passwordInputError : ''} ${isDarkMode ? styles.darkPasswordInput : ''}`}
                    style={shouldUseAccent ? {
                      color: '#e9e9e9',
                      background: '#1A1A1A',
                      border: 'none',
                    } : undefined}
                  />
                  <button
                    type="button"
                    className={`${styles.passwordEyeBtn} ${isDarkMode ? styles.darkPasswordEyeBtn : ''}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    style={shouldUseAccent ? {
                      color: '#6A6255',
                    } : undefined}
                    onMouseEnter={(e) => {
                      if (shouldUseAccent) {
                        e.currentTarget.style.color = '#e9e9e9';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (shouldUseAccent) {
                        e.currentTarget.style.color = '#6A6255';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon className={`${styles.passwordEyeIcon} ${isDarkMode ? styles.darkPasswordEyeIcon : ''}`} />
                    ) : (
                      <VisibilityIcon className={`${styles.passwordEyeIcon} ${isDarkMode ? styles.darkPasswordEyeIcon : ''}`} />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <span className={`${styles.passwordError} ${isDarkMode ? styles.darkPasswordError : ''}`}>{passwordErrors.confirmPassword}</span>
                )}
              </div>
            </Box>
          </DialogContent>
          <DialogActions 
            className={`${styles.dialogActions} ${isDarkMode ? styles.darkDialogActions : ""}`}
            style={shouldUseAccent ? {
              borderTop: `1px solid rgba(${accentRgb}, 0.08)`,
              padding: '16px 24px',
            } : undefined}
          >
            <Button 
              onClick={() => setShowPasswordDialog(false)} 
              className={`${styles.dialogCancel} ${isDarkMode ? styles.darkDialogCancel : ""}`}
              style={shouldUseAccent ? {
                color: '#6A6255',
                border: `1px solid rgba(${accentRgb}, 0.15)`,
              } : undefined}
              onMouseEnter={(e) => {
                if (shouldUseAccent) {
                  e.currentTarget.style.background = `rgba(${accentRgb}, 0.08)`;
                  e.currentTarget.style.color = '#e9e9e9';
                  e.currentTarget.style.borderColor = accentColor;
                }
              }}
              onMouseLeave={(e) => {
                if (shouldUseAccent) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6A6255';
                  e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.15)`;
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordSubmit} 
              variant="contained"
              className={`${styles.dialogSave} ${isDarkMode ? styles.darkDialogSave : ""}`}
              style={shouldUseAccent ? {
                background: accentColor,
                color: '#000000',
              } : undefined}
              onMouseEnter={(e) => {
                if (shouldUseAccent) {
                  e.currentTarget.style.opacity = '0.85';
                }
              }}
              onMouseLeave={(e) => {
                if (shouldUseAccent) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              Update Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            className={`${styles.snackbarAlert} ${isDarkMode ? styles.darkSnackbarAlert : ''}`}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Profile;