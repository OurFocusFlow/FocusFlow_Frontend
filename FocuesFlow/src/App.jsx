import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from '../src/components/Home/Home'; 
import Login from '../src/components/Login/Login';
import Signup from '../src/components/Signup/Signup';  
import NotFound from '../src/components/NotFound/NotFound';
import Layout from '../src/components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MyTasks from './components/MyTasks/MyTasks';
import Profile from './components/Profile/Profile';
import Dashboard from './components/Dashboard/Dashboard';

import './App.css';  

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B3832', // Brown Surface
      light: '#4A382E',
      dark: '#33231D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#885210', // Accent Orange
      light: '#A66D2A',
      dark: '#6B3F0C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAF5F2', // Cream BG
      paper: '#FDF8F5', // Cream Light
    },
    text: {
      primary: '#33231D', // Dark Brown
      secondary: '#7E7471', // Text Muted
    },
    divider: '#E6E2DF', // Gray Card
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#059669',
    },
    warning: {
      main: '#d97706',
    },
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
      color: '#33231D',
      fontWeight: 800,
    },
    h2: {
      color: '#33231D',
      fontWeight: 700,
    },
    h3: {
      color: '#33231D',
      fontWeight: 600,
    },
    h4: {
      color: '#33231D',
      fontWeight: 600,
    },
    h5: {
      color: '#33231D',
      fontWeight: 500,
    },
    h6: {
      color: '#33231D',
      fontWeight: 500,
    },
    body1: {
      color: '#7E7471',
    },
    body2: {
      color: '#7E7471',
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
          boxShadow: '0 4px 24px rgba(75, 56, 50, 0.25)',
          '&:hover': {
            boxShadow: '0 8px 28px rgba(75, 56, 50, 0.35)',
          },
        },
        containedPrimary: {
          backgroundColor: '#4B3832',
          '&:hover': {
            backgroundColor: '#4A382E',
          },
        },
        containedSecondary: {
          backgroundColor: '#885210',
          '&:hover': {
            backgroundColor: '#A66D2A',
          },
        },
        outlined: {
          borderColor: '#E6E2DF',
          color: '#33231D',
          '&:hover': {
            borderColor: '#885210',
            backgroundColor: 'rgba(136, 82, 16, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(253, 248, 245, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 24px rgba(51, 35, 29, 0.06)',
          borderBottom: '1px solid rgba(230, 226, 223, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(253, 248, 245, 0.92)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(230, 226, 223, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(230, 226, 223, 0.3)',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(51, 35, 29, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FAF5F2',
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#E6E2DF',
            },
            '&:hover fieldset': {
              borderColor: '#E6E2DF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#885210',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#7E7471',
            '&.Mui-focused': {
              color: '#885210',
            },
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
          backgroundColor: '#885210',
          color: '#FFFFFF',
        },
        colorSecondary: {
          backgroundColor: '#4B3832',
          color: '#FFFFFF',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#885210',
          color: '#FFFFFF',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E6E2DF',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Landing Page - No Layout (Public) */}
          <Route path="/" element={<Home />} />
          
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
          
          {/* 404 Not Found - No Layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;