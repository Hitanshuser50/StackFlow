"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Server-safe placeholder component
export function AdvancedMetrics() {
  return (
    <section id="advanced-metrics" className="glass-card rounded-lg p-6 shadow-premium">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Advanced Analytics</h2>
        <p className="text-gray-400">Comprehensive metrics and insights for Solana network and validators</p>
      </div>

      {/* Load the actual metrics content only on client-side */}
      <ClientSideAdvancedMetrics />
    </section>
  )
}

// Dynamically import the client-side component with SSR disabled
const ClientSideAdvancedMetrics = dynamic(() => import("./advanced-metrics-content").then((mod) => mod.default), {
  ssr: false,
  loading: () => <AdvancedMetricsLoading />,
})

// Loading state
function AdvancedMetricsLoading() {
  return (
    <div className="space-y-6">
      <Card className="glass-card shadow-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Loading Analytics...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
