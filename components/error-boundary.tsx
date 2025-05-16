"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { logError, ErrorSeverity } from "@/lib/error-logger"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our error logging service
    logError(error.message, ErrorSeverity.HIGH, { componentStack: errorInfo.componentStack }, error.stack)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <div className="hidden">Error occurred</div>
    }

    return this.props.children
  }
}

export default ErrorBoundary
