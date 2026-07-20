import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const DarkModeContext = createContext(undefined);

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      console.log('📦 Loaded from localStorage:', saved);
      return saved === 'true';
    }
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('🌓 System prefers dark:', systemPrefersDark);
    return systemPrefersDark;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('darkMode', String(isDarkMode));
    console.log('💾 Saved to localStorage:', isDarkMode);

    // Apply to document
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      console.log('🌙 Applied dark mode to document');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-mode');
      console.log('☀️ Applied light mode to document');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    console.log('🔘 toggleDarkMode called, current:', isDarkMode);
    setIsDarkMode(prev => {
      const newValue = !prev;
      console.log('📊 Setting dark mode to:', newValue);
      return newValue;
    });
  }, [isDarkMode]);

  // Log on every render to track updates
  console.log('🔄 DarkModeProvider rendering, isDarkMode:', isDarkMode);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};