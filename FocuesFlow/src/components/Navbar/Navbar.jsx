import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../Context/DarkModeContext';
import { useAccentColor } from '../Context/AccentColorContext';
import styles from './Navbar.module.css';

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

const Navbar = ({
  onSearch,
  user,
  notifications,
  onNotificationClick,
  onProfileClick,
  onLogout,
  onThemeToggle,
  isDarkMode: propIsDarkMode,
  showThemeToggle = true,
  showNotifications = true,
  showProfile = true,
  className = '',
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Use dark mode context
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  // Use accent color context
  const { accentColor } = useAccentColor();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Guard against the handler firing more than once per user click
  const themeToggleLockRef = useRef(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Logging out...');
      navigate('/login');
    }
    handleProfileMenuClose();
  };

  // Theme toggle handler - switches theme when clicked
  const handleThemeToggle = (event) => {
    if (event) {
      event.stopPropagation();
    }

    if (themeToggleLockRef.current) {
      return;
    }
    themeToggleLockRef.current = true;

    toggleDarkMode();

    if (onThemeToggle) {
      onThemeToggle(!isDarkMode);
    }

    setTimeout(() => {
      themeToggleLockRef.current = false;
    }, 0);
  };

  const handleProfileNavigation = () => {
    handleProfileMenuClose();
    navigate('/profile');
    if (onProfileClick) {
      onProfileClick('navigate');
    }
  };

  const handleSettingsNavigation = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  const handleSupportNavigation = () => {
    handleProfileMenuClose();
    navigate('/support');
  };

  const menuItems = [
    {
      icon: <PersonIcon />,
      text: 'Profile',
      action: handleProfileNavigation
    },
    {
      icon: <SettingsIcon />,
      text: 'Settings',
      action: handleSettingsNavigation
    },
    {
      icon: <HelpIcon />,
      text: 'Support',
      action: handleSupportNavigation
    },
  ];

  const userData = user || {
    name: 'Alex Rivera',
    email: 'alex@company.com',
    avatar: 'AR',
    accountType: 'PRO ACCOUNT',
  };

  const notificationData = notifications || [
    { id: 1, text: 'New task assigned to you', time: '2 min ago', read: false },
    { id: 2, text: 'Project deadline approaching', time: '1 hour ago', read: false },
    { id: 3, text: 'Team member completed a task', time: '3 hours ago', read: true },
    { id: 4, text: 'You have a new message', time: '5 hours ago', read: true },
  ];

  const unreadCount = notificationData.filter(n => !n.read).length;

  // Convert accent color to RGB for CSS variables
  const accentRgb = hexToRgb(accentColor);

  return (
    <Box 
      className={`${styles.navbar} ${className}`}
      style={{
        '--accent-color': accentColor,
        '--accent-rgb': accentRgb,
      }}
    >
      <Box className={styles.navbarContent}>
        {/* Left Section - Search */}
        <Box className={styles.leftSection}>
          <TextField
            placeholder={isMobile ? "Search..." : "Search tasks or files..."}
            value={searchValue}
            onChange={handleSearchChange}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            className={`${styles.searchField} ${isMobile ? styles.searchFieldMobile : ''}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className={styles.searchIcon} />
                </InputAdornment>
              ),
              className: styles.searchInput,
              placeholder: isMobile ? "Search..." : "Search tasks or files...",
            }}
          />
        </Box>

        {/* Right Section - Actions & Profile */}
        <Box className={styles.rightSection}>
          {/* Notifications */}
          {showNotifications && (
            <Tooltip title="Notifications" arrow>
              <IconButton
                className={styles.iconButton}
                onClick={handleNotificationOpen}
                size={isMobile ? "small" : "medium"}
              >
                <Badge badgeContent={unreadCount} color="error" className={styles.notificationBadge}>
                  <NotificationsIcon className={styles.icon} />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* Theme Toggle - Switches theme when clicked */}
          {showThemeToggle && (
            <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
              <IconButton
                className={`${styles.iconButton} ${styles.themeToggleBtn}`}
                onClick={handleThemeToggle}
                size={isMobile ? "small" : "medium"}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(var(--accent-rgb), 0.25)' : 'rgba(var(--accent-rgb), 0.08)',
                  },
                  color: isDarkMode ? 'var(--accent-color)' : '#6A6255',
                }}
              >
                {isDarkMode ? (
                  <LightModeIcon className={styles.icon} />
                ) : (
                  <DarkModeIcon className={styles.icon} />
                )}
              </IconButton>
            </Tooltip>
          )}

          {/* User Profile */}
          {showProfile && (
            <Box className={`${styles.profileSection} ${isMobile ? styles.profileSectionMobile : ''}`} onClick={handleProfileMenuOpen}>
              <Box className={styles.avatarWrapper}>
                <Avatar 
                  className={styles.avatar}
                  style={{
                    background: accentColor,
                    color: isDarkMode ? '#000000' : '#FFFFFF',
                  }}
                >
                  {userData.avatar}
                </Avatar>
                {userData.accountType === 'PRO ACCOUNT' && (
                  <Box className={styles.proBadge} style={{ background: accentColor }}>
                    <StarIcon className={styles.proStarIcon} />
                  </Box>
                )}
              </Box>

              {!isMobile && (
                <Box className={styles.userInfo}>
                  <Box className={styles.userNameWrapper}>
                    <Typography variant="body1" className={styles.userName}>
                      {userData.name}
                    </Typography>
                    {userData.accountType === 'PRO ACCOUNT' && (
                      <Chip
                        label="PRO"
                        size="small"
                        className={styles.proChip}
                        icon={<StarIcon className={styles.chipStarIcon} />}
                        style={{ background: accentColor, color: isDarkMode ? '#000000' : '#FFFFFF' }}
                      />
                    )}
                  </Box>
                  {!isTablet && (
                    <Typography variant="caption" className={styles.userEmail}>
                      {userData.email}
                    </Typography>
                  )}
                </Box>
              )}

              {!isMobile && (
                <KeyboardArrowDownIcon className={styles.dropdownIcon} />
              )}
            </Box>
          )}

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            className={styles.profileMenu}
            classes={{
              paper: styles.profileMenuPaper,
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box className={styles.menuHeader}>
              <Avatar 
                className={styles.menuAvatar}
                style={{ background: accentColor, color: isDarkMode ? '#000000' : '#FFFFFF' }}
              >
                {userData.avatar}
              </Avatar>
              <Box>
                <Typography variant="body1" className={styles.menuUserName}>
                  {userData.name}
                </Typography>
                <Typography variant="caption" className={styles.menuUserEmail}>
                  {userData.email}
                </Typography>
                {userData.accountType === 'PRO ACCOUNT' && (
                  <Chip
                    label="PRO ACCOUNT"
                    size="small"
                    className={styles.menuProChip}
                    icon={<CheckCircleIcon className={styles.menuProIcon} />}
                    style={{ background: accentColor, color: isDarkMode ? '#000000' : '#FFFFFF' }}
                  />
                )}
              </Box>
            </Box>

            <Divider className={styles.menuDivider} />

            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                onClick={item.action}
                className={styles.menuItem}
              >
                <ListItemIcon className={styles.menuItemIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} className={styles.menuItemText} />
              </MenuItem>
            ))}

            <Divider className={styles.menuDivider} />

            <MenuItem onClick={handleLogout} className={`${styles.menuItem} ${styles.logoutMenuItem}`}>
              <ListItemIcon className={styles.menuItemIcon}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" className={styles.menuItemText} />
            </MenuItem>
          </Menu>

          {/* Notifications Dropdown */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            className={styles.notificationMenu}
            classes={{
              paper: styles.notificationMenuPaper,
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box className={styles.notificationHeader}>
              <Typography variant="h6" className={styles.notificationTitle}>
                Notifications
              </Typography>
              <Button
                size="small"
                className={styles.markAllRead}
                onClick={() => {
                  console.log('Mark all as read');
                  if (onNotificationClick) {
                    onNotificationClick('markAllRead');
                  }
                }}
              >
                Mark all as read
              </Button>
            </Box>

            <Divider className={styles.notificationDivider} />

            {notificationData.map((notification) => (
              <MenuItem
                key={notification.id}
                className={`${styles.notificationItem} ${!notification.read ? styles.unreadNotification : ''}`}
                onClick={() => {
                  console.log('Notification clicked:', notification.id);
                  if (onNotificationClick) {
                    onNotificationClick(notification);
                  }
                  handleNotificationClose();
                }}
              >
                <Box className={styles.notificationContent}>
                  <Typography variant="body2" className={styles.notificationText}>
                    {notification.text}
                  </Typography>
                  <Typography variant="caption" className={styles.notificationTime}>
                    {notification.time}
                  </Typography>
                </Box>
                {!notification.read && (
                  <Box className={styles.unreadDot} />
                )}
              </MenuItem>
            ))}

            <Divider className={styles.notificationDivider} />

            <Box className={styles.notificationFooter}>
              <Button
                fullWidth
                className={styles.viewAllButton}
                onClick={() => {
                  console.log('View all notifications');
                  if (onNotificationClick) {
                    onNotificationClick('viewAll');
                  }
                  handleNotificationClose();
                }}
              >
                View all notifications
              </Button>
            </Box>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;