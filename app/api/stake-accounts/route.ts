import { NextResponse } from "next/server"
import { fetchStakeAccounts } from "@/lib/solana-client"

// Demo data as fallback
const demoStakeAccounts = [
  { name: "Validator X", value: 45000000 },
  { name: "Validator Y", value: 32000000 },
  { name: "Validator Z", value: 28000000 },
  { name: "Validator A", value: 21000000 },
  { name: "Validator B", value: 18000000 },
  { name: "Others", value: 10328921 },
]

export async function GET() {
  try {
    // Try to fetch real data
    const stakeAccounts = await fetchStakeAccounts(10)

    // Convert to format needed for the pie chart
    const stakeDistribution = stakeAccounts.map((account) => ({
      name: account.name,
      value: account.sol,
    }))

    return NextResponse.json({
      stakeAccounts,
      stakeDistribution,
    })
  } catch (error) {
    console.error("Error fetching stake accounts, falling back to demo data:", error)
    // Fall back to demo data
    return NextResponse.json({
      stakeAccounts: demoStakeAccounts,
      stakeDistribution: demoStakeAccounts,
    })
  }
}
