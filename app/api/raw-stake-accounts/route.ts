import { NextResponse } from "next/server"
import { getRawStakeAccounts } from "@/lib/solana-client"

// Demo data as fallback
const demoRawData = [
  {
    id: "1",
    walletAddress: "DJT5vP8bwKFp13j4bN4nmDnFPZ1htdakHB6YQo7HQYt5",
    stakeAmount: 1250.75,
    validatorId: "Validator Y",
    status: "active",
    lastUpdated: "2023-05-01T12:30:45Z",
  },
  {
    id: "2",
    walletAddress: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
    stakeAmount: 3421.25,
    validatorId: "Validator X",
    status: "active",
    lastUpdated: "2023-05-02T09:15:22Z",
  },
  {
    id: "3",
    walletAddress: "AHLwq66Cg3CuDJXW5WQFN8rqoXubTTR8SNiXXpVQDhh1",
    stakeAmount: 892.5,
    validatorId: "Validator Z",
    status: "active",
    lastUpdated: "2023-05-03T14:45:10Z",
  },
  {
    id: "4",
    walletAddress: "6XxAUgGwDnhEpNNLPsYmJw1wUJfWFBkNKLvJPGLQ3DXL",
    stakeAmount: 5000.0,
    validatorId: "Validator Z",
    status: "active",
    lastUpdated: "2023-05-04T11:20:33Z",
  },
  {
    id: "5",
    walletAddress: "9LJrasfs648fi2uzmX9yzgSiNGNDjNBWRiTw5LQP1PaG",
    stakeAmount: 750.25,
    validatorId: "Validator Y",
    status: "inactive",
    lastUpdated: "2023-05-05T16:05:18Z",
  },
  {
    id: "6",
    walletAddress: "3XTA9LU3NGPw1hi8xGLKrQoFDoSEDMEPe79iDuhdYCnB",
    stakeAmount: 2100.0,
    validatorId: "Validator X",
    status: "active",
    lastUpdated: "2023-05-06T10:40:55Z",
  },
  {
    id: "7",
    walletAddress: "7YvGk9qeTeEsrV5kYd7GXKnUHf9Bie9EKDHx85MRKWuF",
    stakeAmount: 1875.5,
    validatorId: "Validator Z",
    status: "inactive",
    lastUpdated: "2023-05-07T13:25:42Z",
  },
  {
    id: "8",
    walletAddress: "BrNFrFeuev8jBCHP4VMrQUxQRrxHLgpQdwJfEXmVvrfX",
    stakeAmount: 3250.75,
    validatorId: "Validator Y",
    status: "active",
    lastUpdated: "2023-05-08T15:10:29Z",
  },
  {
    id: "9",
    walletAddress: "4qUaGYmtDvFJZKQRwfnu6tZYdUj3EWGLsYKKEiULyG8Z",
    stakeAmount: 950.25,
    validatorId: "Validator X",
    status: "active",
    lastUpdated: "2023-05-09T08:55:17Z",
  },
  {
    id: "10",
    walletAddress: "8XvNUd1MgLg8MJYkxSk6c9YzM7wkxz6T5WvNbMHQEd9H",
    stakeAmount: 4500.0,
    validatorId: "Validator Z",
    status: "active",
    lastUpdated: "2023-05-10T17:30:05Z",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100", 10)

    // Try to fetch real data
    const rawData = await getRawStakeAccounts(limit)
    return NextResponse.json({ rawData })
  } catch (error) {
    console.error("Error fetching raw stake accounts, falling back to demo data:", error)
    // Fall back to demo data
    return NextResponse.json({ rawData: demoRawData })
  }
}
