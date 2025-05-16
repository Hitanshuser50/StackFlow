"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, AlertTriangle, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { useSolanaConnection } from "@/lib/solana-client"

export default function ConnectionStatus() {
  const { isConnected, isLoading, error, networkStats } = useSolanaConnection()
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  useEffect(() => {
    // Update last checked time
    const interval = setInterval(() => {
      setLastChecked(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Determine status based on connection state
  const status = isLoading ? "loading" : error ? "error" : isConnected ? "connected" : "demo"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              status === "connected"
                ? "bg-green-900/30 text-green-400 border border-green-500/30"
                : status === "demo"
                  ? "bg-amber-900/30 text-amber-400 border border-amber-500/30"
                  : status === "loading"
                    ? "bg-blue-900/30 text-blue-400 border border-blue-500/30"
                    : "bg-red-900/30 text-red-400 border border-red-500/30"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {status === "connected" ? (
              <>
                <Wifi className="mr-1 h-3 w-3" />
                <span>Connected</span>
                <span className="ml-1 text-green-300/70">{Math.round(networkStats.tps)} TPS</span>
              </>
            ) : status === "demo" ? (
              <>
                <AlertTriangle className="mr-1 h-3 w-3" />
                <span>Demo Mode</span>
              </>
            ) : status === "loading" ? (
              <>
                <Clock className="mr-1 h-3 w-3 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="mr-1 h-3 w-3" />
                <span>Disconnected</span>
              </>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="glass">
          <p>
            {status === "connected"
              ? `Connected to Solana RPC endpoint (Slot: ${networkStats.slot})`
              : status === "demo"
                ? "Using demo data - RPC connection limited"
                : status === "loading"
                  ? "Connecting to Solana RPC endpoint..."
                  : `Connection error: ${error}`}
            <br />
            <span className="text-xs text-gray-400">Last checked: {lastChecked.toLocaleTimeString()}</span>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
