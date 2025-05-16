"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sankey,
  Tooltip as RechartsTooltip,
} from "recharts"
import { AlertCircle, TrendingUp, TrendingDown, RefreshCw, Download } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function StakeFlowPatterns() {
  const [timeRange, setTimeRange] = useState("30d")
  const [patternType, setPatternType] = useState("all")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [patterns, setPatterns] = useState([])
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("trends")

  useEffect(() => {
    fetchData()
  }, [timeRange, patternType])

  const fetchData = async () => {
    try {
      setLoading(true)
      // In a real implementation, this would fetch data from an API
      // For now, we'll generate mock data

      // Generate time series data
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      const timeSeriesData = []

      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (days - i - 1))

        // Create some patterns in the data
        const baseValue = 1000000 + i * 10000
        const trend = Math.sin(i / 10) * 50000
        const randomness = (Math.random() - 0.5) * 30000

        timeSeriesData.push({
          date: date.toISOString().split("T")[0],
          totalStake: baseValue + trend + randomness,
          newStake: 20000 + Math.sin(i / 5) * 10000 + Math.random() * 5000,
          unstake: 15000 + Math.cos(i / 7) * 8000 + Math.random() * 4000,
          netFlow: 5000 + Math.sin(i / 6) * 15000 + (Math.random() * 3000 - 1500),
        })
      }

      setData(timeSeriesData)

      // Detect patterns
      const detectedPatterns = [
        {
          id: 1,
          type: "surge",
          description: "Significant stake inflow surge detected",
          startDate: timeSeriesData[Math.floor(days * 0.2)].date,
          endDate: timeSeriesData[Math.floor(days * 0.3)].date,
          magnitude: "High",
          confidence: 0.87,
          affectedValidators: ["Validator A", "Validator C", "Validator F"],
          potentialCause: "Protocol upgrade announcement",
        },
        {
          id: 2,
          type: "exodus",
          description: "Gradual stake outflow from specific validators",
          startDate: timeSeriesData[Math.floor(days * 0.5)].date,
          endDate: timeSeriesData[Math.floor(days * 0.7)].date,
          magnitude: "Medium",
          confidence: 0.76,
          affectedValidators: ["Validator B", "Validator D"],
          potentialCause: "Commission rate increase",
        },
        {
          id: 3,
          type: "rotation",
          description: "Stake rotation between validator groups",
          startDate: timeSeriesData[Math.floor(days * 0.6)].date,
          endDate: timeSeriesData[Math.floor(days * 0.8)].date,
          magnitude: "Low",
          confidence: 0.65,
          affectedValidators: ["Multiple validators"],
          potentialCause: "Yield optimization strategy",
        },
      ]

      // Filter patterns based on selected type
      const filteredPatterns =
        patternType === "all" ? detectedPatterns : detectedPatterns.filter((p) => p.type === patternType)

      setPatterns(filteredPatterns)
      setError(null)
    } catch (err) {
      console.error("Error fetching stake flow pattern data:", err)
      setError("Failed to load stake flow pattern data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Generate Sankey diagram data for stake flow visualization
  const generateSankeyData = () => {
    return {
      nodes: [
        { name: "Total Stake" },
        { name: "Validator A" },
        { name: "Validator B" },
        { name: "Validator C" },
        { name: "Validator D" },
        { name: "Validator E" },
        { name: "New Stake" },
        { name: "Unstaked" },
      ],
      links: [
        { source: 0, target: 1, value: 2000000 },
        { source: 0, target: 2, value: 1500000 },
        { source: 0, target: 3, value: 1000000 },
        { source: 0, target: 4, value: 800000 },
        { source: 0, target: 5, value: 500000 },
        { source: 6, target: 1, value: 200000 },
        { source: 6, target: 3, value: 150000 },
        { source: 2, target: 7, value: 100000 },
        { source: 4, target: 7, value: 80000 },
        { source: 1, target: 3, value: 300000 },
        { source: 2, target: 4, value: 200000 },
      ],
    }
  }

  const exportData = () => {
    const csvContent = [
      ["Date", "Total Stake", "New Stake", "Unstake", "Net Flow"].join(","),
      ...data.map((row) => [row.date, row.totalStake, row.newStake, row.unstake, row.netFlow].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `stake_flow_patterns_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getMagnitudeBadge = (magnitude) => {
    switch (magnitude) {
      case "High":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/50">High</Badge>
      case "Medium":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Medium</Badge>
      case "Low":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getPatternIcon = (type) => {
    switch (type) {
      case "surge":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "exodus":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      case "rotation":
        return <RefreshCw className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Stake Flow Pattern Recognition</CardTitle>
              <CardDescription>Identify and analyze patterns in stake movement</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={patternType} onValueChange={setPatternType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Pattern Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patterns</SelectItem>
                  <SelectItem value="surge">Stake Surge</SelectItem>
                  <SelectItem value="exodus">Stake Exodus</SelectItem>
                  <SelectItem value="rotation">Stake Rotation</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="trends">Stake Flow Trends</TabsTrigger>
                  <TabsTrigger value="patterns">Detected Patterns</TabsTrigger>
                  <TabsTrigger value="flow">Flow Visualization</TabsTrigger>
                </TabsList>

                <TabsContent value="trends" className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="totalStake"
                        name="Total Stake"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="newStake"
                        name="New Stake"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="unstake"
                        name="Unstake"
                        stroke="#ffc658"
                        fill="#ffc658"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="patterns">
                  {patterns.length === 0 ? (
                    <div className="text-center p-8 border rounded-md">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No patterns detected in the selected time range and filter.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {patterns.map((pattern) => (
                        <div key={pattern.id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="mt-1">{getPatternIcon(pattern.type)}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{pattern.description}</h3>
                                {getMagnitudeBadge(pattern.magnitude)}
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <div>
                                    <span className="font-medium">Period:</span> {pattern.startDate} to{" "}
                                    {pattern.endDate}
                                  </div>
                                  <div>
                                    <span className="font-medium">Confidence:</span>{" "}
                                    {(pattern.confidence * 100).toFixed(0)}%
                                  </div>
                                  <div>
                                    <span className="font-medium">Affected Validators:</span>{" "}
                                    {pattern.affectedValidators.join(", ")}
                                  </div>
                                  <div>
                                    <span className="font-medium">Potential Cause:</span> {pattern.potentialCause}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="flow" className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <Sankey
                      data={generateSankeyData()}
                      nodePadding={50}
                      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      link={{ stroke: "#aaa" }}
                    >
                      <RechartsTooltip />
                    </Sankey>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Pattern Analysis Insights</h3>
                <p className="text-sm text-blue-700">
                  The pattern recognition algorithm has identified several significant stake movement patterns in the
                  selected time period. These patterns may indicate coordinated validator selection strategies,
                  responses to network events, or changes in staking preferences. Use this information to anticipate
                  stake flow changes and optimize your validator strategy.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
