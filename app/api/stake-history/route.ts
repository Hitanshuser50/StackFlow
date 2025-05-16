import { NextResponse } from "next/server"
import { getStakeMovementData } from "@/lib/solana-client"

// Demo data as fallback
const demoStakeHistory = [
  { name: "Jan", native: 4000, lst: 2400 },
  { name: "Feb", native: 3000, lst: 2800 },
  { name: "Mar", native: 2000, lst: 3200 },
  { name: "Apr", native: 2780, lst: 3908 },
  { name: "May", native: 1890, lst: 4800 },
  { name: "Jun", native: 2390, lst: 5200 },
  { name: "Jul", native: 3490, lst: 5600 },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"

    // Try to fetch real data
    const stakeMovementData = await getStakeMovementData(timeRange)

    return NextResponse.json({ history: stakeMovementData })
  } catch (error) {
    console.error("Error fetching stake history, falling back to demo data:", error)
    // Fall back to demo data
    return NextResponse.json({ history: demoStakeHistory })
  }
}
