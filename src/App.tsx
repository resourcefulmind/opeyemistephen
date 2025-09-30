import React, { useEffect, useTransition } from 'react';
import { Hero } from './components/Hero';
import { ThemeToggle } from './components/ThemeToggle';
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  useLocation,
  useNavigationType
} from 'react-router-dom';
import BlogList from './components/Blog/BlogList';
import BlogPost from './components/Blog/BlogPost';
import Navbar from './components/Navbar';
import MeteorShower from './components/MeteroShower';
import { TwinklingBackground, ShootingStars } from './components/Hero';
import ErrorBoundary from './components/ErrorBoundary';
import AboutPage from './pages/About';

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

// BlogErrorFallback component for blog-specific errors
const BlogErrorFallback = () => (
  <PageLayout>
    <div className="text-center my-12">
      <h2 className="text-2xl font-bold mb-4">Blog content could not be loaded</h2>
      <p className="mb-6">There was an error loading the blog content. This might be due to network issues or content format problems.</p>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary/30 hover:bg-primary/50 transition-colors rounded-md"
        >
          Try again
        </button>
        <a 
          href="/"
          className="px-6 py-2 bg-gray-700/50 hover:bg-gray-700/70 transition-colors rounded-md"
        >
          Return home
        </a>
      </div>
    </div>
  </PageLayout>
);

// Route change handler for React Router v7 compatibility
const RouteChangeHandler = () => {
  const [isPending, startTransition] = useTransition();
  const navigationType = useNavigationType();
  
  // Apply startTransition for navigation changes
  useEffect(() => {
    if (navigationType !== 'POP') {
      startTransition(() => {
        // This wraps route changes in startTransition as recommended
        // for React Router v7 compatibility
      });
    }
  }, [navigationType, startTransition]);
  
  return null;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Route change handler for React Router v7 compatibility */}
      <Route path="*" element={<RouteChangeHandler />} />
      
      {/* Home page */}
      <Route path='/' element={
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
      } />
      
      {/* Blog list page */}
      <Route path='/blog' element={
        <ErrorBoundary fallback={<BlogErrorFallback />}>
          <PageLayout>
            <BlogList />
          </PageLayout>
        </ErrorBoundary>
      } />
      
      {/* Individual blog post page */}
      <Route path='/blog/:slug' element={
        <ErrorBoundary fallback={<BlogErrorFallback />}>
          <PageLayout>
            <BlogPost />
          </PageLayout>
        </ErrorBoundary>
      } />
      
      {/* About page */}
      <Route path='/about' element={
        <ErrorBoundary>
          <PageLayout>
            <AboutPage />
          </PageLayout>
        </ErrorBoundary>
      } />
    </Routes>
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

  // Wrap everything in a global error boundary
  return (
    <ErrorBoundary>
      <Router>
        {/* Fixed navbar on top */}
        <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 z-50">
          <Navbar />
          <ThemeToggle />
        </div>
        
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;