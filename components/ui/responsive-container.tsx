import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: "none" | "sm" | "md" | "lg"
  className?: string
}

export function ResponsiveContainer({
  children,
  maxWidth = "xl",
  padding = "md",
  className,
  ...props
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  }

  const paddingClasses = {
    none: "px-0",
    sm: "px-4",
    md: "px-6",
    lg: "px-8",
  }

  return (
    <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth], paddingClasses[padding], className)} {...props}>
      {children}
    </div>
  )
}
