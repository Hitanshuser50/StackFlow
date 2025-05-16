"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChartContainer from "./chart-container"

// Default data for fallback
const DEFAULT_DATA = [
  { date: "2023-01-01", validator1: 4000, validator2: 2400, validator3: 1800 },
  { date: "2023-01-02", validator1: 3000, validator2: 2210, validator3: 2200 },
  { date: "2023-01-03", validator1: 2000, validator2: 2290, validator3: 2500 },
  { date: "2023-01-04", validator1: 2780, validator2: 3090, validator3: 2800 },
  { date: "2023-01-05", validator1: 1890, validator2: 3490, validator3: 2400 },
  { date: "2023-01-06", validator1: 2390, validator2: 3490, validator3: 2100 },
  { date: "2023-01-07", validator1: 3490, validator2: 2300, validator3: 2400 },
]

export default function StakeFlowSection() {
  const [data, setData] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedValidator, setSelectedValidator] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewType, setViewType] = useState("line")

  const validatorOptions = [
    { value: "all", label: "All Validators" },
    { value: "validator1", label: "Validator 1" },
    { value: "validator2", label: "Validator 2" },
    { value: "validator3", label: "Validator 3" },
  ]

  const timeRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "all", label: "All time" },
  ]

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/stake-history?timeRange=${timeRange}`)
      if (!response.ok) throw new Error("Failed to fetch stake flow data")
      const result = await response.json()

      if (!result || typeof result !== "object") {
        throw new Error("Invalid data format received from API")
      }

      // Ensure history is an array
      let historyData = Array.isArray(result.history) ? result.history : DEFAULT_DATA

      // Filter data based on selected validator if needed
      if (selectedValidator !== "all" && Array.isArray(historyData)) {
        historyData = historyData.map((item) => ({
          date: item.date,
          [selectedValidator]: item[selectedValidator],
        }))
      }

      setData(historyData)
      setError(null)
    } catch (err) {
      console.error("Error fetching stake flow data:", err)
      setError("Failed to load stake flow data. Using default data.")
      // Use default data as fallback
      setData(DEFAULT_DATA)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeRange, selectedValidator])

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
        </div>
      )
    }

    if (error && data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">{error}</div>
        </div>
      )
    }

    if (viewType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#333", fontSize: 12 }} tickMargin={10} />
            <YAxis tick={{ fill: "#333", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            {selectedValidator === "all" ? (
              <>
                <Line
                  type="monotone"
                  dataKey="validator1"
                  name="Validator 1"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Line
                  type="monotone"
                  dataKey="validator2"
                  name="Validator 2"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Line
                  type="monotone"
                  dataKey="validator3"
                  name="Validator 3"
                  stroke="#ffc658"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  animationDuration={1500}
                  animationBegin={0}
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey={selectedValidator}
                name={validatorOptions.find((v) => v.value === selectedValidator)?.label || selectedValidator}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                animationDuration={1500}
                animationBegin={0}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (viewType === "area") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#333", fontSize: 12 }} tickMargin={10} />
            <YAxis tick={{ fill: "#333", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            {selectedValidator === "all" ? (
              <>
                <Area
                  type="monotone"
                  dataKey="validator1"
                  name="Validator 1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Area
                  type="monotone"
                  dataKey="validator2"
                  name="Validator 2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Area
                  type="monotone"
                  dataKey="validator3"
                  name="Validator 3"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  animationDuration={1500}
                  animationBegin={0}
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey={selectedValidator}
                name={validatorOptions.find((v) => v.value === selectedValidator)?.label || selectedValidator}
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={1500}
                animationBegin={0}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "#333", fontSize: 12 }} tickMargin={10} />
          <YAxis tick={{ fill: "#333", fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          {selectedValidator === "all" ? (
            <>
              <Bar dataKey="validator1" name="Validator 1" fill="#8884d8" animationDuration={1500} animationBegin={0} />
              <Bar dataKey="validator2" name="Validator 2" fill="#82ca9d" animationDuration={1500} animationBegin={0} />
              <Bar dataKey="validator3" name="Validator 3" fill="#ffc658" animationDuration={1500} animationBegin={0} />
            </>
          ) : (
            <Bar
              dataKey={selectedValidator}
              name={validatorOptions.find((v) => v.value === selectedValidator)?.label || selectedValidator}
              fill="#8884d8"
              animationDuration={1500}
              animationBegin={0}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <section id="stake-flow" className="scroll-mt-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">Stake Flow</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-40">
            <Select value={timeRange} onValueChange={(value) => value && setTimeRange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select value={selectedValidator} onValueChange={(value) => value && setSelectedValidator(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select validator" />
              </SelectTrigger>
              <SelectContent>
                {validatorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ChartContainer
        title="Validator Stake Movement"
        description="Track stake movement across validators over time"
        tooltip="This chart shows the daily stake movement across top validators over the selected time period."
        onRefresh={fetchData}
        autoRefreshInterval={60}
        height="400px"
        className="transition-all duration-500 ease-in-out hover:shadow-lg"
      >
        <Tabs value={viewType} onValueChange={(value) => value && setViewType(value)} className="h-full">
          <div className="mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="line">Line Chart</TabsTrigger>
              <TabsTrigger value="area">Area Chart</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="line" className="h-[calc(100%-48px)]">
            {renderChart()}
          </TabsContent>

          <TabsContent value="area" className="h-[calc(100%-48px)]">
            {renderChart()}
          </TabsContent>

          <TabsContent value="bar" className="h-[calc(100%-48px)]">
            {renderChart()}
          </TabsContent>
        </Tabs>
      </ChartContainer>
    </section>
  )
}
