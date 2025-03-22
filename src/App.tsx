import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-700">
      <div className="fixed top-0 left-0 p-4 text-sm text-muted-foreground">
        Debug: Theme is {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
      </div>
      <ThemeToggle />
      <Hero />
    </div>
  );
}

export default App;