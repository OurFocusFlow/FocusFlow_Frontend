import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Badge,
  Button,
  useMediaQuery,
  useTheme,
  Drawer,
  Collapse,
  SwipeableDrawer,
  Tooltip,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Assignment as TasksIcon,
  Folder as ProjectsIcon,
  CalendarToday as CalendarIcon,
  People as TeamIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Help as SupportIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import Navbar from '../Navbar/Navbar';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'Inbox';
    if (path === '/my-tasks') return 'My Tasks';
    if (path === '/projects') return 'Projects';
    if (path === '/calendar') return 'Calendar';
    if (path === '/team') return 'Team';
    return 'Inbox';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSettingsToggle = () => {
    setOpenSettings(!openSettings);
  };

  const handleNavItemClick = (text, path) => {
    setActiveItem(text);
    if (path) {
      navigate(path);
    }
    if (isMobile || isTablet) {
      setMobileOpen(false);
    }
  };

  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  // Navbar handlers
  const handleSearch = (value) => {
    console.log('Searching for:', value);
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handleProfileClick = (action) => {
    console.log('Profile action:', action);
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  const handleThemeToggle = (mode) => {
    setIsDarkMode(mode);
    console.log('Theme toggled:', mode);
  };

  const navigationItems = [
    { text: 'Inbox', icon: <InboxIcon />, badge: 3, path: '/' },
    { text: 'My Tasks', icon: <TasksIcon />, badge: 12, path: '/my-tasks' },
    { text: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Team', icon: <TeamIcon />, path: '/team' },
  ];

  const bottomItems = [
    { text: 'Settings', icon: <SettingsIcon />, subItems: ['Profile', 'Preferences', 'Notifications'] },
    { text: 'Support', icon: <SupportIcon /> },
  ];

  const userData = {
    name: 'John Doe',
    email: 'john@company.com',
    avatar: 'JD',
    accountType: 'PRO ACCOUNT',
  };

  const notifications = [
    { id: 1, text: 'New task assigned to you', time: '2 min ago', read: false },
    { id: 2, text: 'Project deadline approaching', time: '1 hour ago', read: false },
    { id: 3, text: 'Team member completed a task', time: '3 hours ago', read: true },
    { id: 4, text: 'You have a new message', time: '5 hours ago', read: true },
  ];

  const drawerContent = (
    <Box className={styles.drawerContent}>
      {/* Modern Header with Glass Effect */}
      <Box className={styles.drawerHeader}>
        <Box className={styles.logoWrapper} onClick={() => handleNavItemClick('Inbox', '/')} style={{ cursor: 'pointer' }}>
          <Box className={styles.logoIcon}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#gradient)" />
              <path d="M11 18L16 23L25 13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
          <Box>
            <Typography variant="h6" className={styles.logoText}>
              FocusFlow
            </Typography>
            <Typography variant="caption" className={styles.logoSubtext}>
              Workspace
            </Typography>
          </Box>
        </Box>
        {(isMobile || isTablet) && (
          <IconButton className={styles.closeDrawerButton} onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider className={styles.divider} />

      {/* Navigation with Modern Icons */}
      <List className={styles.navList}>
        {navigationItems.map((item) => (
          <Tooltip key={item.text} title={item.text} placement="right" arrow>
            <ListItem
              className={`${styles.navItem} ${activeItem === item.text ? styles.activeNavItem : ''}`}
              onClick={() => handleNavItemClick(item.text, item.path)}
            >
              <ListItemIcon className={styles.navIcon}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error" className={styles.badge}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                className={styles.navText}
                primaryTypographyProps={{
                  className: styles.navTextPrimary,
                }}
              />
              {activeItem === item.text && (
                <Box className={styles.activeIndicator} />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider className={styles.divider} />

      {/* Modern New Task Button */}
      <Box className={styles.newTaskWrapper}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          className={styles.newTaskButton}
          onClick={() => navigate('/my-tasks')}
        >
          New Task
        </Button>
      </Box>

      <Divider className={styles.divider} />

      {/* Bottom Navigation with Modern Design */}
      <List className={styles.bottomNavList}>
        {bottomItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem
              className={`${styles.navItem} ${activeItem === item.text ? styles.activeNavItem : ''}`}
              onClick={() => {
                if (item.subItems) {
                  handleSettingsToggle();
                } else {
                  handleNavItemClick(item.text);
                }
              }}
            >
              <ListItemIcon className={styles.navIcon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                className={styles.navText}
                primaryTypographyProps={{
                  className: styles.navTextPrimary,
                }}
              />
              {item.subItems && (
                <IconButton size="small" className={styles.expandIcon}>
                  {openSettings ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </ListItem>
            {item.subItems && (
              <Collapse in={openSettings} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      key={subItem}
                      className={styles.subNavItem}
                      onClick={() => handleNavItemClick(subItem)}
                    >
                      <ListItemText 
                        primary={subItem}
                        className={styles.subNavText}
                        primaryTypographyProps={{
                          className: styles.subNavTextPrimary,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Modern User Profile Section */}
      <Box className={styles.userSection}>
        <Divider className={styles.divider} />
        <Box 
          className={styles.userInfo}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Avatar className={styles.avatar}>JD</Avatar>
          <Box className={styles.userText}>
            <Typography variant="body2" className={styles.userName}>
              John Doe
            </Typography>
            <Typography variant="caption" className={styles.userEmail}>
              john@company.com
            </Typography>
          </Box>
          <Box className={styles.userStatus} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className={styles.root}>
      <Box className={styles.layoutContainer}>
        {/* Desktop Sidebar */}
        {isDesktop && (
          <Drawer
            variant="permanent"
            className={styles.desktopDrawer}
            classes={{
              paper: styles.drawerPaper,
            }}
            anchor="left"
          >
            {drawerContent}
          </Drawer>
        )}

        <Box className={styles.contentArea}>
          {/* Navbar */}
          <Box className={styles.navbarWrapper}>
            <Box className={styles.navbarContainer}>
              {(isMobile || isTablet) && (
                <Tooltip title="Open menu" arrow>
                  <IconButton
                    className={styles.menuButton}
                    onClick={handleDrawerToggle}
                    edge="start"
                    aria-label="Open drawer"
                  >
                    <MenuIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Box className={styles.navbarFlex}>
                <Navbar
                  onSearch={handleSearch}
                  user={userData}
                  notifications={notifications}
                  onNotificationClick={handleNotificationClick}
                  onProfileClick={handleProfileClick}
                  onLogout={handleLogout}
                  onThemeToggle={handleThemeToggle}
                  isDarkMode={isDarkMode}
                  showThemeToggle={true}
                  showNotifications={true}
                  showProfile={true}
                />
              </Box>
            </Box>
          </Box>

          {/* Main Content - This is where all pages will render */}
          <Box
            component="main"
            className={`${styles.mainContent} ${isMobile ? styles.mainContentMobile : ''} ${isTablet ? styles.mainContentTablet : ''}`}
          >
            {(isMobile || isTablet) && (
              <SwipeableDrawer
                anchor="left"
                open={mobileOpen}
                onClose={handleCloseDrawer}
                onOpen={() => setMobileOpen(true)}
                className={styles.mobileDrawer}
                classes={{
                  paper: styles.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true,
                }}
                disableBackdropTransition={false}
                disableDiscovery={false}
              >
                {drawerContent}
              </SwipeableDrawer>
            )}
            
            {/* Page Content Container */}
            <Box className={styles.contentContainer}>
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;