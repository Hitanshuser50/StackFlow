import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format SOL amount with appropriate suffix
export function formatSOL(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B SOL`
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SOL`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K SOL`
    }
    return `${amount.toFixed(1)} SOL`
  }

  return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} SOL`
}

// Format date string to a more readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format time ago (e.g., "2 hours ago")
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000 // years
  if (interval > 1) {
    return `${Math.floor(interval)} year${Math.floor(interval) === 1 ? "" : "s"} ago`
  }

  interval = seconds / 2592000 // months
  if (interval > 1) {
    return `${Math.floor(interval)} month${Math.floor(interval) === 1 ? "" : "s"} ago`
  }

  interval = seconds / 86400 // days
  if (interval > 1) {
    return `${Math.floor(interval)} day${Math.floor(interval) === 1 ? "" : "s"} ago`
  }

  interval = seconds / 3600 // hours
  if (interval > 1) {
    return `${Math.floor(interval)} hour${Math.floor(interval) === 1 ? "" : "s"} ago`
  }

  interval = seconds / 60 // minutes
  if (interval > 1) {
    return `${Math.floor(interval)} minute${Math.floor(interval) === 1 ? "" : "s"} ago`
  }

  return `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? "" : "s"} ago`
}

// Calculate percentage change between two values
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

// Truncate a string with ellipsis
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  const half = Math.floor(maxLength / 2)
  return `${str.substring(0, half)}...${str.substring(str.length - half)}`
}

// Format large numbers with commas and optional decimal places
export function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
