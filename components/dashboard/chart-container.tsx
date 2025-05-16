"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, RefreshCw } from "lucide-react"
import { useState } from "react"
import type * as React from "react"

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  tooltip?: string
  height?: string
  onRefresh?: () => Promise<void> | void
  autoRefreshInterval?: number
  config?: Record<string, any> | null
}

export default function ChartContainer({
  title,
  description,
  children,
  tooltip,
  height = "auto",
  onRefresh,
  autoRefreshInterval,
  config = null,
}: ChartContainerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return

    setIsRefreshing(true)
    try {
      await onRefresh()
    } catch (error) {
      console.error("Error refreshing chart data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Set CSS variables for chart colors if config is provided
  const chartStyles: React.CSSProperties = {}

  if (config && typeof config === "object") {
    Object.entries(config).forEach(([key, value]) => {
      if (value && typeof value === "object" && value.color) {
        chartStyles[`--color-${key}`] = value.color
      }
    })
  }

  return (
    <Card className="glass-card shadow-premium">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          {description && <CardDescription className="text-sm text-gray-400">{description}</CardDescription>}
        </div>
        <div className="flex items-center space-x-2">
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="glass">
                  <p className="max-w-xs text-sm">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-gray-300 bg-premium-blue/20 px-2 py-1 rounded-md text-xs border border-premium-lightBlue/30 flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent style={{ height, ...chartStyles }}>{children}</CardContent>
    </Card>
  )
}
