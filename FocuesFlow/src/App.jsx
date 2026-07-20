import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TaskProvider } from './components/Context/TaskContext';
import { ProjectProvider } from './components/Context/ProjectContext';
import { DarkModeProvider, useDarkMode } from './components/Context/DarkModeContext';
import Home from '../src/components/Home/Home';
import Login from '../src/components/Login/Login';
import Signup from '../src/components/Signup/Signup';
import NotFound from '../src/components/NotFound/NotFound';
import Layout from '../src/components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MyTasks from './components/MyTasks/MyTasks';
import Profile from './components/Profile/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import ForgotPassword from './components/ForgetPassword/ForgetPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Verification from './components/VerificationComponent/VerificationComponent';
import Calendar from './components/Calendar/Calendar';
import Projects from './components/Projects/Projects';
import ProjectDetails from './components/ProjectDetails/ProjectDetails';
import Settings from './components/Settings/Settings';
import Support from './components/Support/Support';
import './App.css';
import './darkMode.css';

// Create theme based on dark mode
const createAppTheme = (isDarkMode) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: isDarkMode ? '#FBBC00' : '#4B3832',
      light: isDarkMode ? '#E2A900' : '#4A382E',
      dark: isDarkMode ? '#E2A900' : '#33231D',
      contrastText: isDarkMode ? '#000000' : '#FFFFFF',
    },
    secondary: {
      main: isDarkMode ? '#FBBC00' : '#885210',
      light: isDarkMode ? '#E2A900' : '#A66D2A',
      dark: isDarkMode ? '#E2A900' : '#6B3F0C',
      contrastText: isDarkMode ? '#000000' : '#FFFFFF',
    },
    background: {
      default: isDarkMode ? '#000000' : '#FAF5F2',
      paper: isDarkMode ? '#111111' : '#FDF8F5',
    },
    text: {
      primary: isDarkMode ? '#FFFFFF' : '#33231D',
      secondary: isDarkMode ? '#6A6255' : '#7E7471',
    },
    divider: isDarkMode ? '#383B40' : '#E6E2DF',
    error: { main: '#dc2626' },
    success: { main: '#059669' },
    warning: { main: '#d97706' },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      color: isDarkMode ? '#FFFFFF' : '#33231D',
      fontWeight: 800,
    },
    h2: {
      color: isDarkMode ? '#FFFFFF' : '#33231D',
      fontWeight: 700,
    },
    h3: {
      color: isDarkMode ? '#FFFFFF' : '#33231D',
      fontWeight: 600,
    },
    h4: {
      color: isDarkMode ? '#FFFFFF' : '#33231D',
      fontWeight: 600,
    },
    h5: {
      color: isDarkMode ? '#FFFFFF' : '#33231D',
      fontWeight: 500,
    },
    h6: {
      color: isDarkMode ? '#FFFFFF' : '#33231D',
      fontWeight: 500,
    },
    body1: {
      color: isDarkMode ? '#6A6255' : '#7E7471',
    },
    body2: {
      color: isDarkMode ? '#6A6255' : '#7E7471',
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: isDarkMode 
            ? '0 4px 24px rgba(251, 188, 0, 0.15)' 
            : '0 4px 24px rgba(75, 56, 50, 0.25)',
          '&:hover': {
            boxShadow: isDarkMode 
              ? '0 8px 28px rgba(251, 188, 0, 0.25)' 
              : '0 8px 28px rgba(75, 56, 50, 0.35)',
          },
        },
        containedPrimary: {
          backgroundColor: isDarkMode ? '#FBBC00' : '#4B3832',
          color: isDarkMode ? '#000000' : '#FFFFFF',
          '&:hover': {
            backgroundColor: isDarkMode ? '#E2A900' : '#4A382E',
          },
        },
        containedSecondary: {
          backgroundColor: isDarkMode ? '#FBBC00' : '#885210',
          color: isDarkMode ? '#000000' : '#FFFFFF',
          '&:hover': {
            backgroundColor: isDarkMode ? '#E2A900' : '#A66D2A',
          },
        },
        outlined: {
          borderColor: isDarkMode ? '#383B40' : '#E6E2DF',
          color: isDarkMode ? '#FFFFFF' : '#33231D',
          '&:hover': {
            borderColor: isDarkMode ? '#FBBC00' : '#885210',
            backgroundColor: isDarkMode 
              ? 'rgba(251, 188, 0, 0.08)' 
              : 'rgba(136, 82, 16, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: isDarkMode 
            ? 'rgba(0, 0, 0, 0.85)' 
            : 'rgba(253, 248, 245, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: isDarkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.5)' 
            : '0 4px 24px rgba(51, 35, 29, 0.06)',
          borderBottom: isDarkMode 
            ? '1px solid rgba(56, 59, 64, 0.3)' 
            : '1px solid rgba(230, 226, 223, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: isDarkMode 
            ? 'rgba(0, 0, 0, 0.92)' 
            : 'rgba(253, 248, 245, 0.92)',
          backdropFilter: 'blur(20px)',
          borderRight: isDarkMode 
            ? '1px solid rgba(56, 59, 64, 0.3)' 
            : '1px solid rgba(230, 226, 223, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: isDarkMode 
            ? 'rgba(17, 17, 17, 0.9)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(56, 59, 64, 0.3)' 
            : '1px solid rgba(230, 226, 223, 0.3)',
          borderRadius: 16,
          boxShadow: isDarkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.5)' 
            : '0 4px 24px rgba(51, 35, 29, 0.06)',
          transition: 'all 0.5s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: isDarkMode ? '#1A1A1A' : '#FAF5F2',
            borderRadius: 12,
            '& fieldset': {
              borderColor: isDarkMode ? '#383B40' : '#E6E2DF',
            },
            '&:hover fieldset': {
              borderColor: isDarkMode ? '#383B40' : '#E6E2DF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FBBC00',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: isDarkMode ? '#6A6255' : '#7E7471',
            '&.Mui-focused': {
              color: '#FBBC00',
            },
          },
          '& .MuiInputBase-input': {
            color: isDarkMode ? '#FFFFFF' : '#33231D',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 600,
        },
        colorPrimary: {
          backgroundColor: '#FBBC00',
          color: '#000000',
        },
        colorSecondary: {
          backgroundColor: isDarkMode ? '#1A1A1A' : '#4B3832',
          color: isDarkMode ? '#FFFFFF' : '#FFFFFF',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FBBC00',
          color: '#000000',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: isDarkMode ? '#383B40' : '#E6E2DF',
        },
      },
    },
  },
});

// AppContent component to use dark mode context
const AppContent = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // Memoize the theme to prevent unnecessary re-renders
  const theme = React.useMemo(() => createAppTheme(isDarkMode), [isDarkMode]);

  console.log('🔄 AppContent rendering with dark mode:', isDarkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-tasks" element={
            <ProtectedRoute>
              <Layout>
                <MyTasks />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Layout>
                <Calendar />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <Layout>
                <Projects />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/project/:id" element={
            <ProtectedRoute>
              <Layout>
                <ProjectDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute>
              <Layout>
                <Support />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <TaskProvider>
      <ProjectProvider>
        <DarkModeProvider>
          <AppContent />
        </DarkModeProvider>
      </ProjectProvider>
    </TaskProvider>
  );
}

export default App;