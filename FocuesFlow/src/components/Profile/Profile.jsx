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
  Switch,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
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
    darkMode: false,
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
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
      className={styles.deleteDialog}
      PaperProps={{
        className: styles.deleteDialogPaper,
      }}
    >
      <Box className={styles.deleteDialogContent}>
        <Box className={styles.deleteDialogIconWrapper}>
          <WarningIcon className={styles.deleteDialogIcon} />
        </Box>
        <Typography variant="h5" className={styles.deleteDialogTitle}>
          Delete Account?
        </Typography>
        <Typography variant="body2" className={styles.deleteDialogText}>
          This action cannot be undone. All your data, projects, and tasks will be permanently removed.
        </Typography>
        <Box className={styles.deleteDialogActions}>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            className={styles.deleteDialogCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            className={styles.deleteDialogConfirm}
            startIcon={<DeleteIcon />}
          >
            Delete Account
          </Button>
        </Box>
      </Box>
    </Dialog>
  );

  return (
    <Box className={styles.profileContainer}>
      {/* Background */}
      <div className={styles.profileBg}>
        <div className={styles.profileBgOrb} />
        <div className={styles.profileBgOrb} />
        <div className={styles.profileBgOrb} />
        <div className={styles.profileBgGrid} />
        <div className={styles.profileBgGlow} />
      </div>

      {/* Changed maxWidth from "lg" to "xl" to allow wider layout */}
      <Container maxWidth="xl" className={styles.profileContent}>
        {/* Profile Header */}
        <Box className={styles.profileHeader}>
          <Box className={styles.profileHeaderContent}>
            <Box className={styles.avatarSection}>
              <Box className={styles.avatarWrapper}>
                <Avatar className={styles.profileAvatar}>
                  {userData.fullName.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Tooltip title="Change Avatar" arrow>
                  <IconButton className={styles.avatarEditBtn} size="small">
                    <PhotoCameraIcon className={styles.avatarEditIcon} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box className={styles.avatarInfo}>
                <Typography variant="h4" className={styles.profileName}>
                  {userData.fullName}
                </Typography>
                <Typography variant="body2" className={styles.profileRole}>
                  {userData.role}
                </Typography>
                <Box className={styles.profileBadges}>
                  <Chip 
                    label="PRO ACCOUNT" 
                    size="small" 
                    className={styles.proChip}
                    icon={<CheckCircleIcon className={styles.chipIcon} />}
                  />
                  <Chip 
                    label="Active" 
                    size="small" 
                    className={styles.activeChip}
                  />
                </Box>
              </Box>
            </Box>
            <Box className={styles.quickStats}>
              {[
                { number: stats.tasksCompleted, label: 'Tasks Done' },
                { number: stats.projects, label: 'Projects' },
                { number: stats.streak, label: 'Day Streak' },
                { number: stats.focusHours, label: 'Focus Hours' },
              ].map((stat, index) => (
                <Box key={index} className={styles.quickStat}>
                  <span className={styles.quickStatNumber}>{stat.number}</span>
                  <span className={styles.quickStatLabel}>{stat.label}</span>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Paper className={styles.profilePaper}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            className={styles.profileTabs}
            TabIndicatorProps={{
              className: styles.tabIndicator,
            }}
          >
            <Tab 
              icon={<PersonIcon />} 
              label="Profile" 
              className={styles.profileTab}
            />
            <Tab 
              icon={<NotificationsIcon />} 
              label="Preferences" 
              className={styles.profileTab}
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Security" 
              className={styles.profileTab}
            />
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box className={styles.tabContent}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6" className={styles.tabTitle}>
                  Personal Information
                </Typography>
                {!isEditing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box className={styles.editActions}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className={styles.saveButton}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Box>
              <Divider className={styles.tabDivider} />
              <Box className={styles.profileGrid}>
                {/* Left Column */}
                <Box className={styles.profileLeftColumn}>
                  <Box className={styles.avatarCard}>
                    <Box className={styles.avatarCardContent}>
                      <Box className={styles.avatarCardAvatar}>
                        <Avatar className={styles.avatarCardImage}>
                          {userData.fullName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        {isEditing && (
                          <IconButton className={styles.avatarCardEdit} size="small">
                            <PhotoCameraIcon className={styles.avatarCardEditIcon} />
                          </IconButton>
                        )}
                      </Box>
                      <Box className={styles.avatarCardInfo}>
                        <Typography variant="h6" className={styles.avatarCardName}>
                          {userData.fullName}
                        </Typography>
                        <Typography variant="body2" className={styles.avatarCardRole}>
                          {userData.role}
                        </Typography>
                        <Box className={styles.avatarCardBadges}>
                          <Chip 
                            label="PRO" 
                            size="small" 
                            className={styles.avatarCardProChip}
                            icon={<CheckCircleIcon className={styles.avatarCardChipIcon} />}
                          />
                          <Chip 
                            label="Active" 
                            size="small" 
                            className={styles.avatarCardActiveChip}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box className={styles.statsGrid}>
                    <Box className={styles.statCard}>
                      <Box className={styles.statCardIconWrapper}>
                        <CheckCircleIcon className={styles.statCardIcon} />
                      </Box>
                      <Box className={styles.statCardInfo}>
                        <span className={styles.statCardNumber}>147</span>
                        <span className={styles.statCardLabel}>Tasks Done</span>
                      </Box>
                    </Box>
                    <Box className={styles.statCard}>
                      <Box className={styles.statCardIconWrapper}>
                        <PersonIcon className={styles.statCardIcon} />
                      </Box>
                      <Box className={styles.statCardInfo}>
                        <span className={styles.statCardNumber}>12</span>
                        <span className={styles.statCardLabel}>Projects</span>
                      </Box>
                    </Box>
                    <Box className={styles.statCard}>
                      <Box className={styles.statCardIconWrapper}>
                        <NotificationsIcon className={styles.statCardIcon} />
                      </Box>
                      <Box className={styles.statCardInfo}>
                        <span className={styles.statCardNumber}>7</span>
                        <span className={styles.statCardLabel}>Day Streak</span>
                      </Box>
                    </Box>
                    <Box className={styles.statCard}>
                      <Box className={styles.statCardIconWrapper}>
                        <LockIcon className={styles.statCardIcon} />
                      </Box>
                      <Box className={styles.statCardInfo}>
                        <span className={styles.statCardNumber}>324</span>
                        <span className={styles.statCardLabel}>Focus Hours</span>
                      </Box>
                    </Box>
                  </Box>
                  <Box className={styles.memberCard}>
                    <Box className={styles.memberCardContent}>
                      <Box className={styles.memberCardIconWrapper}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </Box>
                      <Box>
                        <Typography variant="body2" className={styles.memberCardLabel}>
                          Member since
                        </Typography>
                        <Typography variant="body1" className={styles.memberCardDate}>
                          {userData.joinDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Right Column - Form Fields */}
                <Box className={styles.profileRightColumn}>
                  <Box className={styles.formCard}>
                    <Box className={styles.formCardHeader}>
                      <Typography variant="subtitle2" className={styles.formCardTitle}>
                        <PersonIcon className={styles.formCardIcon} />
                        Basic Information
                      </Typography>
                    </Box>
                    <Box className={styles.formCardContent}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        size="medium"
                        className={styles.profileTextField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon className={styles.fieldIcon} />
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
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        size="medium"
                        className={styles.profileTextField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon className={styles.fieldIcon} />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: styles.inputLabel,
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className={styles.formCard}>
                    <Box className={styles.formCardHeader}>
                      <Typography variant="subtitle2" className={styles.formCardTitle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <polyline points="9 12 11 14 15 10" />
                        </svg>
                        Additional Details
                      </Typography>
                    </Box>
                    <Box className={styles.formCardContent}>
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
                        className={styles.profileTextField}
                        placeholder="Tell us about yourself..."
                        InputLabelProps={{
                          shrink: true,
                          className: styles.inputLabel,
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
                          className={styles.profileTextField}
                          InputLabelProps={{
                            shrink: true,
                            className: styles.inputLabel,
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
                          className={styles.profileTextField}
                          InputLabelProps={{
                            shrink: true,
                            className: styles.inputLabel,
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
            <Box className={styles.tabContent}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6" className={styles.tabTitle}>
                  Preferences
                </Typography>
              </Box>
              <Divider className={styles.tabDivider} />
              <Box className={styles.preferencesSection}>
                <Box className={styles.preferenceGroup}>
                  <Typography variant="subtitle1" className={styles.sectionTitle}>
                    <NotificationsIcon className={styles.sectionIcon} />
                    Notifications
                  </Typography>
                  <Box className={styles.preferenceItem}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.emailNotifications}
                          onChange={handlePreferenceChange}
                          name="emailNotifications"
                          className={styles.preferenceSwitch}
                          sx={{
                            '&.Mui-checked': {
                              color: '#885210',
                            },
                            '&.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#885210',
                            },
                          }}
                        />
                      }
                      label="Email Notifications"
                    />
                  </Box>
                  <Box className={styles.preferenceItem}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.pushNotifications}
                          onChange={handlePreferenceChange}
                          name="pushNotifications"
                          className={styles.preferenceSwitch}
                          sx={{
                            '&.Mui-checked': {
                              color: '#885210',
                            },
                            '&.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#885210',
                            },
                          }}
                        />
                      }
                      label="Push Notifications"
                    />
                  </Box>
                  <Box className={styles.preferenceItem}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.weeklyDigest}
                          onChange={handlePreferenceChange}
                          name="weeklyDigest"
                          className={styles.preferenceSwitch}
                          sx={{
                            '&.Mui-checked': {
                              color: '#885210',
                            },
                            '&.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#885210',
                            },
                          }}
                        />
                      }
                      label="Weekly Digest"
                    />
                  </Box>
                </Box>
                <Divider className={styles.preferenceDivider} />
                <Box className={styles.preferenceGroup}>
                  <Typography variant="subtitle1" className={styles.sectionTitle}>
                    <PaletteIcon className={styles.sectionIcon} />
                    Appearance
                  </Typography>
                  <Box className={styles.preferenceItem}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferences.darkMode}
                          onChange={handlePreferenceChange}
                          name="darkMode"
                          className={styles.preferenceSwitch}
                          sx={{
                            '&.Mui-checked': {
                              color: '#885210',
                            },
                            '&.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#885210',
                            },
                          }}
                        />
                      }
                      label={
                        <Box className={styles.preferenceLabel}>
                          {preferences.darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                          <span>{preferences.darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </Box>
                      }
                    />
                  </Box>
                </Box>
                <Divider className={styles.preferenceDivider} />
                <Box className={styles.preferenceGroup}>
                  <Typography variant="subtitle1" className={styles.sectionTitle}>
                    <LanguageIcon className={styles.sectionIcon} />
                    Language & Region
                  </Typography>
                  <Box className={styles.preferenceItem}>
                    <Typography variant="body2" className={styles.preferenceLabel}>
                      Language
                    </Typography>
                    <Typography variant="body1" className={styles.preferenceValue}>
                      {preferences.language}
                    </Typography>
                  </Box>
                  <Box className={styles.preferenceItem}>
                    <Typography variant="body2" className={styles.preferenceLabel}>
                      Timezone
                    </Typography>
                    <Typography variant="body1" className={styles.preferenceValue}>
                      {preferences.timezone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Security Tab */}
          {activeTab === 2 && (
            <Box className={styles.tabContent}>
              <Box className={styles.tabHeader}>
                <Typography variant="h6" className={styles.tabTitle}>
                  Security
                </Typography>
              </Box>
              <Divider className={styles.tabDivider} />
              <Box className={styles.securitySection}>
                <Box className={styles.securityItem}>
                  <Box className={styles.securityItemHeader}>
                    <LockIcon className={styles.securityIcon} />
                    <Box>
                      <Typography variant="subtitle1" className={styles.securityItemTitle}>
                        Password
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Last changed 3 months ago
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setShowPasswordDialog(true)}
                    className={styles.changePasswordButton}
                  >
                    Change Password
                  </Button>
                </Box>
                <Divider className={styles.securityDivider} />
                <Box className={styles.securityItem}>
                  <Box className={styles.securityItemHeader}>
                    <SecurityIcon className={styles.securityIcon} />
                    <Box>
                      <Typography variant="subtitle1" className={styles.securityItemTitle}>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Add an extra layer of security
                      </Typography>
                    </Box>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={security.twoFactorAuth}
                        onChange={() => setSecurity(prev => ({ 
                          ...prev, 
                          twoFactorAuth: !prev.twoFactorAuth 
                        }))}
                        className={styles.securitySwitch}
                        sx={{
                          '&.Mui-checked': {
                            color: '#885210',
                          },
                          '&.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#885210',
                          },
                        }}
                      />
                    }
                    label="Enable 2FA"
                  />
                </Box>
                <Divider className={styles.securityDivider} />
                <Box className={styles.securityItem}>
                  <Box className={styles.securityItemHeader}>
                    <Typography variant="subtitle1" className={styles.securityItemTitle}>
                      Active Sessions
                    </Typography>
                  </Box>
                  <Box className={styles.sessionsList}>
                    {security.activeSessions.map((session, index) => (
                      <Box key={index} className={styles.sessionItem}>
                        <Box className={styles.sessionInfo}>
                          <Typography variant="body2" className={styles.sessionName}>
                            {session}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Active now
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          className={styles.sessionLogout}
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
                <Divider className={styles.securityDivider} />
                <Box className={styles.securityItem}>
                  <Button
                    variant="contained"
                    className={styles.deleteAccountButton}
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

        {/* Change Password Dialog */}
        <Dialog 
          open={showPasswordDialog} 
          onClose={() => setShowPasswordDialog(false)}
          maxWidth="sm"
          fullWidth
          className={styles.passwordDialog}
          PaperProps={{
            className: styles.passwordDialogPaper,
          }}
        >
          <DialogTitle className={styles.dialogTitle}>
            <LockIcon className={styles.dialogIcon} />
            Change Password
          </DialogTitle>
          <DialogContent>
            <Box className={styles.dialogContent}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.currentPassword}
                helperText={passwordErrors.currentPassword}
                className={styles.dialogTextField}
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword}
                className={styles.dialogTextField}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword}
                className={styles.dialogTextField}
              />
            </Box>
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button onClick={() => setShowPasswordDialog(false)} className={styles.dialogCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordSubmit} 
              variant="contained"
              className={styles.dialogSave}
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
            className={styles.snackbarAlert}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Profile;