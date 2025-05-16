"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import ConnectionStatus from "@/components/dashboard/connection-status"
import { cn } from "@/lib/utils"
import { BarChart2, TrendingUp, Users, LineChart, Database } from "lucide-react"
import Link from "next/link"
import { ResponsiveContainer } from "@/components/ui/responsive-container"
import ErrorBoundary from "@/components/error-boundary"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarHovering, setSidebarHovering] = useState(false)

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      if (e.detail.type === "collapse") {
        setSidebarCollapsed(e.detail.collapsed)
      } else if (e.detail.type === "hover") {
        setSidebarHovering(e.detail.hovering)
      }
    }

    window.addEventListener("sidebarStateChange" as any, handleSidebarChange)

    return () => {
      window.removeEventListener("sidebarStateChange" as any, handleSidebarChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-premium-dark-blue/30 text-foreground">
      <Sidebar>
        <Link
          href="#validator-comparison"
          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Validator Comparison
        </Link>
        <Link
          href="#stake-patterns"
          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Stake Flow Patterns
        </Link>
        <Link
          href="#delegator-support"
          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"
        >
          <Users className="mr-2 h-4 w-4" />
          Delegator Support
        </Link>
        <Link
          href="#historical-performance"
          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"
        >
          <LineChart className="mr-2 h-4 w-4" />
          Historical Performance
        </Link>
        <Link
          href="#data-export"
          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white"
        >
          <Database className="mr-2 h-4 w-4" />
          Data Export & API
        </Link>
      </Sidebar>

      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarCollapsed && !sidebarHovering ? "ml-[70px]" : "ml-[250px]",
        )}
      >
        <ResponsiveContainer maxWidth="2xl" padding="md" className="py-4">
          <div className="mb-4">
            <ConnectionStatus />
          </div>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ResponsiveContainer>
      </main>
    </div>
  )
}

export default DashboardLayout
