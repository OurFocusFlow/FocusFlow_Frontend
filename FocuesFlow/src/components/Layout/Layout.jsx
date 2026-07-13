import React, { useState } from 'react';
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
  AppBar,
  Toolbar,
  Collapse,
  SwipeableDrawer,
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
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from '@mui/icons-material';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [activeItem, setActiveItem] = useState('Inbox');
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSettingsToggle = () => {
    setOpenSettings(!openSettings);
  };

  const handleNavItemClick = (text) => {
    setActiveItem(text);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleCloseDrawer = () => {
    setMobileOpen(false);
  };

  const navigationItems = [
    { text: 'Inbox', icon: <InboxIcon />, badge: 3 },
    { text: 'My Tasks', icon: <TasksIcon />, badge: 12 },
    { text: 'Projects', icon: <ProjectsIcon /> },
    { text: 'Calendar', icon: <CalendarIcon /> },
    { text: 'Team', icon: <TeamIcon /> },
  ];

  const bottomItems = [
    { text: 'Settings', icon: <SettingsIcon />, subItems: ['Profile', 'Preferences', 'Notifications'] },
    { text: 'Support', icon: <SupportIcon /> },
  ];

  const drawerContent = (
    <Box className={styles.drawerContent}>
      {/* Header */}
      <Box className={styles.drawerHeader}>
        <Box className={styles.logoWrapper}>
          <Box className={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
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
          <Box>
            <Typography variant="h6" className={styles.logoText}>
              FocusFlow
            </Typography>
            <Typography variant="caption" className={styles.logoSubtext}>
              Personal Workspace
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton className={styles.closeDrawerButton} onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider className={styles.divider} />

      {/* Navigation */}
      <List className={styles.navList}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.text}
            className={`${styles.navItem} ${activeItem === item.text ? styles.activeNavItem : ''}`}
            onClick={() => handleNavItemClick(item.text)}
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
          </ListItem>
        ))}
      </List>

      <Divider className={styles.divider} />

      {/* New Task Button */}
      <Box className={styles.newTaskWrapper}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          className={styles.newTaskButton}
        >
          New Task
        </Button>
      </Box>

      <Divider className={styles.divider} />

      {/* Bottom Navigation */}
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

      {/* User Avatar at bottom */}
      <Box className={styles.userSection}>
        <Divider className={styles.divider} />
        <Box className={styles.userInfo}>
          <Avatar className={styles.avatar}>JD</Avatar>
          <Box className={styles.userText}>
            <Typography variant="body2" className={styles.userName}>
              John Doe
            </Typography>
            <Typography variant="caption" className={styles.userEmail}>
              john@company.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className={styles.root}>
      {/* Mobile App Bar */}
      {(isMobile || isTablet) && (
        <AppBar position="fixed" className={styles.appBar}>
          <Toolbar className={styles.toolbar}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              className={styles.menuButton}
              aria-label="Open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Box className={styles.mobileLogo}>
              <Box className={styles.mobileLogoIcon}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
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
              <Typography variant="h6" className={styles.mobileLogoText}>
                FocusFlow
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Badge badgeContent={3} color="error" className={styles.mobileBadge}>
              <InboxIcon className={styles.mobileIcon} />
            </Badge>
            <Avatar className={styles.mobileAvatar}>JD</Avatar>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer - Swipeable for better UX */}
      {isMobile && (
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

      {/* Tablet Drawer */}
      {isTablet && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleCloseDrawer}
          className={styles.tabletDrawer}
          classes={{
            paper: styles.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop Drawer - Permanent */}
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

      {/* Main Content */}
      <Box
        component="main"
        className={`${styles.mainContent} ${isMobile ? styles.mainContentMobile : ''} ${isTablet ? styles.mainContentTablet : ''} ${isDesktop ? styles.mainContentDesktop : ''}`}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;