// Layout.jsx - Updated with dark mode support
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTasks } from '../Context/TaskContext';
import { useDarkMode } from '../Context/DarkModeContext';
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
  Dashboard as DashboardIcon,
  Assignment as TasksIcon,
  Folder as ProjectsIcon,
  CalendarToday as CalendarIcon,
  People as TeamIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Help as SupportIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import Navbar from '../Navbar/Navbar';
import CreateTaskModal from '../CreateTaskModal/CreateTaskModal';
import ToastNotification from '../ToastNotification/ToastNotification';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Safe context usage - with error handling
  let taskContext;
  try {
    taskContext = useTasks();
  } catch (error) {
    taskContext = {
      getTaskCount: () => 0,
      getPendingCount: () => 0,
      getCompletedCount: () => 0,
      addTask: () => {},
    };
  }
  
  const { getTaskCount, getPendingCount, addTask } = taskContext;
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if current page is Profile, Settings, or Support (hide navbar on these pages)
  const isProfilePage = location.pathname === '/profile';
  const isSettingsPage = location.pathname === '/settings';
  const isSupportPage = location.pathname === '/support';
  const hideNavbar = isProfilePage || isSettingsPage || isSupportPage;

  // Get active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/home') return 'Home';
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/my-tasks') return 'My Tasks';
    if (path === '/projects') return 'Projects';
    if (path === '/calendar') return 'Calendar';
    if (path === '/team') return 'Team';
    if (path === '/support') return 'Support';
    if (path === '/profile') return 'Profile';
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
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

  // ==================== MODAL HANDLERS ====================
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setToast(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitting(false);
    setToast(null);
  };

  const showToast = (type, message, title) => {
    setToast({ type, message, title });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleSaveTask = (taskData) => {
    let hasError = false;
    let errorMessage = '';
    let errorTitle = '';

    const categories = taskData.categories || [taskData.category || 'General'];
    const category = categories[0] || 'General';

    if (!taskData.title.trim()) {
      hasError = true;
      errorTitle = 'Missing Title';
      errorMessage = 'Please enter a task title to continue.';
    } else if (!taskData.description.trim()) {
      hasError = true;
      errorTitle = 'Missing Description';
      errorMessage = 'Please provide a description for the task.';
    } else if (!taskData.dueDate) {
      hasError = true;
      errorTitle = 'Missing Due Date';
      errorMessage = 'Please select a due date for the task.';
    } else if (taskData.dueDate < new Date().toISOString().split('T')[0]) {
      hasError = true;
      errorTitle = 'Invalid Due Date';
      errorMessage = 'Due date cannot be in the past. Please select a future date.';
    }

    if (hasError) {
      showToast('error', errorMessage, errorTitle);
      return;
    }

    setIsSubmitting(true);
    
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      dueSort: new Date(taskData.dueDate + 'T00:00:00').getTime(),
      priority: taskData.priority || 'Medium',
      status: 'Pending',
      category: category,
      completed: false,
      assignees: ['You'],
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      attachments: 0,
      comments: 0,
    };
    
    addTask(newTask);
    
    showToast(
      'success',
      `Task "${taskData.title}" has been created successfully.`,
      'Task Created!'
    );

    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitting(false);
    }, 1000);
  };

  // ==================== NEW TASK HANDLER ====================
  const handleNewTaskClick = () => {
    if (location.pathname === '/my-tasks') {
      handleOpenModal();
    } else {
      setActiveItem('My Tasks');
      navigate('/my-tasks');
      setTimeout(() => {
        handleOpenModal();
      }, 300);
    }
    
    if (isMobile || isTablet) {
      setMobileOpen(false);
    }
  };

  // ==================== SETTINGS HANDLER ====================
  const handleSettingsClick = (section) => {
    setActiveItem('Settings');
    setOpenSettings(false);
    if (section) {
      navigate(`/settings#${section}`);
    } else {
      navigate('/settings');
    }
    if (isMobile || isTablet) {
      setMobileOpen(false);
    }
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
    if (action === 'open' || action === 'click') {
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleThemeToggle = (mode) => {
    toggleDarkMode();
  };

  const navigationItems = [
    { text: 'Home', icon: <HomeIcon />, badge: 0, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, badge: 0, path: '/dashboard' },
    { 
      text: 'My Tasks', 
      icon: <TasksIcon />, 
      badge: getPendingCount ? getPendingCount() : 0,
      path: '/my-tasks' 
    },
    { text: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Team', icon: <TeamIcon />, path: '/team' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const bottomItems = [
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      subItems: [
        { text: 'Appearance', section: 'appearance' },
        { text: 'Language', section: 'language' },
        { text: 'Notifications', section: 'notifications' },
        { text: 'Security', section: 'security' },
        { text: 'Danger Zone', section: 'danger' },
      ]
    },
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
        <Box className={styles.logoWrapper} onClick={() => handleNavItemClick('Home', '/')} style={{ cursor: 'pointer' }}>
          <Box className={styles.logoIcon}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill={isDarkMode ? "#FBBC00" : "url(#gradient)"} />
              <path d="M11 18L16 23L25 13" stroke={isDarkMode ? "#000000" : "white"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {!isDarkMode && (
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="36" y2="36">
                    <stop offset="0%" stopColor="#885210" />
                    <stop offset="100%" stopColor="#4B3832" />
                  </linearGradient>
                </defs>
              )}
            </svg>
          </Box>
          <Box>
            <Typography variant="h6" className={styles.logoText}>
              BrewTask
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
                {item.badge > 0 ? (
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
          onClick={handleNewTaskClick}
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
                if (item.text === 'Settings') {
                  handleSettingsToggle();
                } else if (item.text === 'Support') {
                  handleNavItemClick('Support', '/support');
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
                      key={subItem.text}
                      className={styles.subNavItem}
                      onClick={() => {
                        handleSettingsClick(subItem.section);
                      }}
                    >
                      <ListItemText 
                        primary={subItem.text}
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
          onClick={() => handleNavItemClick('Profile', '/profile')}
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
          {/* Navbar - Hide on Profile, Settings, and Support Pages */}
          {!hideNavbar && (
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
          )}

          {/* Show only menu icon on Profile/Settings/Support page for mobile/tablet */}
          {hideNavbar && (isMobile || isTablet) && (
            <Box className={styles.profileNavbarWrapper}>
              <Box className={styles.profileNavbarContainer}>
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
                <Box className={styles.profileLogo}>
                  <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                    <rect width="36" height="36" rx="10" fill={isDarkMode ? "#FBBC00" : "url(#gradient)"} />
                    <path d="M11 18L16 23L25 13" stroke={isDarkMode ? "#000000" : "white"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {!isDarkMode && (
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="36" y2="36">
                          <stop offset="0%" stopColor="#885210" />
                          <stop offset="100%" stopColor="#4B3832" />
                        </linearGradient>
                      </defs>
                    )}
                  </svg>
                  <Typography variant="h6" className={styles.profileLogoText}>
                    BrewTask
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Main Content */}
          <Box
            component="main"
            className={`${styles.mainContent} ${isMobile ? styles.mainContentMobile : ''} ${isTablet ? styles.mainContentTablet : ''} ${hideNavbar ? styles.mainContentFullWidth : ''}`}
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
            <Box className={`${styles.contentContainer} ${hideNavbar ? styles.contentContainerFullWidth : ''}`}>
              {children}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        isSubmitting={isSubmitting}
      />

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          title={toast.title}
          onClose={() => setToast(null)}
        />
      )}
    </Box>
  );
};

export default Layout;