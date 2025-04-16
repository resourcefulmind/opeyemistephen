import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { TransitionType } from '../../components/transitions/PageTransition';

/**
 * Routes mapped to specific transition types 
 */
export const routeTransitions: Record<string, TransitionType> = {
  '/': 'fade',
  '/blog': 'slide-up',
  '/about': 'slide-left',
};

/**
 * Determines if a specific path is a blog post
 * @param path Route path
 * @returns True if path is a blog post
 */
export const isBlogPost = (path: string): boolean => 
  path.startsWith('/blog/') && path !== '/blog';

/**
 * Custom hook to determine transition type based on navigation
 */
export function usePageTransition() {
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState<string>('');
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);
  
  // Determine transition type based on route change
  useEffect(() => {
    const currentPath = location.pathname;
    
    // If user prefers reduced motion, don't animate
    if (prefersReducedMotion) {
      setTransitionType('none');
      setPreviousPath(currentPath);
      return;
    }
    
    // Handle blog post transitions
    if (isBlogPost(currentPath)) {
      // Going from blog list to a post
      if (previousPath === '/blog') {
        setTransitionType('slide-left');
      } 
      // Going from a post to another post
      else if (isBlogPost(previousPath)) {
        const prevPostId = previousPath.split('/').pop() || '';
        const currentPostId = currentPath.split('/').pop() || '';
        
        // Determine direction based on post IDs if they have a natural order
        if (prevPostId < currentPostId) {
          setTransitionType('slide-left');
        } else {
          setTransitionType('slide-right');
        }
      } 
      // Default transition for blog posts
      else {
        setTransitionType('slide-up');
      }
    }
    // Going from a post back to the list
    else if (currentPath === '/blog' && isBlogPost(previousPath)) {
      setTransitionType('slide-right');
    }
    // Use predefined transitions for known routes
    else if (routeTransitions[currentPath]) {
      setTransitionType(routeTransitions[currentPath]);
    }
    // Default transition
    else {
      setTransitionType('fade');
    }
    
    setPreviousPath(currentPath);
  }, [location.pathname, previousPath, prefersReducedMotion]);
  
  return transitionType;
} 