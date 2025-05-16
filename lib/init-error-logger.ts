import { setupGlobalErrorHandler } from "./error-logger"

export function initErrorLogger() {
  // Setup global error handlers
  setupGlobalErrorHandler()

  // Return a cleanup function if needed
  return () => {
    // Any cleanup code here
  }
}
