// Error severity levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Error log entry interface
export interface ErrorLogEntry {
  message: string
  timestamp: Date
  severity: ErrorSeverity
  count: number
  context?: Record<string, any>
  stack?: string
}

// Error logger class
export class ErrorLogger {
  private static instance: ErrorLogger
  private logs: Map<string, ErrorLogEntry> = new Map()
  private batchInterval: number = 5 * 60 * 1000 // 5 minutes in milliseconds
  private lastBatchTime: number = Date.now()

  private constructor() {
    // Initialize error logger
    this.setupPeriodicBatching()
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  // Log an error
  public logError(
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, any>,
    stack?: string,
  ): void {
    const key = this.generateErrorKey(message)
    const now = new Date()

    if (this.logs.has(key)) {
      const existingLog = this.logs.get(key)!
      existingLog.count += 1
      existingLog.timestamp = now // Update timestamp to most recent occurrence
      if (context) {
        existingLog.context = { ...existingLog.context, ...context }
      }
    } else {
      this.logs.set(key, {
        message,
        timestamp: now,
        severity,
        count: 1,
        context,
        stack,
      })
    }

    // Check if we should process batches
    this.checkBatchProcessing()

    // For critical errors, we might want to take immediate action
    if (severity === ErrorSeverity.CRITICAL) {
      this.handleCriticalError(message, context)
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[${severity.toUpperCase()}] ${message}`, context || "")
      if (stack) console.error(stack)
    }
  }

  // Generate a unique key for an error message
  private generateErrorKey(message: string): string {
    // Simple hash function for the message
    return message.trim().toLowerCase().replace(/\s+/g, "_")
  }

  // Setup periodic batching of errors
  private setupPeriodicBatching(): void {
    setInterval(() => {
      this.processBatchedErrors()
    }, this.batchInterval)
  }

  // Check if we should process batches based on time or count
  private checkBatchProcessing(): void {
    const now = Date.now()
    if (now - this.lastBatchTime >= this.batchInterval) {
      this.processBatchedErrors()
    }
  }

  // Process batched errors
  private processBatchedErrors(): void {
    if (this.logs.size === 0) return

    // In a real application, you might send these logs to a server
    // or store them in localStorage/IndexedDB

    const batchedLogs = Array.from(this.logs.values())

    // Store in localStorage with timestamp
    try {
      const existingLogs = localStorage.getItem("errorLogs")
      const parsedLogs = existingLogs ? JSON.parse(existingLogs) : []

      // Add new batch with timestamp
      parsedLogs.push({
        batchTimestamp: new Date().toISOString(),
        errors: batchedLogs.map((log) => ({
          ...log,
          timestamp: log.timestamp.toISOString(),
        })),
      })

      // Keep only the last 10 batches to avoid localStorage limits
      const trimmedLogs = parsedLogs.slice(-10)
      localStorage.setItem("errorLogs", JSON.stringify(trimmedLogs))
    } catch (e) {
      console.error("Failed to store error logs:", e)
    }

    // Clear the current logs after processing
    this.logs.clear()
    this.lastBatchTime = Date.now()
  }

  // Handle critical errors
  private handleCriticalError(message: string, context?: Record<string, any>): void {
    // In a real application, you might want to:
    // 1. Send an immediate alert to a monitoring service
    // 2. Show a minimal UI notification for truly critical errors
    // 3. Attempt recovery actions

    console.error("[CRITICAL ERROR]", message, context || "")
  }

  // Get all current logs (for debugging)
  public getAllLogs(): ErrorLogEntry[] {
    return Array.from(this.logs.values())
  }

  // Clear all logs
  public clearLogs(): void {
    this.logs.clear()
  }
}

// Create a simple function to log errors
export function logError(
  message: string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context?: Record<string, any>,
  stack?: string,
): void {
  ErrorLogger.getInstance().logError(message, severity, context, stack)
}

// Export a global error handler that can be used to catch unhandled errors
export function setupGlobalErrorHandler(): void {
  if (typeof window !== "undefined") {
    window.onerror = (message, source, lineno, colno, error) => {
      logError(message as string, ErrorSeverity.HIGH, { source, lineno, colno }, error?.stack)
      return false // Let the default handler run as well
    }

    window.addEventListener("unhandledrejection", (event) => {
      logError(
        `Unhandled Promise Rejection: ${event.reason}`,
        ErrorSeverity.HIGH,
        { reason: event.reason },
        event.reason?.stack,
      )
    })
  }
}
