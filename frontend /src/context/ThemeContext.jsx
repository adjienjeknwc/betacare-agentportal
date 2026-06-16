// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Read baseline configuration state from localStorage to persist theme across updates
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('crm-portal-theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('crm-portal-theme', theme);
  }, [theme]);

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark-theme-mode' : 'light-theme-mode'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const usePortalTheme = () => useContext(ThemeContext);