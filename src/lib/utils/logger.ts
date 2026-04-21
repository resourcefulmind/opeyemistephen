/**
 * Minimal error logger. Only surface in active use across the codebase.
 * Add more levels back if a concrete need appears.
 */

export const logger = {
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
};

export default logger;
