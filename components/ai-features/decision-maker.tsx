"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BrainCircuit } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DecisionMaker() {
  const [token, setToken] = useState("SOL")
  const [amount, setAmount] = useState("")
  const [action, setAction] = useState("stake")
  const [timeframe, setTimeframe] = useState("short")
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data: {
      context: any
      marketData: any
      walletBalance: any
      recommendations: string
    } | null
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      setError(null)

      const context = {
        token,
        amount: amount ? Number.parseFloat(amount) : undefined,
        action,
        timeframe,
      }

      const response = await fetch("/api/decision-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(context),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)

      if (!data.success) {
        setError(data.message)
      }
    } catch (err) {
      console.error("Error generating recommendations:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setResult(null)
    } finally {
      setGenerating(false)
    }
  }

  const tokens = ["SOL", "BONK", "JUP", "USDC", "ETH", "BTC", "RNDR", "JTO"]
  const actions = [
    { value: "stake", label: "Stake" },
    { value: "swap", label: "Swap" },
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
    { value: "lend", label: "Lend" },
    { value: "borrow", label: "Borrow" },
  ]
  const timeframes = [
    { value: "short", label: "Short-term (days)" },
    { value: "medium", label: "Medium-term (weeks)" },
    { value: "long", label: "Long-term (months)" },
  ]

  return (
    <Card className="shadow-lg border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          AI Decision Maker
        </CardTitle>
        <CardDescription className="text-gray-400">
          Get AI-powered recommendations for your blockchain decisions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="bg-gray-800 mb-4">
            <TabsTrigger value="basic" className="data-[state=active]:bg-purple-900/30">
              Basic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-900/30">
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="token" className="text-sm font-medium text-gray-300">
                  Token
                </label>
                <Select value={token} onValueChange={setToken}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {tokens.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-gray-300">
                  Amount (optional)
                </label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="action" className="text-sm font-medium text-gray-300">
                  Action
                </label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {actions.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="timeframe" className="text-sm font-medium text-gray-300">
                  Timeframe
                </label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {timeframes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="text-sm text-gray-400">Advanced options coming soon. Use the basic tab for now.</div>
          </TabsContent>
        </Tabs>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        {result?.data?.recommendations && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Recommendations</h4>
            <ScrollArea className="h-60 rounded-md border border-gray-700 bg-gray-800/50 p-4">
              <div className="text-sm text-gray-300 whitespace-pre-wrap">{result.data.recommendations}</div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} disabled={generating} className="w-full bg-purple-600 hover:bg-purple-700">
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <BrainCircuit className="mr-2 h-4 w-4" />
              Generate Recommendations
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
