"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function ValidatorHopping() {
  const [isClient, setIsClient] = useState(false)
  const [hoppingData, setHoppingData] = useState([])
  const [loyaltyScores, setLoyaltyScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch validator hopping data
        const hoppingRes = await fetch("/api/validator-hopping")
        if (!hoppingRes.ok) throw new Error("Failed to fetch validator hopping data")
        const hoppingData = await hoppingRes.json()

        // Fetch validators for loyalty scores
        const validatorsRes = await fetch("/api/validators")
        if (!validatorsRes.ok) throw new Error("Failed to fetch validators")
        const validatorsData = await validatorsRes.json()

        // Process and set the data
        setHoppingData(hoppingData.hoppingData || [])

        // Calculate loyalty scores from validators data
        const loyaltyData = (validatorsData.validators || [])
          .slice(0, 5) // Take top 5 for the chart
          .map((validator) => ({
            name: validator.name,
            score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100 for demo
          }))

        setLoyaltyScores(loyaltyData)
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
          <CardTitle>Validator Hopping Analysis</CardTitle>
          <CardDescription>Track users who switch between validators and analyze patterns</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading validator hopping data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[300px] items-center justify-center">
              <div className="text-center text-red-500">{error}</div>
            </div>
          ) : hoppingData.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center">
              <div className="text-center">No validator hopping data available</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Previous Validator</TableHead>
                    <TableHead>Current Validator</TableHead>
                    <TableHead>Loyalty Score</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hoppingData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.walletAddress}</TableCell>
                      <TableCell>{row.previousValidator}</TableCell>
                      <TableCell>{row.currentValidator}</TableCell>
                      <TableCell>{row.loyaltyScore}</TableCell>
                      <TableCell>{row.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Validator Loyalty Scores</CardTitle>
          <CardDescription>Validators ranked by user loyalty and stake retention</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading loyalty score data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center text-red-500">{error}</div>
            </div>
          ) : loyaltyScores.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">No loyalty score data available</div>
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={loyaltyScores}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" name="Loyalty Score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
