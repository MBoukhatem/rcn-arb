// Contexte de thème : clair/sombre, persistance localStorage, classe `dark` sur <html>.
import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(null);

// Détermine le thème initial : localStorage prioritaire, sinon préférence système.
const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  const prefersDark = window.matchMedia?.(
    '(prefers-color-scheme: dark)',
  ).matches;
  return prefersDark ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Applique la classe `dark` au <html> et persiste le choix.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Bascule clair <-> sombre.
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = { theme, toggleTheme, isDark: theme === 'dark' };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
