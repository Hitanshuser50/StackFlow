import { NextResponse } from "next/server"
import { getNetworkStats } from "@/lib/solana-client"

// Demo data as fallback
const demoNetworkStats = {
  totalSupply: 535000000,
  circulating: 410000000,
  totalStaked: 154328921,
  stakePercentage: 37.64,
  activeValidators: 1872,
  delinquentValidators: 24,
  recentTps: 2345,
  lastUpdated: new Date(),
  dailyStakeChange: 2.3,
  isDemo: true,
}

export async function GET() {
  try {
    // Try to fetch real data
    const stats = await getNetworkStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching network stats, falling back to demo data:", error)

    // Return a more informative error message for debugging
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorDetails = {
      message: "Error fetching network stats, falling back to demo data",
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }

    // Log the error details for debugging
    console.error("Network stats error details:", errorDetails)

    // Fall back to demo data
    return NextResponse.json({
      ...demoNetworkStats,
      isDemo: true,
      lastUpdated: new Date(),
      errorDetails: process.env.NODE_ENV === "development" ? errorDetails : undefined,
    })
  }
}
