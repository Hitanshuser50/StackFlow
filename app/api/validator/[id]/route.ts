import { NextResponse } from "next/server"
import { getValidatorPerformance } from "@/lib/solana-client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const validatorId = params.id

    // Try to fetch real data
    const performanceData = await getValidatorPerformance(validatorId)

    return NextResponse.json(performanceData)
  } catch (error) {
    console.error(`Error fetching validator data for ${params.id}, falling back to demo data:`, error)

    // Return a more informative error message for debugging
    const errorMessage = error instanceof Error ? error.message : String(error)

    // Fall back to demo data
    return NextResponse.json({
      isDemo: true,
      error: errorMessage,
      current: {
        uptime: "99.87",
        skipRate: "0.42",
        commission: 7,
        apy: "6.8",
        totalStake: 2345678,
        delegatorCount: 432,
        voteCredits: 987654,
        epochVoteAccount: true,
        activatedStake: 2345678,
        delinquent: false,
      },
      historical: Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return {
          date: date.toISOString().split("T")[0],
          uptime: (98 + Math.random() * 2).toFixed(2),
          skipRate: (Math.random() * 1.5).toFixed(2),
          apy: (6.5 + Math.random() * 0.8).toFixed(2),
        }
      }),
    })
  }
}
