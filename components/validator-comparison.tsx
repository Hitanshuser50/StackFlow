"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { fetchValidators } from "@/lib/solana-client"
import { ArrowUpDown, Download, RefreshCw, Info } from "lucide-react"

export function ValidatorComparison() {
  const [validators, setValidators] = useState([])
  const [selectedValidators, setSelectedValidators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: "stake", direction: "desc" })
  const [activeTab, setActiveTab] = useState("performance")
  const [comparisonData, setComparisonData] = useState([])
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const validatorData = await fetchValidators(50)
      setValidators(validatorData)
      setError(null)
    } catch (err) {
      console.error("Error fetching validators:", err)
      setError("Failed to load validator data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedValidators = [...validators].sort((a, b) => {
    if (!a[sortConfig.key] && !b[sortConfig.key]) return 0
    if (!a[sortConfig.key]) return 1
    if (!b[sortConfig.key]) return -1

    const aValue = typeof a[sortConfig.key] === "string" ? a[sortConfig.key].toLowerCase() : a[sortConfig.key]
    const bValue = typeof b[sortConfig.key] === "string" ? b[sortConfig.key].toLowerCase() : b[sortConfig.key]

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const toggleValidatorSelection = (validator) => {
    if (selectedValidators.some((v) => v.id === validator.id)) {
      setSelectedValidators(selectedValidators.filter((v) => v.id !== validator.id))
    } else {
      if (selectedValidators.length < 5) {
        setSelectedValidators([...selectedValidators, validator])
      }
    }
  }

  useEffect(() => {
    if (selectedValidators.length > 0) {
      // Generate comparison data for charts
      const performanceMetrics = [
        { name: "APY (%)", key: "apy" },
        { name: "Commission (%)", key: "commission" },
        { name: "Uptime (%)", key: "uptime" },
        { name: "Skip Rate (%)", key: "skipRate" },
      ]

      const data = performanceMetrics.map((metric) => {
        const item = { name: metric.name }
        selectedValidators.forEach((validator) => {
          const value =
            metric.key === "apy" || metric.key === "uptime" || metric.key === "skipRate"
              ? Number.parseFloat(validator[metric.key])
              : validator[metric.key]
          item[validator.name] = value
        })
        return item
      })

      setComparisonData(data)
    }
  }, [selectedValidators])

  // Generate historical performance data (mock data for demo)
  const generateHistoricalData = () => {
    if (selectedValidators.length === 0) return []

    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const data = []

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      const item = { date: date.toISOString().split("T")[0] }

      selectedValidators.forEach((validator) => {
        // Generate slightly different patterns for each validator
        const baseApy = Number.parseFloat(validator.apy) || 6.5
        const variance = Math.sin(i / 5) * 0.5 + Math.random() * 0.3
        const multiplier = 1 + (validator.id.charCodeAt(0) % 10) / 100
        item[`${validator.name}_apy`] = (baseApy + variance * multiplier).toFixed(2)
      })

      data.push(item)
    }

    return data
  }

  // Generate radar chart data
  const generateRadarData = () => {
    if (selectedValidators.length === 0) return []

    return selectedValidators.map((validator) => {
      const apy = Number.parseFloat(validator.apy) || 0
      const uptime = Number.parseFloat(validator.uptime) || 0
      const skipRate = Number.parseFloat(validator.skipRate) || 0
      // Invert skip rate for radar chart (lower is better)
      const skipRateScore = 100 - skipRate * 10

      return {
        name: validator.name,
        "APY Score": (apy / 7) * 100, // Normalize to 0-100 scale
        "Uptime Score": uptime,
        "Reliability Score": skipRateScore,
        "Commission Score": 100 - validator.commission * 5, // Lower commission is better
        "Stake Size Score": Math.min((validator.stake / 10000000) * 100, 100), // Normalize to 0-100 scale
      }
    })
  }

  const exportComparisonData = () => {
    if (selectedValidators.length === 0) return

    const headers = ["Metric", ...selectedValidators.map((v) => v.name)]
    const rows = comparisonData.map((item) => {
      return [item.name, ...selectedValidators.map((v) => item[v.name])]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `validator_comparison_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Validator Comparison Tool</CardTitle>
              <CardDescription>Compare performance metrics across multiple validators</CardDescription>
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
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportComparisonData}
                disabled={selectedValidators.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="font-medium flex items-center justify-between">
                <span>Select Validators (max 5)</span>
                <Badge variant="outline">{selectedValidators.length}/5 selected</Badge>
              </div>

              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 text-center">{error}</div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                          <div className="flex items-center">
                            Name
                            {sortConfig.key === "name" && (
                              <ArrowUpDown
                                className={`ml-1 h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer text-right" onClick={() => handleSort("stake")}>
                          <div className="flex items-center justify-end">
                            Stake
                            {sortConfig.key === "stake" && (
                              <ArrowUpDown
                                className={`ml-1 h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                              />
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedValidators.slice(0, 10).map((validator) => (
                        <TableRow
                          key={validator.id}
                          className={`cursor-pointer ${selectedValidators.some((v) => v.id === validator.id) ? "bg-primary/10" : ""}`}
                          onClick={() => toggleValidatorSelection(validator)}
                        >
                          <TableCell className="p-2">
                            <div className="flex items-center justify-center">
                              <div
                                className={`h-4 w-4 rounded-sm border ${selectedValidators.some((v) => v.id === validator.id) ? "bg-primary border-primary" : "border-gray-300"}`}
                              >
                                {selectedValidators.some((v) => v.id === validator.id) && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 text-white"
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{validator.name}</TableCell>
                          <TableCell className="text-right">{validator.stake.toLocaleString()} SOL</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedValidators.length > 0 && (
                <div className="space-y-2">
                  <div className="font-medium">Selected Validators</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedValidators.map((validator) => (
                      <Badge
                        key={validator.id}
                        variant="secondary"
                        className="cursor-pointer flex items-center gap-1"
                        onClick={() => toggleValidatorSelection(validator)}
                      >
                        {validator.name}
                        <span className="ml-1 text-xs">×</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedValidators.length === 0 ? (
                <div className="flex items-center justify-center h-full border rounded-md p-8 text-center text-gray-500">
                  <div>
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select validators from the list to compare their performance metrics</p>
                  </div>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                    <TabsTrigger value="historical">Historical Trends</TabsTrigger>
                    <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="performance" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          tick={{ angle: -45, textAnchor: "end", dominantBaseline: "auto" }}
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedValidators.map((validator, index) => (
                          <Bar key={validator.id} dataKey={validator.name} fill={`hsl(${index * 60}, 70%, 50%)`} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="historical" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateHistoricalData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedValidators.map((validator, index) => (
                          <Line
                            key={validator.id}
                            type="monotone"
                            dataKey={`${validator.name}_apy`}
                            name={`${validator.name} APY`}
                            stroke={`hsl(${index * 60}, 70%, 50%)`}
                            activeDot={{ r: 8 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="radar" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} data={generateRadarData()[0]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        {selectedValidators.map((validator, index) => (
                          <Radar
                            key={validator.id}
                            name={validator.name}
                            dataKey={validator.name}
                            stroke={`hsl(${index * 60}, 70%, 50%)`}
                            fill={`hsl(${index * 60}, 70%, 50%)`}
                            fillOpacity={0.3}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
