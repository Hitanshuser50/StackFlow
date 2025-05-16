"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, HelpCircle, RefreshCw, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

// Default metrics for fallback
const DEFAULT_METRICS = {
  totalStaked: 450000000,
  activeValidators: 1500,
  delinquentValidators: 25,
  dailyStakeChange: 0.5,
  stakePercentage: 72.5,
  recentTps: 2500,
  lastUpdated: new Date(),
  isDemo: true,
}

// Default distribution data for fallback
const DEFAULT_DISTRIBUTION = [
  { name: "Validator A", value: 120000000 },
  { name: "Validator B", value: 80000000 },
  { name: "Validator C", value: 70000000 },
  { name: "Validator D", value: 60000000 },
  { name: "Others", value: 120000000 },
]

export default function OverviewSection() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS)
  const [stakeDistribution, setStakeDistribution] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [distributionLoading, setDistributionLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [distributionError, setDistributionError] = useState<string | null>(null)
  const [showDemoAlert, setShowDemoAlert] = useState(true) // Always show demo alert

  const fetchNetworkStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/network-stats")
      if (!response.ok) throw new Error(`Failed to fetch network stats: ${response.status} ${response.statusText}`)
      const data = await response.json()

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data format received from API")
      }

      setMetrics({
        totalStaked: data.totalStaked || DEFAULT_METRICS.totalStaked,
        activeValidators: data.activeValidators || DEFAULT_METRICS.activeValidators,
        delinquentValidators: data.delinquentValidators || DEFAULT_METRICS.delinquentValidators,
        dailyStakeChange: Number.parseFloat(data.dailyStakeChange) || DEFAULT_METRICS.dailyStakeChange,
        stakePercentage: data.stakePercentage || DEFAULT_METRICS.stakePercentage,
        recentTps: data.recentTps || DEFAULT_METRICS.recentTps,
        lastUpdated: new Date(data.lastUpdated || Date.now()),
        isDemo: true, // Always set to true since we're using demo data
      })

      // Always show demo alert
      setShowDemoAlert(true)

      setError(null)
    } catch (err) {
      console.error("Error fetching network stats:", err)
      setError("Failed to load network stats. Using cached data if available.")
      setShowDemoAlert(true)
      // Use default metrics as fallback
      setMetrics(DEFAULT_METRICS)
    } finally {
      setLoading(false)
    }
  }

  const fetchStakeDistribution = async () => {
    try {
      setDistributionLoading(true)
      const response = await fetch("/api/stake-accounts")
      if (!response.ok) throw new Error(`Failed to fetch stake distribution: ${response.status} ${response.statusText}`)
      const data = await response.json()

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data format received from API")
      }

      // Ensure stakeDistribution is an array
      const distribution = Array.isArray(data.stakeDistribution) ? data.stakeDistribution : DEFAULT_DISTRIBUTION

      // Validate each item in the array has the required properties
      const validDistribution = distribution.every(
        (item) => item && typeof item === "object" && "name" in item && "value" in item,
      )

      setStakeDistribution(validDistribution ? distribution : DEFAULT_DISTRIBUTION)
      setDistributionError(null)
    } catch (err) {
      console.error("Error fetching stake distribution:", err)
      setDistributionError("Failed to load stake distribution. Using default data.")
      // Use default distribution as fallback
      setStakeDistribution(DEFAULT_DISTRIBUTION)
    } finally {
      setDistributionLoading(false)
    }
  }

  useEffect(() => {
    fetchNetworkStats()
    fetchStakeDistribution()
  }, [])

  const handleRefresh = () => {
    fetchNetworkStats()
    fetchStakeDistribution()
  }

  return (
    <section id="overview" className="scroll-mt-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-2 text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  This section provides an overview of the current state of Solana staking, including total staked SOL,
                  validator counts, and recent changes.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">
            Last updated at {metrics.lastUpdated.toLocaleTimeString()} on {metrics.lastUpdated.toLocaleDateString()}
          </p>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading || distributionLoading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${loading || distributionLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Always show demo alert */}
      <div className="mb-4">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Using Demo Data</AlertTitle>
          <AlertDescription>
            We're currently using demo data because we couldn't connect to the Solana RPC endpoint (403 Access
            Forbidden). This could be due to API key issues, rate limiting, or network restrictions. The data shown is
            for demonstration purposes only.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Total Staked SOL"
              value={metrics.totalStaked.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              loading={loading}
              tooltip="The total amount of SOL currently staked across all validators"
              subtitle={`${metrics.stakePercentage.toFixed(2)}% of circulating supply`}
              isDemo={metrics.isDemo}
            />
            <MetricCard
              title="Active Validators"
              value={metrics.activeValidators.toLocaleString()}
              loading={loading}
              tooltip="Number of validators currently active on the Solana network"
              subtitle={`${metrics.delinquentValidators} delinquent validators`}
              isDemo={metrics.isDemo}
            />
            <MetricCard
              title="Daily Stake Change"
              value={`${metrics.dailyStakeChange > 0 ? "+" : ""}${metrics.dailyStakeChange}%`}
              trend={metrics.dailyStakeChange > 0 ? "up" : "down"}
              loading={loading}
              tooltip="Percentage change in total staked SOL over the last 24 hours"
              subtitle={`Recent TPS: ${metrics.recentTps.toFixed(0)}`}
              isDemo={metrics.isDemo}
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800">Stake Distribution</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-500">
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">
                      This chart shows the distribution of staked SOL across the top validators.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {distributionLoading ? (
              <div className="flex h-80 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : distributionError ? (
              <div className="flex h-80 items-center justify-center">
                <div className="text-center text-red-500">{distributionError}</div>
              </div>
            ) : stakeDistribution.length === 0 ? (
              <div className="flex h-80 items-center justify-center">
                <div className="text-center">No stake distribution data available</div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stakeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={750}
                      animationBegin={0}
                    >
                      {stakeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => [`${Number(value).toLocaleString()} SOL`, "Stake Amount"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

interface MetricCardProps {
  title: string
  value: string
  trend?: "up" | "down"
  loading?: boolean
  tooltip?: string
  subtitle?: string
  isDemo?: boolean
}

function MetricCard({ title, value, trend, loading = false, tooltip, subtitle, isDemo = false }: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border ${isDemo ? "border-amber-200" : "border-gray-200"} bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {loading ? (
        <div className="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
      ) : (
        <div className="mt-2 flex items-baseline">
          <p className={`text-2xl font-semibold ${isDemo ? "text-amber-600" : "text-gray-900"}`}>{value}</p>
          {trend && (
            <span
              className={`ml-2 flex items-center text-sm font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </span>
          )}
          {isDemo && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Demo</span>
          )}
        </div>
      )}
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}
