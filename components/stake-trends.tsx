"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the ForceGraph component to avoid SSR issues
const ForceGraph = dynamic(() => import("./force-graph"), { ssr: false })

export function StakeTrends() {
  const [isClient, setIsClient] = useState(false)
  const [stakeMovementFrequency, setStakeMovementFrequency] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch validators for stake movement frequency
        const validatorsRes = await fetch("/api/validators")
        if (!validatorsRes.ok) throw new Error("Failed to fetch validators")
        const validatorsData = await validatorsRes.json()

        // Process and set the data
        // For demo purposes, we'll create frequency data based on validators
        const frequencyData = (validatorsData.validators || [])
          .slice(0, 5) // Take top 5 for the visualization
          .map((validator) => ({
            validator: validator.name,
            frequency: Math.floor(Math.random() * 70) + 30, // Random frequency between 30-100 for demo
          }))

        setStakeMovementFrequency(frequencyData)
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
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
          <CardTitle>Stake Movement Frequency</CardTitle>
          <CardDescription>Heatmap showing frequency of stake movements across validators</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading stake movement frequency data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center text-red-500">{error}</div>
            </div>
          ) : stakeMovementFrequency.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">No stake movement frequency data available</div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <div className="grid grid-cols-5 gap-4 w-full">
                {stakeMovementFrequency.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-full aspect-square rounded-md flex items-center justify-center text-white font-medium"
                      style={{
                        backgroundColor: `rgba(136, 132, 216, ${item.frequency / 100})`,
                        fontSize: "14px",
                      }}
                    >
                      {item.frequency}
                    </div>
                    <span className="text-xs mt-2 text-center">{item.validator}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Stake Reallocation Paths</CardTitle>
          <CardDescription>Network graph showing how stakes move between validators</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading network graph data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center text-red-500">{error}</div>
            </div>
          ) : (
            <div className="h-[400px]">
              <ForceGraph />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
