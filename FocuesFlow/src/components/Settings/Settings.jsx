// Settings.jsx - Updated with mode-specific accent colors and proper text colors
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Select, MenuItem, Button, Slider, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
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
import { useDarkMode } from '../Context/DarkModeContext';
import { useAccentColor } from '../Context/AccentColorContext';
import styles from './Settings.module.css';

// Dark mode accent colors
const DARK_MODE_COLORS = [
  { hex: '#FBBC00', name: 'Amber' },
  { hex: '#2E6FE8', name: 'Blue' },
];

// Light mode accent colors
const LIGHT_MODE_COLORS = [
  { hex: '#885210', name: 'Brown' }
];

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

const SettingsSection = ({ id, icon, title, children, isDarkMode }) => (
  <Box id={id} className={`${styles.section} ${isDarkMode ? styles.darkSection : ''}`}>
    <Box className={`${styles.sectionHeader} ${isDarkMode ? styles.darkSectionHeader : ''}`}>
      <Box className={`${styles.sectionIcon} ${isDarkMode ? styles.darkSectionIcon : ''}`}>{icon}</Box>
      <Typography className={`${styles.sectionTitle} ${isDarkMode ? styles.darkSectionTitle : ''}`}>{title}</Typography>
    </Box>
    <Box className={`${styles.sectionCard} ${isDarkMode ? styles.darkSectionCard : ''}`}>{children}</Box>
  </Box>
);

const SettingsRow = ({ label, description, control, isLast, icon: rowIcon, isDarkMode }) => (
  <Box className={`${styles.row} ${isLast ? '' : styles.rowDivider} ${isDarkMode ? styles.darkRow : ''}`}>
    <Box className={styles.rowLeft}>
      {rowIcon && <Box className={`${styles.rowIcon} ${isDarkMode ? styles.darkRowIcon : ''}`}>{rowIcon}</Box>}
      <Box>
        <Typography className={`${styles.rowLabel} ${isDarkMode ? styles.darkRowLabel : ''}`}>{label}</Typography>
        <Typography className={`${styles.rowDescription} ${isDarkMode ? styles.darkRowDescription : ''}`}>{description}</Typography>
      </Box>
    </Box>
    <Box className={styles.rowControl}>{control}</Box>
  </Box>
);

const Settings = () => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { accentColor, setAccentColor, LIGHT_MODE_DEFAULT, DARK_MODE_DEFAULT } = useAccentColor();
  
  // Check system preference
  const getSystemPreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Get initial theme mode from localStorage or system
  const getInitialThemeMode = () => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      return savedMode;
    }
    return 'system';
  };

  const [themeMode, setThemeMode] = useState(getInitialThemeMode());
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

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (themeMode === 'system') {
        const systemPref = e.matches ? 'dark' : 'light';
        const shouldBeDark = systemPref === 'dark';
        if (isDarkMode !== shouldBeDark) {
          toggleDarkMode();
          // Reset accent color based on system preference
          if (systemPref === 'dark') {
            setAccentColor(DARK_MODE_DEFAULT);
          } else {
            setAccentColor(LIGHT_MODE_DEFAULT);
          }
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode, isDarkMode, toggleDarkMode, setAccentColor, DARK_MODE_DEFAULT, LIGHT_MODE_DEFAULT]);

  // Apply theme based on mode
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

  // Update theme when mode changes
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    
    if (themeMode === 'system') {
      const systemPref = getSystemPreference();
      const shouldBeDark = systemPref === 'dark';
      if (isDarkMode !== shouldBeDark) {
        toggleDarkMode();
        // Reset accent color based on system preference
        if (systemPref === 'dark') {
          setAccentColor(DARK_MODE_DEFAULT);
        } else {
          setAccentColor(LIGHT_MODE_DEFAULT);
        }
      }
    } else if (themeMode === 'dark') {
      if (!isDarkMode) {
        toggleDarkMode();
        // Reset to dark default (#FBBC00) when switching to dark mode
        setAccentColor(DARK_MODE_DEFAULT);
      }
    } else if (themeMode === 'light') {
      if (isDarkMode) {
        toggleDarkMode();
        // Reset to light default (#885210) when switching to light mode
        setAccentColor(LIGHT_MODE_DEFAULT);
      }
    }
  }, [themeMode, isDarkMode, toggleDarkMode, setAccentColor, DARK_MODE_DEFAULT, LIGHT_MODE_DEFAULT]);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    
    // Immediately set accent color based on the selected mode
    if (mode === 'light') {
      setAccentColor(LIGHT_MODE_DEFAULT); // #885210
    } else if (mode === 'dark') {
      setAccentColor(DARK_MODE_DEFAULT); // #FBBC00
    } else if (mode === 'system') {
      const systemPref = getSystemPreference();
      if (systemPref === 'dark') {
        setAccentColor(DARK_MODE_DEFAULT); // #FBBC00
      } else {
        setAccentColor(LIGHT_MODE_DEFAULT); // #885210
      }
    }
  };

  // Handle accent color selection
  const handleAccentColorChange = (color) => {
    setAccentColor(color);
  };

  // Get available colors based on current mode
  const getAvailableColors = () => {
    return isDarkMode ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;
  };

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

  // Get display theme for active state
  const getActiveTheme = () => {
    if (themeMode === 'system') {
      return getSystemPreference();
    }
    return themeMode;
  };

  const availableColors = getAvailableColors();

  return (
    <Box className={`${styles.page} ${isDarkMode ? styles.darkPage : ''}`}>
      {/* Background Decorations */}
      <div className={`${styles["settings-bg"]} ${isDarkMode ? styles.darkSettingsBg : ''}`}>
        <div className={styles["settings-bg-orb"]} />
        <div className={styles["settings-bg-orb"]} />
        <div className={styles["settings-bg-orb"]} />
        <div className={`${styles["settings-bg-grid"]} ${isDarkMode ? styles.darkSettingsBgGrid : ''}`} />
        <div className={`${styles["settings-bg-glow"]} ${isDarkMode ? styles.darkSettingsBgGlow : ''}`} />
      </div>

      <Box className={`${styles.pageInner} ${isDarkMode ? styles.darkPageInner : ''}`}>
        {/* Page Header */}
        <Box className={`${styles.pageHeader} ${isDarkMode ? styles.darkPageHeader : ''}`}>
          <Typography className={`${styles.pageTitle} ${isDarkMode ? styles.darkPageTitle : ''}`} style={{fontSize:"45px",fontWeight:"700"}}>Settings</Typography>
          <Typography className={`${styles.pageSubtitle} ${isDarkMode ? styles.darkPageSubtitle : ''}`} style={{fontSize:"20px",fontWeight:"200"}}>Customize your BrewTask experience</Typography>
        </Box>

        {/* Appearance */}
        <div ref={el => sectionRefs.current['appearance'] = el}>
          <SettingsSection id="appearance" icon={<PaletteIcon />} title="Appearance" isDarkMode={isDarkMode}>
            <SettingsRow
              label="Interface Theme"
              description="Choose your preferred visual style"
              isDarkMode={isDarkMode}
              control={
                <Box className={`${styles.themeToggle} ${isDarkMode ? styles.darkThemeToggle : ''}`}>
                  <Box
                    className={`${styles.themeOption} ${themeMode === 'light' ? styles.themeOptionActive : ''} ${isDarkMode ? styles.darkThemeOption : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <LightModeIcon />
                    Light
                  </Box>
                  <Box
                    className={`${styles.themeOption} ${themeMode === 'dark' ? styles.themeOptionActive : ''} ${isDarkMode ? styles.darkThemeOption : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <DarkModeIcon />
                    Dark
                  </Box>
                  <Box
                    className={`${styles.themeOption} ${themeMode === 'system' ? styles.themeOptionActive : ''} ${isDarkMode ? styles.darkThemeOption : ''}`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <SettingsBrightnessIcon />
                    System {themeMode === 'system' && `(${getSystemPreference()})`}
                  </Box>
                </Box>
              }
            />
            <SettingsRow
              label="Accent Color"
              description={isDarkMode ? "Choose your dark mode accent color" : "Choose your light mode accent color"}
              isDarkMode={isDarkMode}
              control={
                <Box className={styles.swatchRow}>
                  {availableColors.map((color) => (
                    <Box
                      key={color.hex}
                      className={`${styles.swatch} ${accentColor === color.hex ? styles.swatchActive : ''} ${isDarkMode ? styles.darkSwatch : styles.lightSwatch}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleAccentColorChange(color.hex)}
                      title={color.name}
                    />
                  ))}
                </Box>
              }
            />
            <SettingsRow
              isLast
              label="Font Size"
              description="Adjust the interface text size"
              isDarkMode={isDarkMode}
              control={
                <Box className={`${styles.fontSizeControl} ${isDarkMode ? styles.darkFontSizeControl : ''}`}>
                  <Typography className={`${styles.fontSizeLabel} ${isDarkMode ? styles.darkFontSizeLabel : ''}`}>{fontSize}px</Typography>
                  <Slider
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    min={12}
                    max={24}
                    step={1}
                    className={`${styles.fontSizeSlider} ${isDarkMode ? styles.darkFontSizeSlider : ''}`}
                    sx={{
                      color: isDarkMode ? accentColor : '#885210',
                      '& .MuiSlider-thumb': {
                        backgroundColor: isDarkMode ? accentColor : '#885210',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: isDarkMode ? accentColor : '#885210',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: isDarkMode ? '#383B40' : '#E6E2DF',
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
          <SettingsSection id="language" icon={<LanguageIcon />} title="Language & Region" isDarkMode={isDarkMode}>
            <SettingsRow
              isLast
              label="Display Language"
              description="Preferred language for the BrewTask interface"
              isDarkMode={isDarkMode}
              control={
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  size="small"
                  className={`${styles.select} ${isDarkMode ? styles.darkSelect : ''}`}
                  MenuProps={{
                    classes: {
                      paper: `${styles.menuPaper} ${isDarkMode ? styles.darkMenuPaper : ''}`,
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  <MenuItem value="en-US" className={`${styles.menuItem} ${isDarkMode ? styles.darkMenuItem : ''}`}>
                    🇺🇸 English (US)
                  </MenuItem>
                  <MenuItem value="ar-EG" className={`${styles.menuItem} ${isDarkMode ? styles.darkMenuItem : ''}`}>
                    🇪🇬 العربية
                  </MenuItem>
                </Select>
              }
            />
          </SettingsSection>
        </div>

        {/* Notifications */}
        <div ref={el => sectionRefs.current['notifications'] = el}>
          <SettingsSection id="notifications" icon={<NotificationsIcon />} title="Notifications" isDarkMode={isDarkMode}>
            <SettingsRow
              label="Desktop Alerts"
              description="Show browser notifications for task reminders"
              isDarkMode={isDarkMode}
              control={
                <CustomSwitch
                  checked={desktopAlerts}
                  onChange={setDesktopAlerts}
                />
              }
            />
            <SettingsRow
              label="Email Notifications"
              description="Receive email updates about your tasks"
              isDarkMode={isDarkMode}
              control={
                <CustomSwitch
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
              }
            />
            <SettingsRow
              label="Sound Effects"
              description="Play sounds for task completions and reminders"
              isDarkMode={isDarkMode}
              control={
                <CustomSwitch
                  checked={soundEffects}
                  onChange={setSoundEffects}
                />
              }
            />
            <SettingsRow
              isLast
              label="Daily Summary"
              description="Receive a morning digest of your upcoming tasks"
              isDarkMode={isDarkMode}
              control={
                <CustomSwitch
                  checked={dailySummary}
                  onChange={setDailySummary}
                />
              }
            />
          </SettingsSection>
        </div>

        {/* Security */}
        <div ref={el => sectionRefs.current['security'] = el}>
          <SettingsSection id="security" icon={<ShieldIcon />} title="Security" isDarkMode={isDarkMode}>
            <SettingsRow
              label="Change Password"
              description="Update your account password for better security"
              isDarkMode={isDarkMode}
              control={
                <Button 
                  className={`${isDarkMode ? styles.darkButton : styles.primaryButton}`} 
                  onClick={handleOpenPasswordModal}
                  style={{
                    backgroundColor: isDarkMode ? accentColor : undefined,
                    color: isDarkMode ? '#FFFFFF' : undefined,
                  }}
                >
                  <SecurityIcon />
                  Update Password
                </Button>
              }
            />
            <SettingsRow
              isLast
              label="Two-Factor Authentication"
              description="Add an extra layer of protection to your account"
              isDarkMode={isDarkMode}
              control={
                <Button 
                  className={`${isDarkMode ? styles.darkButton : styles.primaryButton}`}
                  style={{
                    backgroundColor: isDarkMode ? accentColor : undefined,
                    color: isDarkMode ? '#FFFFFF' : undefined,
                  }}
                >
                  Enable 2FA
                </Button>
              }
            />
          </SettingsSection>
        </div>

        {/* Privacy */}
        <div ref={el => sectionRefs.current['privacy'] = el}>
          <SettingsSection id="privacy" icon={<VisibilityIcon />} title="Privacy" isDarkMode={isDarkMode}>
            <SettingsRow
              label="Profile Visibility"
              description="Control who can see your profile information"
              isDarkMode={isDarkMode}
              control={
                <Select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  size="small"
                  className={`${styles.select} ${isDarkMode ? styles.darkSelect : ''}`}
                  MenuProps={{
                    classes: {
                      paper: `${styles.menuPaper} ${isDarkMode ? styles.darkMenuPaper : ''}`,
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  <MenuItem value="public" className={`${styles.menuItem} ${isDarkMode ? styles.darkMenuItem : ''}`}>
                    🌍 Public
                  </MenuItem>
                  <MenuItem value="private" className={`${styles.menuItem} ${isDarkMode ? styles.darkMenuItem : ''}`}>
                    🔒 Private
                  </MenuItem>
                  <MenuItem value="team" className={`${styles.menuItem} ${isDarkMode ? styles.darkMenuItem : ''}`}>
                    👥 Team Only
                  </MenuItem>
                </Select>
              }
            />
            <SettingsRow
              isLast
              label="Activity Status"
              description="Show when you're active to team members"
              isDarkMode={isDarkMode}
              control={
                <CustomSwitch
                  checked={activityStatus}
                  onChange={setActivityStatus}
                />
              }
            />
          </SettingsSection>
        </div>

        {/* Danger Zone */}
        <div ref={el => sectionRefs.current['danger'] = el}>
          <Box className={`${styles.dangerSection} ${isDarkMode ? styles.darkDangerSection : ''}`}>
            <Box className={`${styles.sectionHeader} ${isDarkMode ? styles.darkSectionHeader : ''}`}>
              <Box className={`${styles.dangerIcon} ${isDarkMode ? styles.darkDangerIcon : ''}`}><WarningIcon /></Box>
              <Typography className={`${styles.dangerTitle} ${isDarkMode ? styles.darkDangerTitle : ''}`}>Danger Zone</Typography>
            </Box>
            <Box className={`${styles.dangerCard} ${isDarkMode ? styles.darkDangerCard : ''}`}>
              <Box className={styles.dangerContent}>
                <Box className={`${styles.dangerIconWrapper} ${isDarkMode ? styles.darkDangerIconWrapper : ''}`}>
                  <DeleteForeverIcon />
                </Box>
                <Box>
                  <Typography className={`${styles.dangerLabel} ${isDarkMode ? styles.darkDangerLabel : ''}`}>Delete Account</Typography>
                  <Typography className={`${styles.dangerDescription} ${isDarkMode ? styles.darkDangerDescription : ''}`}>
                    Permanently erase all your data and task history. This action cannot be undone.
                  </Typography>
                </Box>
              </Box>
              <Button 
                className={`${styles.deleteButton} ${isDarkMode ? styles.darkDeleteButton : ''}`}
                onClick={handleOpenDeleteModal}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </Box>
          </Box>
        </div>

        {/* Save Button */}
        <Box className={`${styles.saveSection} ${isDarkMode ? styles.darkSaveSection : ''}`}>
          <Button 
            className={`${isDarkMode ? styles.darkButton : styles.saveButton}`}
            style={{
              backgroundColor: isDarkMode ? accentColor : undefined,
              color: isDarkMode ? '#FFFFFF' : undefined,
            }}
          >
            <CheckCircleIcon />
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Delete Account Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        className={`${styles.deleteModal} ${isDarkMode ? styles.darkDeleteModal : ''}`}
        closeAfterTransition
        BackdropProps={{
          className: `${styles.deleteModalBackdrop} ${isDarkMode ? styles.darkDeleteModalBackdrop : ''}`,
        }}
      >
        <Box className={`${styles.deleteModalContent} ${isDarkMode ? styles.darkDeleteModalContent : ''}`}>
          <Box className={`${styles.deleteModalHeader} ${isDarkMode ? styles.darkDeleteModalHeader : ''}`}>
            <Box className={`${styles.deleteModalIconWrapper} ${isDarkMode ? styles.darkDeleteModalIconWrapper : ''}`}>
              <WarningIcon className={`${styles.deleteModalIcon} ${isDarkMode ? styles.darkDeleteModalIcon : ''}`} />
            </Box>
            <Typography className={`${styles.deleteModalTitle} ${isDarkMode ? styles.darkDeleteModalTitle : ''}`}>Delete Account?</Typography>
            <button 
              className={`${styles.deleteModalClose} ${isDarkMode ? styles.darkDeleteModalClose : ''}`} 
              onClick={handleCloseDeleteModal}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </Box>

          <Typography className={`${styles.deleteModalText} ${isDarkMode ? styles.darkDeleteModalText : ''}`}>
            This action <strong>cannot be undone</strong>. All your data, tasks, projects, and history will be permanently erased.
          </Typography>

          <Box className={styles.deleteModalActions}>
            <Button 
              className={`${styles.deleteModalCancel} ${isDarkMode ? styles.darkDeleteModalCancel : ''}`} 
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </Button>
            <Button 
              className={`${styles.deleteModalConfirm} ${isDarkMode ? styles.darkDeleteModalConfirm : ''}`}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Password Change Modal with Eye Buttons */}
      <Modal
        open={passwordModalOpen}
        onClose={handleClosePasswordModal}
        className={`${styles.passwordModal} ${isDarkMode ? styles.darkPasswordModal : ''}`}
        closeAfterTransition
        BackdropProps={{
          className: `${styles.passwordModalBackdrop} ${isDarkMode ? styles.darkPasswordModalBackdrop : ''}`,
        }}
      >
        <Box className={`${styles.passwordModalContent} ${isDarkMode ? styles.darkPasswordModalContent : ''}`}>
          <Box className={`${styles.passwordModalHeader} ${isDarkMode ? styles.darkPasswordModalHeader : ''}`}>
            <Box className={`${styles.passwordModalIconWrapper} ${isDarkMode ? styles.darkPasswordModalIconWrapper : ''}`}>
              <SecurityIcon className={`${styles.passwordModalIcon} ${isDarkMode ? styles.darkPasswordModalIcon : ''}`} />
            </Box>
            <Typography className={`${styles.passwordModalTitle} ${isDarkMode ? styles.darkPasswordModalTitle : ''}`}>Change Password</Typography>
            <button 
              className={`${styles.passwordModalClose} ${isDarkMode ? styles.darkPasswordModalClose : ''}`} 
              onClick={handleClosePasswordModal}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </Box>

          <Box className={`${styles.passwordModalBody} ${isDarkMode ? styles.darkPasswordModalBody : ''}`}>
            {/* Current Password */}
            <div className={`${styles.passwordField} ${isDarkMode ? styles.darkPasswordField : ''}`}>
              <label className={`${styles.passwordLabel} ${isDarkMode ? styles.darkPasswordLabel : ''}`}>Current Password</label>
              <div className={`${styles.passwordInputWrap} ${isDarkMode ? styles.darkPasswordInputWrap : ''}`}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`${styles.passwordInput} ${passwordErrors.currentPassword ? styles.passwordInputError : ''} ${isDarkMode ? styles.darkPasswordInput : ''}`}
                />
                <button
                  type="button"
                  className={`${styles.passwordEyeBtn} ${isDarkMode ? styles.darkPasswordEyeBtn : ''}`}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
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
            <div className={`${styles.passwordField} ${isDarkMode ? styles.darkPasswordField : ''}`}>
              <label className={`${styles.passwordLabel} ${isDarkMode ? styles.darkPasswordLabel : ''}`}>New Password</label>
              <div className={`${styles.passwordInputWrap} ${isDarkMode ? styles.darkPasswordInputWrap : ''}`}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`${styles.passwordInput} ${passwordErrors.newPassword ? styles.passwordInputError : ''} ${isDarkMode ? styles.darkPasswordInput : ''}`}
                />
                <button
                  type="button"
                  className={`${styles.passwordEyeBtn} ${isDarkMode ? styles.darkPasswordEyeBtn : ''}`}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
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
            <div className={`${styles.passwordField} ${isDarkMode ? styles.darkPasswordField : ''}`}>
              <label className={`${styles.passwordLabel} ${isDarkMode ? styles.darkPasswordLabel : ''}`}>Confirm New Password</label>
              <div className={`${styles.passwordInputWrap} ${isDarkMode ? styles.darkPasswordInputWrap : ''}`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`${styles.passwordInput} ${passwordErrors.confirmPassword ? styles.passwordInputError : ''} ${isDarkMode ? styles.darkPasswordInput : ''}`}
                />
                <button
                  type="button"
                  className={`${styles.passwordEyeBtn} ${isDarkMode ? styles.darkPasswordEyeBtn : ''}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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

          <Box className={`${styles.passwordModalActions} ${isDarkMode ? styles.darkPasswordModalActions : ''}`}>
            <Button 
              className={`${styles.passwordModalCancel} ${isDarkMode ? styles.darkPasswordModalCancel : ''}`} 
              onClick={handleClosePasswordModal}
            >
              Cancel
            </Button>
            <Button 
              className={`${styles.passwordModalConfirm} ${isDarkMode ? styles.darkPasswordModalConfirm : ''}`}
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              style={{
                backgroundColor: isDarkMode ? accentColor : undefined,
                color: isDarkMode ? '#FFFFFF' : undefined,
              }}
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