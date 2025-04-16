import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { focusFirstElement, storeFocus } from '../../lib/utils/focus';

/**
 * Types of transitions available
 */
export type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'scale' | 'none';

/**
 * Props for PageTransition component
 */
export interface PageTransitionProps {
  children: React.ReactNode;
  
  /**
   * Type of transition to use
   * @default 'fade'
   */
  type?: TransitionType;
  
  /**
   * Whether to disable transitions based on user preference
   * @default true
   */
  respectReducedMotion?: boolean;
  
  /**
   * Custom class name for the transition container
   */
  className?: string;
  
  /**
   * Unique key for the route to trigger animation on change
   * @default location.pathname
   */
  transitionKey?: string;
  
  /**
   * Duration of the transition in seconds
   * @default 0.3
   */
  duration?: number;
}

/**
 * Page transition variants for different transition types
 */
const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-left': {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  'slide-right': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  'slide-up': {
    initial: { y: '15px', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-15px', opacity: 0 },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

/**
 * Component for adding smooth transitions between pages
 */
export default function PageTransition({
  children,
  type = 'fade',
  respectReducedMotion = true,
  className = '',
  transitionKey,
  duration = 0.3,
}: PageTransitionProps) {
  const location = useLocation();
  const key = transitionKey || location.pathname;
  const contentRef = useRef<HTMLDivElement>(null);

  // Store focus on exit and scroll to top on new page
  useEffect(() => {
    storeFocus();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Focus first focusable element after animation completes
  const handleAnimationComplete = () => {
    if (contentRef.current) {
      // Wait a bit for all elements to be fully rendered
      setTimeout(() => {
        focusFirstElement(contentRef.current!);
      }, 50);
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={transitionVariants[type]}
        transition={{
          duration,
          ease: 'easeInOut',
        }}
        className={className}
        style={{ width: '100%' }}
        data-testid="page-transition"
        ref={contentRef}
        onAnimationComplete={handleAnimationComplete}
        // Improves accessibility during transitions
        aria-live="polite"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 