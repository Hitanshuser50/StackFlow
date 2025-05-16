import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Since we're getting 403 errors, always return demo mode status
    return NextResponse.json({
      connected: false,
      isDemo: true,
      message: "Using demo data due to RPC access issues (403 Forbidden)",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error checking Solana connection:", error)

    // Return a more informative error message
    const errorMessage = error instanceof Error ? error.message : String(error)

    return NextResponse.json({
      connected: false,
      isDemo: true,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    })
  }
}
