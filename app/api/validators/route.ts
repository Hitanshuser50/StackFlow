import { NextResponse } from "next/server"
import { fetchValidators } from "@/lib/solana-client"

// Demo data as fallback
const demoValidators = [
  {
    id: "validator1",
    name: "Everstake",
    stake: 45000000,
    commission: 7,
    delinquent: false,
    lastVote: 123456789,
    rootSlot: 123456700,
    skipRate: "1.23",
    uptime: "99.87",
    apy: "6.50",
  },
  {
    id: "validator2",
    name: "Chorus One",
    stake: 32000000,
    commission: 5,
    delinquent: false,
    lastVote: 123456788,
    rootSlot: 123456699,
    skipRate: "0.89",
    uptime: "99.92",
    apy: "6.80",
  },
  {
    id: "validator3",
    name: "Certus One",
    stake: 28000000,
    commission: 8,
    delinquent: false,
    lastVote: 123456787,
    rootSlot: 123456698,
    skipRate: "1.45",
    uptime: "99.78",
    apy: "6.30",
  },
  {
    id: "validator4",
    name: "Figment",
    stake: 21000000,
    commission: 6,
    delinquent: false,
    lastVote: 123456786,
    rootSlot: 123456697,
    skipRate: "1.12",
    uptime: "99.85",
    apy: "6.60",
  },
  {
    id: "validator5",
    name: "Staked",
    stake: 18000000,
    commission: 9,
    delinquent: true,
    lastVote: 123456785,
    rootSlot: 123456696,
    skipRate: "2.34",
    uptime: "98.65",
    apy: "6.10",
  },
]

export async function GET() {
  try {
    // Try to fetch real data
    const validators = await fetchValidators()
    return NextResponse.json({ validators })
  } catch (error) {
    console.error("Error fetching validators, falling back to demo data:", error)
    // Fall back to demo data
    return NextResponse.json({ validators: demoValidators })
  }
}
