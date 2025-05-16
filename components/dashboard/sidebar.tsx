"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Home,
  LineChart,
  Network,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  BrainCircuit,
  Sparkles,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [hovering, setHovering] = useState(false)

  // Dispatch custom event when sidebar state changes
  useEffect(() => {
    const event = new CustomEvent("sidebarStateChange", {
      detail: { type: "collapse", collapsed },
    })
    window.dispatchEvent(event)
  }, [collapsed])

  useEffect(() => {
    const event = new CustomEvent("sidebarStateChange", {
      detail: { type: "hover", hovering },
    })
    window.dispatchEvent(event)
  }, [hovering])

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-800 bg-gradient-sidebar backdrop-blur-md transition-all duration-300 ease-in-out",
        collapsed && !hovering ? "w-[70px]" : "w-[250px]",
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-premium-purple to-premium-pink">
            <Network className="h-4 w-4 text-white" />
          </div>
          <span
            className={cn(
              "text-lg font-bold text-white transition-opacity duration-200",
              collapsed && !hovering ? "opacity-0" : "opacity-100",
            )}
          >
            StakeFlow
          </span>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/40 text-gray-300 hover:bg-gray-700/50 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* User Profile Section */}
      <div className={cn("px-4 py-3", collapsed && !hovering ? "hidden" : "block")}>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-premium-purple">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Hitansh Gopani" />
            <AvatarFallback className="bg-premium-purple/20 text-premium-purple">HG</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-white">Hitansh Gopani</div>
            <div className="flex items-center gap-1 text-xs text-premium-pink">
              <Sparkles className="h-3 w-3" />
              Premium Member
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed User Profile */}
      {collapsed && !hovering && (
        <div className="flex justify-center py-3">
          <Avatar className="h-10 w-10 border-2 border-premium-purple">
            <AvatarFallback className="bg-premium-purple/20 text-premium-purple">HG</AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1 px-2 py-4">
        <NavItem href="/" icon={Home} label="Home" active={pathname === "/"} collapsed={collapsed && !hovering} />
        <NavItem
          href="/dashboard"
          icon={BarChart3}
          label="Dashboard"
          active={pathname === "/dashboard"}
          collapsed={collapsed && !hovering}
        />
        <NavItem
          href="/dashboard/validator/validator1"
          icon={LineChart}
          label="Validator Details"
          active={pathname.startsWith("/dashboard/validator")}
          collapsed={collapsed && !hovering}
        />
        <NavItem
          href="/ai-features"
          icon={BrainCircuit}
          label="AI Features"
          active={pathname === "/ai-features"}
          collapsed={collapsed && !hovering}
          highlight={true}
        />
        <NavItem
          href="/wallet"
          icon={Wallet}
          label="Wallet"
          active={pathname === "/wallet"}
          collapsed={collapsed && !hovering}
        />
        <NavItem
          href="/settings"
          icon={Settings}
          label="Settings"
          active={pathname === "/settings"}
          collapsed={collapsed && !hovering}
        />
        <NavItem
          href="/profile"
          icon={User}
          label="My Profile"
          active={pathname === "/profile"}
          collapsed={collapsed && !hovering}
        />
      </div>

      <div className="p-4">
        <div
          className={cn(
            "rounded-lg bg-gradient-to-r from-premium-purple/20 to-premium-pink/20 p-4 transition-all duration-300",
            collapsed && !hovering ? "px-2 py-4" : "px-4 py-4",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-premium-purple/30">
              <Sparkles className="h-4 w-4 text-premium-purple" />
            </div>
            <div
              className={cn("transition-opacity duration-200", collapsed && !hovering ? "opacity-0" : "opacity-100")}
            >
              <div className="text-sm font-medium text-white">Premium Active</div>
              <div className="text-xs text-gray-300">All features unlocked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
  collapsed: boolean
  highlight?: boolean
}

function NavItem({ href, icon: Icon, label, active, collapsed, highlight }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
        active ? "bg-premium-purple/20 text-white" : "text-gray-300 hover:bg-gray-800/40 hover:text-white",
        highlight && !active && "text-premium-pink hover:text-premium-pink hover:bg-premium-pink/10",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className={cn("transition-opacity duration-200", collapsed ? "opacity-0" : "opacity-100")}>
        {label}
        {highlight && !active && (
          <span className="ml-2 rounded-full bg-premium-pink/20 px-2 py-0.5 text-xs text-premium-pink">New</span>
        )}
      </span>
    </Link>
  )
}

export default Sidebar
