/**
 * Logger Utility
 *
 * A logging utility that suppresses verbose output in production.
 * Works in both server and browser environments.
 */

const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args: any[]): void => {
    if (!isProduction) {
      console.log(...args);
    }
  },

  info: (...args: any[]): void => {
    if (!isProduction) {
      console.info(...args);
    }
  },

  warn: (...args: any[]): void => {
    console.warn(...args);
  },

  error: (...args: any[]): void => {
    console.error(...args);
  },

  debug: (...args: any[]): void => {
    if (isProduction) return;
    if (typeof window === 'undefined') return;
    if (window.localStorage?.getItem('debug') !== 'true') return;
    console.debug('[DEBUG]', ...args);
  },
};

export default logger;
