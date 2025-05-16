import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const context = await req.json()

    // For now, return mock data to avoid the internal server error
    // In production, you would connect this to your actual AI service
    const mockResult = {
      success: true,
      message: "Successfully generated decision recommendations",
      data: {
        context,
        marketData: {
          price: context.token === "SOL" ? 150.25 : 1.0,
          change24h: context.token === "SOL" ? 5.2 : 0.1,
          volume24h: context.token === "SOL" ? "1.2B" : "100M",
        },
        walletBalance: {
          SOL: 10.5,
          USDC: 500,
        },
        recommendations: `
RECOMMENDATION 1:
${context.action === "stake" ? "Stake 50% of your SOL holdings" : "Swap 30% of your holdings to SOL"}
Rationale: Current market conditions show bullish momentum for SOL with increasing validator rewards.
Risks: Short-term volatility may affect immediate returns.
Potential outcome: 8-12% APY with potential for capital appreciation.

RECOMMENDATION 2:
Diversify by allocating 20% to JitoSOL
Rationale: Liquid staking provides flexibility while earning comparable yields.
Risks: Smart contract risks and potential slashing events.
Potential outcome: Similar APY to direct staking with added liquidity benefits.

RECOMMENDATION 3:
Hold 30% in reserve for upcoming market opportunities
Rationale: Market indicators suggest potential buying opportunities in the next 7-10 days.
Risks: Opportunity cost of not being fully invested.
Potential outcome: Ability to capitalize on short-term price corrections.
        `,
      },
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error("Error in decision recommendations API:", error)
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
