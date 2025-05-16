import { type NextRequest, NextResponse } from "next/server"
import { generateNFTArtworkDescription } from "@/lib/gemini-service"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const result = await generateNFTArtworkDescription(prompt)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in NFT artwork API:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        data: null,
      },
      { status: 500 },
    )
  }
}
