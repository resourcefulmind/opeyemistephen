/**
 * Focus management utility for page transitions
 * Handles focus management for accessibility during transitions
 */

/**
 * Find the first focusable element in a container
 * 
 * @param container The container element to search within
 * @returns The first focusable element or null if none found
 */
export function findFirstFocusableElement(container: HTMLElement): HTMLElement | null {
  // Selectors for elements that can receive focus
  const focusableSelectors = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  
  const focusable = container.querySelector<HTMLElement>(focusableSelectors);
  
  return focusable;
}

/**
 * Store the currently focused element for later restoration
 */
let storedFocusElement: HTMLElement | null = null;

/**
 * Store the currently focused element
 */
export function storeFocus(): void {
  storedFocusElement = document.activeElement as HTMLElement;
}

/**
 * Restore focus to the previously stored element
 */
export function restoreFocus(): void {
  if (storedFocusElement && storedFocusElement.focus) {
    storedFocusElement.focus();
    storedFocusElement = null;
  }
}

/**
 * Focus the first focusable element in a container
 * 
 * @param container The container to focus within
 * @returns true if focus was set, false otherwise
 */
export function focusFirstElement(container: HTMLElement): boolean {
  const focusTarget = findFirstFocusableElement(container);
  
  if (focusTarget) {
    focusTarget.focus();
    return true;
  }
  
  return false;
}

/**
 * Create a focus trap that ensures focus stays within a container
 * 
 * @param container The container to trap focus within
 * @returns A cleanup function to remove the trap
 */
export function createFocusTrap(container: HTMLElement): () => void {
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    // Get all focusable elements
    const focusableSelectors = [
      'a[href]:not([tabindex="-1"])',
      'button:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    
    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Handle tab key press
    if (e.shiftKey) {
      // If shift+tab on first element, wrap to last
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // If tab on last element, wrap to first
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  document.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleTabKey);
  };
} 