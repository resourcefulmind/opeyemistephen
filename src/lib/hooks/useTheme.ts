'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.add(initialTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    // Suppress colour transitions for the instant of the switch so the page doesn't
    // fade through half-states; the theme icon's own cross-fade is exempt in CSS.
    root.classList.add('theme-switching');
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    void root.offsetWidth;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove('theme-switching'))
    );
    localStorage.setItem('theme', theme);
    
    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('themeChange'));
    return () => cancelAnimationFrame(frame);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, mounted };
} 