import { type NextRequest, NextResponse } from "next/server"
import { getMarketAnalysis } from "@/lib/gemini-service"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const result = await getMarketAnalysis(token)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in market analysis API:", error)
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
