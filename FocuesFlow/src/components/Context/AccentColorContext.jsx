import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDarkMode } from './DarkModeContext';

const AccentColorContext = createContext();

export const AccentColorProvider = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  
  // Default colors for each mode
  const LIGHT_MODE_DEFAULT = '#885210';
  const DARK_MODE_DEFAULT = '#FBBC00';

  const [accentColor, setAccentColor] = useState(() => {
    // Check localStorage for saved accent color
    const saved = localStorage.getItem('accentColor');
    if (saved) {
      return saved;
    }
    // Default based on current mode
    return isDarkMode ? DARK_MODE_DEFAULT : LIGHT_MODE_DEFAULT;
  });

  // Reset to default when theme mode changes
  useEffect(() => {
    const saved = localStorage.getItem('accentColor');
    const defaultColor = isDarkMode ? DARK_MODE_DEFAULT : LIGHT_MODE_DEFAULT;
    
    // If switching to dark mode and no saved color, use dark default
    if (isDarkMode && !saved) {
      setAccentColor(DARK_MODE_DEFAULT);
      localStorage.setItem('accentColor', DARK_MODE_DEFAULT);
    }
    // If switching to light mode and no saved color, use light default
    else if (!isDarkMode && !saved) {
      setAccentColor(LIGHT_MODE_DEFAULT);
      localStorage.setItem('accentColor', LIGHT_MODE_DEFAULT);
    }
    // If user manually selected a color that matches the other mode's default, reset
    else if (isDarkMode && saved === LIGHT_MODE_DEFAULT) {
      setAccentColor(DARK_MODE_DEFAULT);
      localStorage.setItem('accentColor', DARK_MODE_DEFAULT);
    }
    else if (!isDarkMode && saved === DARK_MODE_DEFAULT) {
      setAccentColor(LIGHT_MODE_DEFAULT);
      localStorage.setItem('accentColor', LIGHT_MODE_DEFAULT);
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('accentColor', accentColor);
    
    // Apply accent color to CSS variables
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-color-rgb', hexToRgb(accentColor));
    
    // Also apply to body for global use
    document.body.style.setProperty('--accent-color', accentColor);
    document.body.style.setProperty('--accent-color-rgb', hexToRgb(accentColor));
    
    console.log('🎨 Accent color changed to:', accentColor);
  }, [accentColor]);

  // Helper function to convert hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return '251, 188, 0'; // Default to amber RGB
  };

  // Function to reset to default based on current mode
  const resetToDefault = () => {
    const defaultColor = isDarkMode ? DARK_MODE_DEFAULT : LIGHT_MODE_DEFAULT;
    setAccentColor(defaultColor);
    localStorage.setItem('accentColor', defaultColor);
  };

  return (
    <AccentColorContext.Provider value={{ 
      accentColor, 
      setAccentColor,
      resetToDefault,
      LIGHT_MODE_DEFAULT,
      DARK_MODE_DEFAULT
    }}>
      {children}
    </AccentColorContext.Provider>
  );
};

export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  if (!context) {
    throw new Error('useAccentColor must be used within an AccentColorProvider');
  }
  return context;
};