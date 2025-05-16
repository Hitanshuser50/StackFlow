"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatSOL, formatDate } from "@/lib/utils"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]

type StakeAccount = {
  id: string
  owner: string
  validator: string
  amount: number
  status: "active" | "inactive" | "delinquent"
  lastUpdated: string
  network: "mainnet" | "testnet" | "devnet"
  riskScore: number
}

// Safe object entries function
function safeObjectEntries(obj) {
  if (!obj || typeof obj !== "object") {
    return []
  }
  try {
    return Object.entries(obj)
  } catch (err) {
    console.error("Error in safeObjectEntries:", err)
    return []
  }
}

export default function RawDataSection() {
  const [mounted, setMounted] = useState(false)
  const [stakeAccounts, setStakeAccounts] = useState<StakeAccount[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<StakeAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [networkFilter, setNetworkFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("table")
  const [refreshing, setRefreshing] = useState(false)

  // Only run on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchData = useCallback(async () => {
    if (!mounted) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/raw-stake-accounts")
      if (!response.ok) {
        throw new Error("Failed to fetch stake accounts")
      }
      const data = await response.json()

      // Update dates to 2025
      const updatedData = data.map((account: StakeAccount) => {
        const date = new Date(account.lastUpdated)
        date.setFullYear(2025)
        return {
          ...account,
          lastUpdated: date.toISOString(),
        }
      })

      setStakeAccounts(updatedData)
      setFilteredAccounts(updatedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [mounted])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setTimeout(() => setRefreshing(false), 800)
  }

  useEffect(() => {
    if (mounted) {
      fetchData()
    }
  }, [mounted, fetchData])

  useEffect(() => {
    if (!mounted) return

    let result = stakeAccounts

    if (searchTerm) {
      result = result.filter(
        (account) =>
          account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.validator.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((account) => account.status === statusFilter)
    }

    if (networkFilter !== "all") {
      result = result.filter((account) => account.network === networkFilter)
    }

    if (riskFilter !== "all") {
      const riskRange = riskFilter.split("-").map(Number)
      result = result.filter((account) => account.riskScore >= riskRange[0] && account.riskScore <= riskRange[1])
    }

    setFilteredAccounts(result)
  }, [mounted, stakeAccounts, searchTerm, statusFilter, networkFilter, riskFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500 border-green-500/50"
      case "inactive":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
      case "delinquent":
        return "bg-red-500/20 text-red-500 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50"
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 3) return "text-green-500"
    if (score < 7) return "text-yellow-500"
    return "text-red-500"
  }

  const getNetworkBadge = (network: string) => {
    switch (network) {
      case "mainnet":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50"
      case "testnet":
        return "bg-purple-500/20 text-purple-500 border-purple-500/50"
      case "devnet":
        return "bg-orange-500/20 text-orange-500 border-orange-500/50"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50"
    }
  }

  // Analytics data preparation - only run on client-side
  const prepareAnalyticsData = () => {
    if (!mounted) return { statusData: [], networkData: [], validatorData: [], totalStake: 0 }

    try {
      // Status data
      const statusData = [
        {
          name: "Active",
          value: filteredAccounts.filter((a) => a.status === "active").length,
        },
        {
          name: "Inactive",
          value: filteredAccounts.filter((a) => a.status === "inactive").length,
        },
        {
          name: "Delinquent",
          value: filteredAccounts.filter((a) => a.status === "delinquent").length,
        },
      ]

      // Network data
      const networkData = [
        {
          name: "Mainnet",
          value: filteredAccounts.filter((a) => a.network === "mainnet").length,
        },
        {
          name: "Testnet",
          value: filteredAccounts.filter((a) => a.network === "testnet").length,
        },
        {
          name: "Devnet",
          value: filteredAccounts.filter((a) => a.network === "devnet").length,
        },
      ]

      // Validator data - safely using reduce
      const validatorCounts = {}
      filteredAccounts.forEach((account) => {
        if (account && account.validator) {
          validatorCounts[account.validator] = (validatorCounts[account.validator] || 0) + 1
        }
      })

      const validatorData = safeObjectEntries(validatorCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

      const totalStake = filteredAccounts.reduce((sum, account) => sum + account.amount, 0)

      return { statusData, networkData, validatorData, totalStake }
    } catch (err) {
      console.error("Error preparing analytics data:", err)
      return { statusData: [], networkData: [], validatorData: [], totalStake: 0 }
    }
  }

  const { statusData, networkData, validatorData, totalStake } = prepareAnalyticsData()

  const exportToCSV = () => {
    if (!mounted) return

    try {
      const headers = ["ID", "Owner", "Validator", "Amount (SOL)", "Status", "Last Updated", "Network", "Risk Score"]

      const csvData = filteredAccounts.map((account) => [
        account.id,
        account.owner,
        account.validator,
        account.amount,
        account.status,
        account.lastUpdated,
        account.network,
        account.riskScore,
      ])

      const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `stake_accounts_${new Date().toISOString()}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error exporting to CSV:", err)
      setError("Failed to export data to CSV")
    }
  }

  // If not mounted yet (server-side), return a simple placeholder
  if (!mounted) {
    return (
      <section id="raw-data" className="glass-card rounded-lg p-6 shadow-premium">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Raw Data Explorer</h2>
            <p className="text-gray-400">Explore and analyze raw stake account data</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={fetchData} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <section id="raw-data" className="glass-card rounded-lg p-6 shadow-premium">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Raw Data Explorer</h2>
          <p className="text-gray-400">Explore and analyze raw stake account data</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-premium-blue/30 mb-4">
          <TabsTrigger value="table" className="data-[state=active]:bg-premium-purple/30">
            Table View
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-premium-purple/30">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader className="bg-premium-blue/20">
                <TableRow>
                  <TableHead className="font-medium">ID</TableHead>
                  <TableHead className="font-medium">Owner</TableHead>
                  <TableHead className="font-medium">Validator</TableHead>
                  <TableHead className="font-medium text-right">Amount</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Network</TableHead>
                  <TableHead className="font-medium">Last Updated</TableHead>
                  <TableHead className="font-medium text-right">Risk Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 bg-premium-blue/20 rounded animate-pulse"></div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No stake accounts found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id} className="hover:bg-premium-blue/10">
                      <TableCell className="font-mono text-xs">{account.id.substring(0, 8)}...</TableCell>
                      <TableCell>{account.owner}</TableCell>
                      <TableCell>{account.validator}</TableCell>
                      <TableCell className="text-right font-mono">{formatSOL(account.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(account.status)}>
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getNetworkBadge(account.network)}>
                          {account.network}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(account.lastUpdated)}</TableCell>
                      <TableCell className={`text-right font-medium ${getRiskColor(account.riskScore)}`}>
                        {account.riskScore}/10
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-premium-blue/10 p-4 rounded-lg border border-premium-border">
                <h3 className="text-lg font-medium mb-2">Stake Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Accounts</span>
                    <span className="font-medium">{filteredAccounts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Stake</span>
                    <span className="font-medium">{formatSOL(totalStake)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Stake</span>
                    <span className="font-medium">
                      {formatSOL(filteredAccounts.length ? totalStake / filteredAccounts.length : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Risk Score</span>
                    <span className="font-medium">
                      {filteredAccounts.length
                        ? (
                            filteredAccounts.reduce((sum, account) => sum + account.riskScore, 0) /
                            filteredAccounts.length
                          ).toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-premium-blue/10 p-4 rounded-lg border border-premium-border">
                <h3 className="text-lg font-medium mb-2">Status Distribution</h3>
                <div className="h-[200px]">
                  <ChartContainer
                    config={{
                      active: {
                        label: "Active",
                        color: "hsl(var(--chart-1))",
                      },
                      inactive: {
                        label: "Inactive",
                        color: "hsl(var(--chart-2))",
                      },
                      delinquent: {
                        label: "Delinquent",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>

              <div className="bg-premium-blue/10 p-4 rounded-lg border border-premium-border">
                <h3 className="text-lg font-medium mb-2">Network Distribution</h3>
                <div className="h-[200px]">
                  <ChartContainer
                    config={{
                      mainnet: {
                        label: "Mainnet",
                        color: "hsl(var(--chart-1))",
                      },
                      testnet: {
                        label: "Testnet",
                        color: "hsl(var(--chart-2))",
                      },
                      devnet: {
                        label: "Devnet",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={networkData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {networkData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>

            <div className="bg-premium-blue/10 p-4 rounded-lg border border-premium-border">
              <h3 className="text-lg font-medium mb-4">Top Validators</h3>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    value: {
                      label: "Stake Accounts",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={validatorData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            <div className="bg-premium-blue/10 p-4 rounded-lg border border-premium-border">
              <h3 className="text-lg font-medium mb-2">Data Insights</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-premium-purple">•</span>
                  <span>
                    {statusData[0]?.value > (statusData[1]?.value || 0) + (statusData[2]?.value || 0)
                      ? "Majority of stake accounts are active, indicating a healthy staking ecosystem."
                      : "A significant portion of stake accounts are inactive or delinquent, suggesting potential issues."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-premium-purple">•</span>
                  <span>
                    {networkData[0]?.name === "Mainnet" &&
                    networkData[0]?.value > (networkData[1]?.value || 0) + (networkData[2]?.value || 0)
                      ? "Most stake accounts are on Mainnet, indicating production usage."
                      : "Significant testing activity observed with many accounts on Testnet/Devnet."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-premium-purple">•</span>
                  <span>
                    {validatorData.length > 0
                      ? `${validatorData[0]?.name} is the most popular validator with ${validatorData[0]?.value} stake accounts.`
                      : "No validator data available."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-premium-purple">•</span>
                  <span>
                    {filteredAccounts.filter((a) => a.riskScore > 6).length > filteredAccounts.length * 0.3
                      ? "High proportion of high-risk stake accounts detected. Consider reviewing validator selection."
                      : "Risk profile looks healthy with most accounts in low to medium risk range."}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
