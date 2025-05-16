import { NextResponse } from "next/server"
import { analyzeValidatorHopping } from "@/lib/solana-client"

// Demo data as fallback
const demoHoppingData = [
  {
    id: "1",
    walletAddress: "Wallet1...5Kp",
    previousValidator: "Validator X",
    currentValidator: "Validator Y",
    loyaltyScore: 45,
    stakeAmount: 1250.75,
    timestamp: "2023-05-01",
  },
  {
    id: "2",
    walletAddress: "Wallet2...8Jq",
    previousValidator: "Validator Z",
    currentValidator: "Validator X",
    loyaltyScore: 78,
    stakeAmount: 3421.25,
    timestamp: "2023-05-02",
  },
  {
    id: "3",
    walletAddress: "Wallet3...2Rs",
    previousValidator: "Validator Y",
    currentValidator: "Validator Z",
    loyaltyScore: 23,
    stakeAmount: 892.5,
    timestamp: "2023-05-03",
  },
  {
    id: "4",
    walletAddress: "Wallet4...9Tp",
    previousValidator: "Validator X",
    currentValidator: "Validator Z",
    loyaltyScore: 67,
    stakeAmount: 5000.0,
    timestamp: "2023-05-04",
  },
  {
    id: "5",
    walletAddress: "Wallet5...3Lm",
    previousValidator: "Validator Z",
    currentValidator: "Validator Y",
    loyaltyScore: 91,
    stakeAmount: 750.25,
    timestamp: "2023-05-05",
  },
]

const demoDailyHoppingCounts = [
  { date: "2023-05-01", count: 65 },
  { date: "2023-05-02", count: 59 },
  { date: "2023-05-03", count: 80 },
  { date: "2023-05-04", count: 81 },
  { date: "2023-05-05", count: 56 },
  { date: "2023-05-06", count: 55 },
  { date: "2023-05-07", count: 40 },
]

export async function GET() {
  try {
    // Try to fetch real data
    const { hoppingData, dailyHoppingCounts } = await analyzeValidatorHopping()
    return NextResponse.json({ hoppingData, dailyHoppingCounts })
  } catch (error) {
    console.error("Error analyzing validator hopping, falling back to demo data:", error)
    // Generate realistic validator hopping data
    const data = [
      { validator: "Everstake", inflow: 5000, outflow: 3000, net: 2000 },
      { validator: "Chorus One", inflow: 4200, outflow: 4500, net: -300 },
      { validator: "Certus One", inflow: 3800, outflow: 2900, net: 900 },
      { validator: "Figment", inflow: 2500, outflow: 3200, net: -700 },
      { validator: "Staked", inflow: 4800, outflow: 3600, net: 1200 },
      { validator: "P2P Validator", inflow: 3200, outflow: 2800, net: 400 },
      { validator: "Blockdaemon", inflow: 2900, outflow: 3100, net: -200 },
      { validator: "Dokia Capital", inflow: 3500, outflow: 2700, net: 800 },
    ]

    return NextResponse.json(data)
  }
}
