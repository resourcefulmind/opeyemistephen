import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { ThemeToggle } from './components/ThemeToggle';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogList from './components/Blog/BlogList';
import Navbar from './components/Navbar';
import MeteorShower from './components/MeteroShower';
import { TwinklingBackground, ShootingStars } from './components/Hero';

// Layout component to handle non-Hero pages
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 bg-background">
        <TwinklingBackground />
        <ShootingStars />
        <MeteorShower />
        <div className="nebula nebula-left" />
        <div className="nebula nebula-right" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_100%)] animate-float dark:opacity-100 light:opacity-30" />
      </div>
      
      {/* Content with padding for navbar */}
      <div className="pt-24 px-6 relative z-10">
        {children}
      </div>
    </div>
  );
};

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
    <Router>
      {/* Fixed navbar on top */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 z-50">
        <Navbar />
        <ThemeToggle />
      </div>
      
      <Routes>
        {/* Hero page doesn't need extra padding */}
        <Route path='/' element={<Hero />} />
        
        {/* Other pages need the PageLayout */}
        <Route path='/blog' element={
          <PageLayout>
            <BlogList />
          </PageLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;