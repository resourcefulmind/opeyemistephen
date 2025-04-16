import React, { createContext, useContext, useState, useEffect } from 'react';
import PageTransition from './PageTransition';
import { usePageTransition } from '../../lib/hooks/usePageTransition';
import type { TransitionType } from './PageTransition';

/**
 * Transition context interface
 */
interface TransitionContextType {
  /**
   * Enable or disable transitions globally
   */
  transitionsEnabled: boolean;
  
  /**
   * Set whether transitions are enabled
   */
  setTransitionsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  
  /**
   * Current transition type
   */
  transitionType: TransitionType;
  
  /**
   * Override the current transition type
   */
  setTransitionType: React.Dispatch<React.SetStateAction<TransitionType>>;
  
  /**
   * Duration of the transition in seconds
   */
  transitionDuration: number;
  
  /**
   * Set the transition duration
   */
  setTransitionDuration: React.Dispatch<React.SetStateAction<number>>;
}

// Create context with default values
const TransitionContext = createContext<TransitionContextType>({
  transitionsEnabled: true,
  setTransitionsEnabled: () => {},
  transitionType: 'fade',
  setTransitionType: () => {},
  transitionDuration: 0.3,
  setTransitionDuration: () => {},
});

/**
 * Hook to use transition context
 */
export function useTransition() {
  return useContext(TransitionContext);
}

/**
 * Provider component for page transitions
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  // Auto-detected transition based on route
  const autoTransition = usePageTransition();
  
  // States for transition configuration
  const [transitionsEnabled, setTransitionsEnabled] = useState<boolean>(true);
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');
  const [transitionDuration, setTransitionDuration] = useState<number>(0.3);
  
  // Sync with auto-transition when it changes
  useEffect(() => {
    setTransitionType(autoTransition);
  }, [autoTransition]);
  
  // Context value that will be provided
  const contextValue: TransitionContextType = {
    transitionsEnabled,
    setTransitionsEnabled,
    transitionType,
    setTransitionType,
    transitionDuration,
    setTransitionDuration,
  };
  
  // If transitions are disabled, just render children
  if (!transitionsEnabled) {
    return <>{children}</>;
  }
  
  return (
    <TransitionContext.Provider value={contextValue}>
      <PageTransition 
        type={transitionType} 
        duration={transitionDuration}
      >
        {children}
      </PageTransition>
    </TransitionContext.Provider>
  );
} 