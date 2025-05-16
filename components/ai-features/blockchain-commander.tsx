"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Terminal, Copy, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function BlockchainCommander() {
  const [command, setCommand] = useState("")
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data: any
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleProcessCommand = async () => {
    if (!command.trim()) {
      setError("Please enter a command")
      return
    }

    try {
      setProcessing(true)
      setError(null)

      const response = await fetch("/api/blockchain-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
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
      console.error("Error processing command:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setResult(null)
    } finally {
      setProcessing(false)
    }
  }

  const handleCopyResult = () => {
    if (!result?.data) return

    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const examples = [
    "Stake 1 SOL to validator Everstake",
    "Swap 10 USDC for SOL with 1% slippage",
    "Create an NFT collection called 'Cosmic Creatures'",
    "Check the price of BONK token",
    "Send 5 SOL to wallet address abc123...",
  ]

  return (
    <Card className="shadow-lg border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Blockchain Commander
        </CardTitle>
        <CardDescription className="text-gray-400">
          Execute Solana blockchain operations using natural language
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="command" className="text-sm font-medium text-gray-300">
            Enter Command
          </label>
          <Textarea
            id="command"
            placeholder="Enter your blockchain command in natural language..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400">Examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setCommand(example)}
                className="text-xs border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        {result?.data && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">Result</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyResult}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <ScrollArea className="h-40 rounded-md border border-gray-700 bg-gray-800/50 p-4">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleProcessCommand}
          disabled={processing || !command.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Terminal className="mr-2 h-4 w-4" />
              Execute Command
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
