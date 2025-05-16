"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
} from "recharts"
import { Download, RefreshCw, TrendingUp, TrendingDown, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays, format } from "date-fns"

export function HistoricalPerformance() {
  const [timeRange, setTimeRange] = useState("90d")
  const [validatorId, setValidatorId] = useState("all")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [metrics, setMetrics] = useState([])
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("apy")
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -90),
    to: new Date(),
  })
  const [customRange, setCustomRange] = useState(false)

  useEffect(() => {
    if (!customRange) {
      // Set date range based on timeRange
      const to = new Date()
      let from

      switch (timeRange) {
        case "7d":
          from = addDays(to, -7)
          break
        case "30d":
          from = addDays(to, -30)
          break
        case "90d":
          from = addDays(to, -90)
          break
        case "1y":
          from = addDays(to, -365)
          break
        default:
          from = addDays(to, -90)
      }

      setDateRange({ from, to })
    }
  }, [timeRange, customRange])

  useEffect(() => {
    fetchData()
  }, [dateRange, validatorId])

  const fetchData = async () => {
    try {
      setLoading(true)
      // In a real implementation, this would fetch data from an API
      // For now, we'll generate mock data

      // Generate time series data
      const startDate = dateRange.from
      const endDate = dateRange.to
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

      const timeSeriesData = []
      const validatorIds = validatorId === "all" ? ["validator1", "validator2", "validator3"] : [validatorId]

      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        const formattedDate = format(date, "yyyy-MM-dd")

        // Create base entry
        const entry = {
          date: formattedDate,
        }

        // Add data for each validator
        validatorIds.forEach((id) => {
          // Base values that change over time with some patterns
          const baseApy = 6.5 + Math.sin(i / 30) * 0.5
          const baseUptime = 99.8 + Math.cos(i / 20) * 0.2
          const baseSkipRate = 0.5 + Math.sin(i / 15) * 0.3

          // Add some randomness and validator-specific variations
          const validatorIndex = Number.parseInt(id.replace("validator", ""))
          const validatorFactor = 1 + validatorIndex * 0.05

          entry[`${id}_apy`] = (baseApy * validatorFactor + (Math.random() * 0.2 - 0.1)).toFixed(2)
          entry[`${id}_uptime`] = (baseUptime + (Math.random() * 0.1 - 0.05)).toFixed(2)
          entry[`${id}_skipRate`] = (baseSkipRate * (2 - validatorFactor) + (Math.random() * 0.1 - 0.05)).toFixed(2)
          entry[`${id}_commission`] = validatorIndex + 5 // Fixed commission per validator
        })

        timeSeriesData.push(entry)
      }

      setData(timeSeriesData)

      // Generate performance metrics
      const performanceMetrics = validatorIds.map((id) => {
        const validatorIndex = Number.parseInt(id.replace("validator", ""))
        const validatorName = `Validator ${String.fromCharCode(64 + validatorIndex)}`

        // Calculate averages from the time series data
        const avgApy =
          timeSeriesData.reduce((sum, item) => sum + Number.parseFloat(item[`${id}_apy`]), 0) / timeSeriesData.length
        const avgUptime =
          timeSeriesData.reduce((sum, item) => sum + Number.parseFloat(item[`${id}_uptime`]), 0) / timeSeriesData.length
        const avgSkipRate =
          timeSeriesData.reduce((sum, item) => sum + Number.parseFloat(item[`${id}_skipRate`]), 0) /
          timeSeriesData.length

        // Calculate trends (comparing first and last week averages)
        const firstWeekData = timeSeriesData.slice(0, Math.min(7, timeSeriesData.length))
        const lastWeekData = timeSeriesData.slice(Math.max(0, timeSeriesData.length - 7))

        const firstWeekAvgApy =
          firstWeekData.reduce((sum, item) => sum + Number.parseFloat(item[`${id}_apy`]), 0) / firstWeekData.length
        const lastWeekAvgApy =
          lastWeekData.reduce((sum, item) => sum + Number.parseFloat(item[`${id}_apy`]), 0) / lastWeekData.length
        const apyTrend = (((lastWeekAvgApy - firstWeekAvgApy) / firstWeekAvgApy) * 100).toFixed(2)

        return {
          id,
          name: validatorName,
          avgApy: avgApy.toFixed(2),
          avgUptime: avgUptime.toFixed(2),
          avgSkipRate: avgSkipRate.toFixed(2),
          commission: validatorIndex + 5,
          apyTrend,
          uptimeTrend: (
            ((lastWeekData[0][`${id}_uptime`] - firstWeekData[0][`${id}_uptime`]) / firstWeekData[0][`${id}_uptime`]) *
            100
          ).toFixed(2),
          skipRateTrend: (
            ((lastWeekData[0][`${id}_skipRate`] - firstWeekData[0][`${id}_skipRate`]) /
              firstWeekData[0][`${id}_skipRate`]) *
            100
          ).toFixed(2),
        }
      })

      setMetrics(performanceMetrics)
      setError(null)
    } catch (err) {
      console.error("Error fetching historical performance data:", err)
      setError("Failed to load historical performance data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
    setCustomRange(false)
  }

  const handleDateRangeChange = (range) => {
    setDateRange(range)
    setCustomRange(true)
  }

  const exportData = () => {
    const csvContent = [
      ["Date", ...(data[0] ? Object.keys(data[0]).filter((k) => k !== "date") : [])].join(","),
      ...data.map((row) =>
        [
          row.date,
          ...Object.keys(row)
            .filter((k) => k !== "date")
            .map((k) => row[k]),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `historical_performance_${validatorId}_${format(dateRange.from, "yyyyMMdd")}_to_${format(dateRange.to, "yyyyMMdd")}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getChartData = () => {
    if (validatorId === "all") {
      // For "all" view, transform data to make it suitable for multi-line chart
      return data.map((item) => {
        const transformedItem = { date: item.date }

        // Add data for each validator
        for (let i = 1; i <= 3; i++) {
          const id = `validator${i}`
          transformedItem[`Validator ${String.fromCharCode(64 + i)}`] = Number.parseFloat(item[`${id}_${activeTab}`])
        }

        return transformedItem
      })
    }

    // For single validator view, just return the data for that validator
    return data.map((item) => ({
      date: item.date,
      value: Number.parseFloat(item[`${validatorId}_${activeTab}`]),
    }))
  }

  const getMetricLabel = () => {
    switch (activeTab) {
      case "apy":
        return "APY (%)"
      case "uptime":
        return "Uptime (%)"
      case "skipRate":
        return "Skip Rate (%)"
      case "commission":
        return "Commission (%)"
      default:
        return ""
    }
  }

  const getTrendBadge = (value, inverse = false) => {
    const numValue = Number.parseFloat(value)
    const isPositive = numValue > 0
    const isGood = inverse ? !isPositive : isPositive

    return (
      <Badge className={`${isGood ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {isPositive ? "+" : ""}
        {value}%{isPositive ? <TrendingUp className="h-3 w-3 ml-1" /> : <TrendingDown className="h-3 w-3 ml-1" />}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Historical Performance Tracking</CardTitle>
              <CardDescription>Track validator performance metrics over time</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={validatorId} onValueChange={setValidatorId}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Validator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Validators</SelectItem>
                  <SelectItem value="validator1">Validator A</SelectItem>
                  <SelectItem value="validator2">Validator B</SelectItem>
                  <SelectItem value="validator3">Validator C</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {metrics.map((metric) => (
                  <Card key={metric.id} className="bg-gray-50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{metric.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Avg APY</p>
                          <div className="flex items-center gap-1">
                            <p className="font-medium">{metric.avgApy}%</p>
                            {getTrendBadge(metric.apyTrend)}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg Uptime</p>
                          <div className="flex items-center gap-1">
                            <p className="font-medium">{metric.avgUptime}%</p>
                            {getTrendBadge(metric.uptimeTrend)}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg Skip Rate</p>
                          <div className="flex items-center gap-1">
                            <p className="font-medium">{metric.avgSkipRate}%</p>
                            {getTrendBadge(metric.skipRateTrend, true)}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Commission</p>
                          <p className="font-medium">{metric.commission}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="apy">APY</TabsTrigger>
                  <TabsTrigger value="uptime">Uptime</TabsTrigger>
                  <TabsTrigger value="skipRate">Skip Rate</TabsTrigger>
                  <TabsTrigger value="commission">Commission</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {validatorId === "all" ? (
                      <LineChart data={getChartData()} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: getMetricLabel(), angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Validator A" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Validator B" stroke="#82ca9d" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Validator C" stroke="#ffc658" activeDot={{ r: 8 }} />
                      </LineChart>
                    ) : (
                      <ComposedChart data={getChartData()} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: getMetricLabel(), angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="value"
                          fill="#8884d8"
                          stroke="#8884d8"
                          fillOpacity={0.3}
                          name={getMetricLabel()}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          dot={false}
                          activeDot={{ r: 8 }}
                          name={getMetricLabel()}
                        />
                        <Scatter dataKey="value" fill="#8884d8" name={getMetricLabel()} />
                      </ComposedChart>
                    )}
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Performance Insights
                </h3>
                <p className="text-sm text-blue-700">
                  {validatorId === "all"
                    ? "Comparing validators over time shows varying performance patterns. Validator A has maintained the most consistent APY, while Validator C shows the highest uptime but with occasional fluctuations in skip rate."
                    : `This validator has shown ${Number.parseFloat(metrics[0]?.apyTrend) > 0 ? "improving" : "declining"} APY trends over the selected period. The skip rate has ${Number.parseFloat(metrics[0]?.skipRateTrend) < 0 ? "improved" : "increased slightly"}, which may impact future performance.`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
