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

import './App.css';  

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
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
  },
  shape: {
    borderRadius: 14,
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
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <Layout>
                <Home />
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
          
          {/* 404 Not Found - No Layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;