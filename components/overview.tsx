"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

export function Overview() {
  const [isClient, setIsClient] = useState(false)
  const [stakeDistribution, setStakeDistribution] = useState([])
  const [stakeMovement, setStakeMovement] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch stake distribution data
        const stakeRes = await fetch("/api/stake-accounts")
        if (!stakeRes.ok) {
          const errorData = await stakeRes.json()
          throw new Error(errorData.error || "Failed to fetch stake accounts")
        }
        const stakeData = await stakeRes.json()

        // Fetch stake movement data
        const historyRes = await fetch("/api/stake-history")
        if (!historyRes.ok) {
          const errorData = await historyRes.json()
          throw new Error(errorData.error || "Failed to fetch stake history")
        }
        const historyData = await historyRes.json()

        // Process and set the data
        setStakeDistribution(stakeData.stakeDistribution || [])
        setStakeMovement(historyData.history || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!isClient) {
    return <div>Loading charts...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Stake Distribution Overview</CardTitle>
          <CardDescription>Current distribution of stakes across validators</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading stake distribution data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center text-red-500">{error}</div>
            </div>
          ) : stakeDistribution.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">No stake distribution data available</div>
            </div>
          ) : (
            <div className="h-[400px]">
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
                  >
                    {stakeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} SOL`, "Stake Amount"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Stake Movement Over Time</CardTitle>
          <CardDescription>Tracking the flow of stakes between native tokens and liquid staking tokens</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading stake movement data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center text-red-500">{error}</div>
            </div>
          ) : stakeMovement.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">No stake movement data available</div>
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stakeMovement}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} SOL`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="native" stroke="#8884d8" activeDot={{ r: 8 }} name="Native SOL" />
                  <Line type="monotone" dataKey="lst" stroke="#82ca9d" name="Liquid Staking Tokens" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
