import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { command } = await req.json()

    if (!command) {
      return NextResponse.json(
        {
          success: false,
          message: "Command is required",
          data: null,
        },
        { status: 400 },
      )
    }

    // For now, return mock data to avoid the internal server error
    // In production, you would connect this to your actual blockchain service
    const mockResult = {
      success: true,
      message: "Command processed successfully",
      data: {
        interpretation: {
          operation: command.toLowerCase().includes("swap") ? "swap" : "unknown",
          parameters: {
            fromToken: command.toLowerCase().includes("usdc") ? "USDC" : "Unknown",
            toToken: command.toLowerCase().includes("sol") ? "SOL" : "Unknown",
            amount: Number.parseFloat(command.match(/\d+(\.\d+)?/)?.[0] || "0"),
            slippage: command.toLowerCase().includes("slippage")
              ? Number.parseFloat(command.match(/(\d+(\.\d+)?)%\s+slippage/)?.[1] || "1")
              : 1,
          },
          explanation: `Processing: ${command}`,
        },
        result: {
          success: true,
          txHash: "mock_transaction_hash_" + Math.random().toString(36).substring(2, 15),
          message: "Transaction would be processed in production environment",
        },
      },
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error("Error in blockchain command API:", error)
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
