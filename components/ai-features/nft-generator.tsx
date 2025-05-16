"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ImageIcon, Copy, CheckCircle } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NFTGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data: {
      description: string
      url: string
      prompt: string
    } | null
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    try {
      setGenerating(true)
      setError(null)

      const response = await fetch("/api/nft-artwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      setResult(data)

      if (!data.success) {
        setError(data.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyDescription = () => {
    if (!result?.data?.description) return

    navigator.clipboard.writeText(result.data.description)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="glass-card shadow-premium">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-premium-purple to-premium-pink bg-clip-text text-transparent">
          NFT Artwork Generator
        </CardTitle>
        <CardDescription className="text-gray-400">
          Generate unique NFT artwork descriptions using Gemini AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium text-gray-300">
            Artwork Concept
          </label>
          <Textarea
            id="prompt"
            placeholder="Describe the NFT artwork concept you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-premium-blue/20 border-premium-lightBlue/30 text-white"
            rows={4}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        {result?.data && (
          <div className="mt-4 space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-premium-lightBlue/30">
              <Image
                src={result.data.url || "/placeholder.svg"}
                alt="NFT artwork concept"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-300">AI-Generated Description</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyDescription}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <ScrollArea className="h-40 rounded-md border border-premium-lightBlue/30 bg-premium-blue/20 p-4">
                <p className="text-xs text-gray-300">{result.data.description}</p>
              </ScrollArea>
              <p className="text-xs text-gray-400 mt-2">
                Use this description with your preferred NFT creation tool or marketplace.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="bg-premium-purple hover:bg-premium-purple/80"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Concept
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
