/**
 * Logger Utility
 * 
 * A logging utility that automatically handles environment-based logging.
 * Logs are shown in development but suppressed in production to improve performance.
 */

/**
 * Determine if we're in a production environment
 * Uses Vite's import.meta.env.PROD which is statically replaced at build time
 */
const isProduction = import.meta.env.PROD;

/**
 * Application logger - use this instead of direct console.* calls
 */
export const logger = {
  /**
   * Standard log messages - only shown in development
   * @param args - Arguments to log
   */
  log: (...args: any[]): void => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  
  /**
   * Informational messages - only shown in development
   * @param args - Arguments to log
   */
  info: (...args: any[]): void => {
    if (!isProduction) {
      console.info(...args);
    }
  },
  
  /**
   * Warning messages - shown in both development and production
   * @param args - Arguments to log
   */
  warn: (...args: any[]): void => {
    console.warn(...args);
  },
  
  /**
   * Error messages - always shown
   * Could be extended to send to error monitoring service
   * @param args - Arguments to log
   */
  error: (...args: any[]): void => {
    console.error(...args);
  },
  
  /**
   * Debug messages - only shown in development and when debug mode is enabled
   * Useful for verbose logging that's only needed during debugging
   * @param args - Arguments to log
   */
  debug: (...args: any[]): void => {
    if (!isProduction && localStorage.getItem('debug') === 'true') {
      console.debug('[DEBUG]', ...args);
    }
  }
};

export default logger; 