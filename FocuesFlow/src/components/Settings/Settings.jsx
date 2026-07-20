import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Switch, Select, MenuItem, Button, Slider, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import {
  Palette as PaletteIcon,
  Language as LanguageIcon,
  NotificationsActive as NotificationsIcon,
  Shield as ShieldIcon,
  WarningAmber as WarningIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  SettingsBrightness as SettingsBrightnessIcon,
  Visibility as VisibilityIcon,
  DeleteForever as DeleteForeverIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import styles from './Settings.module.css';

const ACCENT_COLORS = ['#885210', '#4B3832', '#C17A3F', '#6B3F0C', '#A66D2A', '#2E6FE8'];

const SettingsSection = ({ id, icon, title, children }) => (
  <Box id={id} className={styles.section}>
    <Box className={styles.sectionHeader}>
      <Box className={styles.sectionIcon}>{icon}</Box>
      <Typography className={styles.sectionTitle}>{title}</Typography>
    </Box>
    <Box className={styles.sectionCard}>{children}</Box>
  </Box>
);

const SettingsRow = ({ label, description, control, isLast, icon: rowIcon }) => (
  <Box className={`${styles.row} ${isLast ? '' : styles.rowDivider}`}>
    <Box className={styles.rowLeft}>
      {rowIcon && <Box className={styles.rowIcon}>{rowIcon}</Box>}
      <Box>
        <Typography className={styles.rowLabel}>{label}</Typography>
        <Typography className={styles.rowDescription}>{description}</Typography>
      </Box>
    </Box>
    <Box className={styles.rowControl}>{control}</Box>
  </Box>
);

const Settings = () => {
  const location = useLocation();
  const [themeMode, setThemeMode] = useState('light');
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [language, setLanguage] = useState('en-US');
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [soundEffects, setSoundEffects] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [activityStatus, setActivityStatus] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && sectionRefs.current[hash]) {
      setTimeout(() => {
        sectionRefs.current[hash].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);
    }
  }, [location]);

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      console.log('Account deleted');
    }, 2000);
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = () => {
    const errors = { currentPassword: '', newPassword: '', confirmPassword: '' };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleUpdatePassword = () => {
    if (validatePassword()) {
      setIsUpdatingPassword(true);
      setTimeout(() => {
        setIsUpdatingPassword(false);
        setPasswordModalOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        console.log('Password updated successfully');
      }, 2000);
    }
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  return (
    <Box className={styles.page}>
      {/* Background Decorations */}
      <div className={styles["settings-bg"]}>
        <div className={styles["settings-bg-orb"]} />
        <div className={styles["settings-bg-orb"]} />
        <div className={styles["settings-bg-orb"]} />
        <div className={styles["settings-bg-grid"]} />
        <div className={styles["settings-bg-glow"]} />
      </div>

      <Box className={styles.pageInner}>
        {/* Page Header */}
        <Box className={styles.pageHeader}>
          <Typography className={styles.pageTitle} style={{ fontSize: "50px" , fontWeight: "bold" , color: "#33231D" }}>Settings</Typography>
          <Typography className={styles.pageSubtitle} style={{ fontSize: "20px" , color: "#6B4C42" }}>Customize your BrewTask experience</Typography>
        </Box>

        {/* Appearance */}
        <div ref={el => sectionRefs.current['appearance'] = el}>
          <SettingsSection id="appearance" icon={<PaletteIcon />} title="Appearance">
            <SettingsRow
              label="Interface Theme"
              description="Choose your preferred visual style"
              control={
                <Box className={styles.themeToggle}>
                  <Box
                    className={`${styles.themeOption} ${themeMode === 'light' ? styles.themeOptionActive : ''}`}
                    onClick={() => setThemeMode('light')}
                  >
                    <LightModeIcon />
                    Light
                  </Box>
                  <Box
                    className={`${styles.themeOption} ${themeMode === 'dark' ? styles.themeOptionActive : ''}`}
                    onClick={() => setThemeMode('dark')}
                  >
                    <DarkModeIcon />
                    Dark
                  </Box>
                  <Box
                    className={`${styles.themeOption} ${themeMode === 'system' ? styles.themeOptionActive : ''}`}
                    onClick={() => setThemeMode('system')}
                  >
                    <SettingsBrightnessIcon />
                    System
                  </Box>
                </Box>
              }
            />
            <SettingsRow
              label="Accent Color"
              description="Select your primary focus highlight color"
              control={
                <Box className={styles.swatchRow}>
                  {ACCENT_COLORS.map((color) => (
                    <Box
                      key={color}
                      className={`${styles.swatch} ${accentColor === color ? styles.swatchActive : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setAccentColor(color)}
                    />
                  ))}
                </Box>
              }
            />
            <SettingsRow
              isLast
              label="Font Size"
              description="Adjust the interface text size"
              control={
                <Box className={styles.fontSizeControl}>
                  <Typography className={styles.fontSizeLabel}>{fontSize}px</Typography>
                  <Slider
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    min={12}
                    max={24}
                    step={1}
                    className={styles.fontSizeSlider}
                    sx={{
                      color: '#885210',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#885210',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#885210',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#E6E2DF',
                      },
                    }}
                  />
                </Box>
              }
            />
          </SettingsSection>
        </div>

        {/* Language & Region */}
        <div ref={el => sectionRefs.current['language'] = el}>
          <SettingsSection id="language" icon={<LanguageIcon />} title="Language & Region">
            <SettingsRow
              isLast
              label="Display Language"
              description="Preferred language for the BrewTask interface"
              control={
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  size="small"
                  className={styles.select}
                >
                  <MenuItem value="en-US">🇺🇸 English (US)</MenuItem>
                  <MenuItem value="en-GB">🇬🇧 English (UK)</MenuItem>
                  <MenuItem value="ar-EG">🇪🇬 العربية</MenuItem>
                  <MenuItem value="fr-FR">🇫🇷 Français</MenuItem>
                  <MenuItem value="es-ES">🇪🇸 Español</MenuItem>
                  <MenuItem value="de-DE">🇩🇪 Deutsch</MenuItem>
                </Select>
              }
            />
          </SettingsSection>
        </div>

        {/* Notifications */}
        <div ref={el => sectionRefs.current['notifications'] = el}>
          <SettingsSection id="notifications" icon={<NotificationsIcon />} title="Notifications">
            <SettingsRow
              label="Desktop Alerts"
              description="Show browser notifications for task reminders"
              control={
                <Switch
                  checked={desktopAlerts}
                  onChange={(e) => setDesktopAlerts(e.target.checked)}
                  className={styles.switch}
                />
              }
            />
            <SettingsRow
              label="Email Notifications"
              description="Receive email updates about your tasks"
              control={
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className={styles.switch}
                />
              }
            />
            <SettingsRow
              label="Sound Effects"
              description="Play sounds for task completions and reminders"
              control={
                <Switch
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  className={styles.switch}
                />
              }
            />
            <SettingsRow
              isLast
              label="Daily Summary"
              description="Receive a morning digest of your upcoming tasks"
              control={
                <Switch
                  checked={dailySummary}
                  onChange={(e) => setDailySummary(e.target.checked)}
                  className={styles.switch}
                />
              }
            />
          </SettingsSection>
        </div>

        {/* Security */}
        <div ref={el => sectionRefs.current['security'] = el}>
          <SettingsSection id="security" icon={<ShieldIcon />} title="Security">
            <SettingsRow
              label="Change Password"
              description="Update your account password for better security"
              control={
                <Button className={styles.darkButton} onClick={handleOpenPasswordModal}>
                  <SecurityIcon />
                  Update Password
                </Button>
              }
            />
            <SettingsRow
              isLast
              label="Two-Factor Authentication"
              description="Add an extra layer of protection to your account"
              control={
                <Button className={styles.primaryButton}>
                  Enable 2FA
                </Button>
              }
            />
          </SettingsSection>
        </div>

        {/* Privacy */}
        <div ref={el => sectionRefs.current['privacy'] = el}>
          <SettingsSection id="privacy" icon={<VisibilityIcon />} title="Privacy">
            <SettingsRow
              label="Profile Visibility"
              description="Control who can see your profile information"
              control={
                <Select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  size="small"
                  className={styles.select}
                >
                  <MenuItem value="public">🌍 Public</MenuItem>
                  <MenuItem value="private">🔒 Private</MenuItem>
                  <MenuItem value="team">👥 Team Only</MenuItem>
                </Select>
              }
            />
            <SettingsRow
              isLast
              label="Activity Status"
              description="Show when you're active to team members"
              control={
                <Switch
                  checked={activityStatus}
                  onChange={(e) => setActivityStatus(e.target.checked)}
                  className={styles.switch}
                />
              }
            />
          </SettingsSection>
        </div>

        {/* Danger Zone */}
        <div ref={el => sectionRefs.current['danger'] = el}>
          <Box className={styles.dangerSection}>
            <Box className={styles.sectionHeader}>
              <Box className={styles.dangerIcon}><WarningIcon /></Box>
              <Typography className={styles.dangerTitle}>Danger Zone</Typography>
            </Box>
            <Box className={styles.dangerCard}>
              <Box className={styles.dangerContent}>
                <Box className={styles.dangerIconWrapper}>
                  <DeleteForeverIcon />
                </Box>
                <Box>
                  <Typography className={styles.dangerLabel}>Delete Account</Typography>
                  <Typography className={styles.dangerDescription}>
                    Permanently erase all your data and task history. This action cannot be undone.
                  </Typography>
                </Box>
              </Box>
              <Button 
                className={`${styles.deleteButton} ${styles.deleteButtonRed}`}
                onClick={handleOpenDeleteModal}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </Box>
          </Box>
        </div>

        {/* Save Button */}
        <Box className={styles.saveSection}>
          <Button className={styles.saveButton}>
            <CheckCircleIcon />
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Delete Account Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        className={styles.deleteModal}
        closeAfterTransition
        BackdropProps={{
          className: styles.deleteModalBackdrop,
        }}
      >
        <Box className={styles.deleteModalContent}>
          <Box className={styles.deleteModalHeader}>
            <Box className={styles.deleteModalIconWrapper}>
              <WarningIcon className={styles.deleteModalIcon} />
            </Box>
            <Typography className={styles.deleteModalTitle}>Delete Account?</Typography>
            <button 
              className={styles.deleteModalClose} 
              onClick={handleCloseDeleteModal}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </Box>

          <Typography className={styles.deleteModalText}>
            This action <strong>cannot be undone</strong>. All your data, tasks, projects, and history will be permanently erased.
          </Typography>

          <Box className={styles.deleteModalActions}>
            <Button 
              className={styles.deleteModalCancel} 
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </Button>
            <Button 
              className={`${styles.deleteModalConfirm} ${styles.deleteModalConfirmRed}`}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        open={passwordModalOpen}
        onClose={handleClosePasswordModal}
        className={styles.passwordModal}
        closeAfterTransition
        BackdropProps={{
          className: styles.passwordModalBackdrop,
        }}
      >
        <Box className={styles.passwordModalContent}>
          <Box className={styles.passwordModalHeader}>
            <Box className={styles.passwordModalIconWrapper}>
              <SecurityIcon className={styles.passwordModalIcon} />
            </Box>
            <Typography className={styles.passwordModalTitle}>Change Password</Typography>
            <button 
              className={styles.passwordModalClose} 
              onClick={handleClosePasswordModal}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </Box>

          <Box className={styles.passwordModalBody}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              className={styles.passwordTextField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                      size="small"
                    >
                      {showCurrentPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword}
              className={styles.passwordTextField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      size="small"
                    >
                      {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              className={styles.passwordTextField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className={styles.passwordModalActions}>
            <Button 
              className={styles.passwordModalCancel} 
              onClick={handleClosePasswordModal}
            >
              Cancel
            </Button>
            <Button 
              className={styles.passwordModalConfirm}
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Settings;