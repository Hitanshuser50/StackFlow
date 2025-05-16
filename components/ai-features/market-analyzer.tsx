"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MarketAnalyzer() {
  const [token, setToken] = useState("SOL")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data: {
      token: string
      price: number
      priceInference: any
      tokenInfo: any
      analysis: string
    } | null
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!token.trim()) {
      setError("Please enter a token")
      return
    }

    try {
      setAnalyzing(true)
      setError(null)

      const response = await fetch("/api/market-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      setResult(data)

      if (!data.success) {
        setError(data.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setAnalyzing(false)
    }
  }

  const popularTokens = ["SOL", "BONK", "JUP", "USDC", "ETH", "BTC", "RNDR", "JTO"]

  return (
    <Card className="glass-card shadow-premium">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-premium-purple to-premium-pink bg-clip-text text-transparent">
          Market Analyzer
        </CardTitle>
        <CardDescription className="text-gray-400">
          Get AI-powered market analysis and price predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="token" className="text-sm font-medium text-gray-300">
            Select Token
          </label>
          <div className="flex space-x-2">
            <Select value={token} onValueChange={setToken}>
              <SelectTrigger className="bg-premium-blue/20 border-premium-lightBlue/30 text-white">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="bg-premium-blue/90 border-premium-lightBlue/30">
                {popularTokens.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-premium-purple hover:bg-premium-purple/80"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        {result?.data && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-premium-blue/20 p-3 rounded-lg border border-premium-lightBlue/30">
                <div className="text-xs text-gray-400">Current Price</div>
                <div className="text-lg font-bold text-white">${result.data.price?.toFixed(4) || "N/A"}</div>
              </div>
              <div className="bg-premium-blue/20 p-3 rounded-lg border border-premium-lightBlue/30">
                <div className="text-xs text-gray-400">5m Prediction</div>
                <div className="text-lg font-bold text-white">${result.data.priceInference?.toFixed(4) || "N/A"}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Market Analysis</h4>
              <ScrollArea className="h-40 rounded-md border border-premium-lightBlue/30 bg-premium-blue/20 p-4">
                <div className="text-sm text-gray-300">{result.data.analysis || "No analysis available"}</div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="w-full bg-premium-purple hover:bg-premium-purple/80"
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Analyze Market
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
