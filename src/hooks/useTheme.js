import { useState, useLayoutEffect, useCallback } from 'react';

const getDefaultTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  }
  return 'dark';
};

export const useTheme = () => {
  const [theme, setTheme] = useState(getDefaultTheme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
};
