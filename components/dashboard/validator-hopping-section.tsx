"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import ChartContainer from "./chart-container"
import { formatSOL } from "@/lib/utils"
import { ChartContainer as ShadcnChartContainer, ChartTooltip } from "@/components/ui/chart"

type ValidatorHopping = {
  validator: string
  inflow: number
  outflow: number
  net: number
}

export default function ValidatorHoppingSection() {
  const [data, setData] = useState<ValidatorHopping[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/validator-hopping")

      if (!isMounted.current) return

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`)
      }

      const result = await response.json()

      if (!isMounted.current) return

      // Ensure we have an array of data
      if (Array.isArray(result)) {
        setData(result)
      } else if (result && Array.isArray(result.data)) {
        setData(result.data)
      } else {
        // Fallback to demo data if the API doesn't return the expected format
        setData([
          { validator: "Validator A", inflow: 5000, outflow: 3000, net: 2000 },
          { validator: "Validator B", inflow: 4200, outflow: 4500, net: -300 },
          { validator: "Validator C", inflow: 3800, outflow: 2900, net: 900 },
          { validator: "Validator D", inflow: 2500, outflow: 3200, net: -700 },
          { validator: "Validator E", inflow: 4800, outflow: 3600, net: 1200 },
        ])
      }
    } catch (err) {
      if (!isMounted.current) return
      console.error("Error fetching validator hopping data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")

      // Set fallback demo data on error
      setData([
        { validator: "Validator A", inflow: 5000, outflow: 3000, net: 2000 },
        { validator: "Validator B", inflow: 4200, outflow: 4500, net: -300 },
        { validator: "Validator C", inflow: 3800, outflow: 2900, net: 900 },
        { validator: "Validator D", inflow: 2500, outflow: 3200, net: -700 },
        { validator: "Validator E", inflow: 4800, outflow: 3600, net: 1200 },
      ])
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    fetchData()

    return () => {
      isMounted.current = false
    }
  }, [fetchData])

  return (
    <ChartContainer
      title="Validator Hopping"
      description="Stake movement between validators (last 30 days)"
      onRefresh={fetchData}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded">
            Try Again
          </button>
        </div>
      ) : data && data.length > 0 ? (
        <ShadcnChartContainer
          config={{
            inflow: {
              label: "Inflow",
              color: "hsl(var(--chart-1))",
            },
            outflow: {
              label: "Outflow",
              color: "hsl(var(--chart-2))",
            },
            net: {
              label: "Net Change",
              color: "hsl(var(--chart-3))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="validator" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => formatSOL(value, true)} tick={{ fontSize: 12 }} />
              <ChartTooltip formatter={(value) => formatSOL(value as number)} />
              <Legend />
              <Bar dataKey="inflow" fill="var(--color-inflow)" />
              <Bar dataKey="outflow" fill="var(--color-outflow)" />
              <Bar dataKey="net" fill="var(--color-net)" />
            </BarChart>
          </ResponsiveContainer>
        </ShadcnChartContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No data available</p>
        </div>
      )}
    </ChartContainer>
  )
}
