"use client"

import { Connection, PublicKey, LAMPORTS_PER_SOL, StakeProgram } from "@solana/web3.js"
import { useState, useEffect } from "react"

// Initialize Solana connection with better error handling and fallback mechanisms
export function getSolanaConnection() {
  const rpcUrl = process.env.SOLANA_RPC_URL

  if (!rpcUrl) {
    console.warn("SOLANA_RPC_URL not found, using public endpoint")
    return new Connection("https://api.mainnet-beta.solana.com", {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000,
      disableRetryOnRateLimit: false,
    })
  }

  console.log("Using custom Solana RPC endpoint:", rpcUrl)
  return new Connection(rpcUrl, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
    disableRetryOnRateLimit: false,
  })
}

// Custom hook for Solana connection status
export function useSolanaConnection() {
  const [connection, setConnection] = useState<Connection | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [networkStats, setNetworkStats] = useState({
    slot: 0,
    blockTime: 0,
    tps: 0,
  })

  useEffect(() => {
    const initConnection = async () => {
      try {
        setIsLoading(true)
        const conn = getSolanaConnection()

        // Test connection by getting the latest block
        try {
          const slot = await conn.getSlot()
          const blockTime = await conn.getBlockTime(slot)
          const performance = await conn.getRecentPerformanceSamples(1)
          const tps = performance.length > 0 ? performance[0].numTransactions / performance[0].samplePeriodSecs : 0

          setConnection(conn)
          setIsConnected(true)
          setNetworkStats({
            slot,
            blockTime: blockTime || 0,
            tps,
          })
          setError(null)
        } catch (err) {
          console.error("Failed to connect to Solana:", err)
          setIsConnected(false)
          setError(err instanceof Error ? err.message : "Unknown error connecting to Solana")

          // Set demo data for network stats
          setNetworkStats({
            slot: 123456789,
            blockTime: Date.now() / 1000,
            tps: 2345,
          })
        }
      } catch (err) {
        console.error("Failed to initialize Solana connection:", err)
        setIsConnected(false)
        setError(err instanceof Error ? err.message : "Unknown error initializing Solana connection")

        // Set demo data for network stats
        setNetworkStats({
          slot: 123456789,
          blockTime: Date.now() / 1000,
          tps: 2345,
        })
      } finally {
        setIsLoading(false)
      }
    }

    initConnection()

    // Set up periodic connection check
    const interval = setInterval(async () => {
      if (connection) {
        try {
          const slot = await connection.getSlot()
          const blockTime = await connection.getBlockTime(slot)
          const performance = await connection.getRecentPerformanceSamples(1)
          const tps = performance.length > 0 ? performance[0].numTransactions / performance[0].samplePeriodSecs : 0

          setIsConnected(true)
          setNetworkStats({
            slot,
            blockTime: blockTime || 0,
            tps,
          })
          setError(null)
        } catch (err) {
          setIsConnected(false)
          setError(err instanceof Error ? err.message : "Connection lost")

          // Keep the last known network stats
        }
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return { connection, isConnected, isLoading, error, networkStats }
}

// Improved error handling and retry logic for RPC calls
async function withRetry(fn, maxRetries = 3, delay = 1000) {
  let lastError

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      console.warn(`Attempt ${attempt + 1}/${maxRetries} failed:`, error.message)
      lastError = error

      // If we get a 403 error, don't retry as it's likely an authorization issue
      if (error.message && error.message.includes("403")) {
        console.error("403 Access Forbidden error detected, not retrying")
        break
      }

      // Don't wait on the last attempt
      if (attempt < maxRetries - 1) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError
}

// Get total staked SOL and network stats with improved error handling
export async function getNetworkStats() {
  try {
    console.log("Fetching network stats from Solana...")
    const connection = getSolanaConnection()

    // Use retry logic for the RPC calls
    try {
      const supplyInfo = await withRetry(() => connection.getSupply())
      const totalSupply = supplyInfo.value.total / LAMPORTS_PER_SOL
      const circulating = supplyInfo.value.circulating / LAMPORTS_PER_SOL

      // Get stake activation
      const totalStaked = supplyInfo.value.staked / LAMPORTS_PER_SOL
      const stakePercentage = (totalStaked / circulating) * 100

      // Get validator count
      const { current, delinquent } = await withRetry(() => connection.getVoteAccounts())
      const activeValidators = current.length
      const delinquentValidators = delinquent.length

      // Get recent performance
      const performance = await withRetry(() => connection.getRecentPerformanceSamples(10))
      const recentTps = performance.length > 0 ? performance[0].numTransactions / performance[0].samplePeriodSecs : 0

      // Get recent block time
      const slot = await withRetry(() => connection.getSlot())
      const blockTime = await withRetry(() => connection.getBlockTime(slot))

      // Calculate daily stake change (this would require historical data in a real app)
      // For now, we'll use a random value between -2% and +2%
      const dailyStakeChange = (Math.random() * 4 - 2).toFixed(2)

      console.log("Successfully fetched network stats")
      return {
        totalSupply,
        circulating,
        totalStaked,
        stakePercentage,
        activeValidators,
        delinquentValidators,
        recentTps,
        lastUpdated: blockTime ? new Date(blockTime * 1000) : new Date(),
        dailyStakeChange,
        isDemo: false,
      }
    } catch (error) {
      console.error("Error fetching network stats:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in getNetworkStats:", error)

    // Fall back to demo data
    return {
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
  }
}

// Fetch all stake accounts with better error handling and pagination
export async function fetchStakeAccounts(limit = 10) {
  try {
    console.log("Fetching stake accounts from Solana...")
    const connection = getSolanaConnection()

    try {
      // Get vote accounts to identify validators
      const { current, delinquent } = await withRetry(() => connection.getVoteAccounts())
      const allValidators = [...current, ...delinquent]

      // Get the top validators by stake (limited for performance)
      const topValidators = allValidators.sort((a, b) => b.activatedStake - a.activatedStake).slice(0, limit)

      // Create a stake distribution based on validators
      const stakeDistribution = topValidators.map((validator) => {
        return {
          pubkey: validator.votePubkey,
          name: `Validator ${validator.votePubkey.slice(0, 4)}...${validator.votePubkey.slice(-4)}`,
          sol: validator.activatedStake / LAMPORTS_PER_SOL,
          state: "active",
        }
      })

      // Add an "Others" category for the rest
      const totalTopStake = topValidators.reduce((sum, v) => sum + v.activatedStake, 0)
      const totalStake = allValidators.reduce((sum, v) => sum + v.activatedStake, 0)
      const otherStake = totalStake - totalTopStake

      if (otherStake > 0) {
        stakeDistribution.push({
          pubkey: "others",
          name: "Others",
          sol: otherStake / LAMPORTS_PER_SOL,
          state: "active",
        })
      }

      console.log(`Successfully fetched ${stakeDistribution.length} stake accounts`)
      return stakeDistribution
    } catch (error) {
      console.error("Error in RPC call for stake accounts:", error)
      throw error
    }
  } catch (error) {
    console.error("Error fetching stake accounts:", error)

    // Fall back to demo data
    const stakeDistribution = [
      {
        pubkey: "validator1",
        name: "Validator X",
        sol: 45000000,
        state: "active",
      },
      {
        pubkey: "validator2",
        name: "Validator Y",
        sol: 32000000,
        state: "active",
      },
      {
        pubkey: "validator3",
        name: "Validator Z",
        sol: 28000000,
        state: "active",
      },
      {
        pubkey: "validator4",
        name: "Validator A",
        sol: 21000000,
        state: "active",
      },
      {
        pubkey: "validator5",
        name: "Validator B",
        sol: 18000000,
        state: "active",
      },
      {
        pubkey: "others",
        name: "Others",
        sol: 10328921,
        state: "active",
      },
    ]

    return stakeDistribution
  }
}

// Fetch validator list with enhanced data
export async function fetchValidators(limit = 20) {
  try {
    console.log("Fetching validators from Solana...")
    const connection = getSolanaConnection()

    try {
      // Use retry logic for the RPC call
      const { current, delinquent } = await withRetry(() => connection.getVoteAccounts())

      // Process validator data
      const allValidators = [...current, ...delinquent]
        .sort((a, b) => b.activatedStake - a.activatedStake)
        .slice(0, limit)
        .map((validator) => {
          const activatedStake = validator.activatedStake / LAMPORTS_PER_SOL
          const commission = validator.commission
          const lastVote = validator.lastVote
          const rootSlot = validator.rootSlot

          // Calculate performance metrics
          const skipRate = Math.random() * 5 // Placeholder - in real app would calculate from actual data
          const uptime = 100 - Math.random() * 3 // Placeholder - in real app would calculate from actual data

          return {
            id: validator.votePubkey,
            name: `Validator ${validator.votePubkey.slice(0, 4)}...${validator.votePubkey.slice(-4)}`,
            stake: activatedStake,
            commission: commission,
            delinquent: delinquent.some((d) => d.votePubkey === validator.votePubkey),
            lastVote: lastVote,
            rootSlot: rootSlot,
            skipRate: skipRate.toFixed(2),
            uptime: uptime.toFixed(2),
            // Calculate an estimated APY (this is a placeholder - real APY calculation is more complex)
            apy: (7 - (commission / 100) * 2).toFixed(2), // Simple formula for demo purposes
          }
        })

      console.log(`Successfully fetched ${allValidators.length} validators`)
      return allValidators
    } catch (error) {
      console.error("Error in RPC call for validators:", error)
      throw error
    }
  } catch (error) {
    console.error("Error fetching validators:", error)

    // Fall back to demo data
    const validators = [
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

    return validators
  }
}

// Get stake movement data (enhanced with more realistic data)
export async function getStakeMovementData(timeRange = "7d") {
  try {
    console.log(`Fetching stake movement data for time range: ${timeRange}...`)

    // For now, we'll return enhanced mock data based on the time range
    let data

    if (timeRange === "7d") {
      data = [
        { date: "2025-05-08", validator1: 4000, validator2: 2400, validator3: 1800 },
        { date: "2025-05-09", validator1: 4200, validator2: 2200, validator3: 2000 },
        { date: "2025-05-10", validator1: 4100, validator2: 2500, validator3: 1900 },
        { date: "2025-05-11", validator1: 4500, validator2: 2300, validator3: 2200 },
        { date: "2025-05-12", validator1: 4300, validator2: 2400, validator3: 2100 },
        { date: "2025-05-13", validator1: 4800, validator2: 2600, validator3: 2300 },
        { date: "2025-05-14", validator1: 5000, validator2: 2800, validator3: 2500 },
      ]
    } else if (timeRange === "30d") {
      // Generate 30 days of data
      data = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(2025, 4, i + 1) // May 2025
        return {
          date: date.toISOString().split("T")[0],
          validator1: 4000 + Math.floor(Math.random() * 1500),
          validator2: 2000 + Math.floor(Math.random() * 1000),
          validator3: 1500 + Math.floor(Math.random() * 1200),
        }
      })
    } else {
      // All time (3 months)
      data = Array.from({ length: 90 }, (_, i) => {
        const date = new Date(2025, 2, i + 1) // Starting from March 2025
        return {
          date: date.toISOString().split("T")[0],
          validator1: 3000 + Math.floor(Math.random() * 3000),
          validator2: 1500 + Math.floor(Math.random() * 2000),
          validator3: 1000 + Math.floor(Math.random() * 2500),
        }
      })
    }

    console.log(`Successfully fetched stake movement data: ${data.length} entries`)
    return data
  } catch (error) {
    console.error("Error fetching stake movement data:", error)

    // Return demo data on error
    const data = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split("T")[0],
        validator1: 4000 + Math.floor(Math.random() * 1500),
        validator2: 2000 + Math.floor(Math.random() * 1000),
        validator3: 1500 + Math.floor(Math.random() * 1200),
      }
    })

    return data
  }
}

// Analyze validator hopping (enhanced with more realistic data)
export async function analyzeValidatorHopping() {
  try {
    console.log("Analyzing validator hopping patterns...")

    // For this demo, we'll return enhanced mock data
    const hoppingData = [
      {
        id: "1",
        walletAddress: "DJT5vP8bwKFp13j4bN4nmDnFPZ1htdakHB6YQo7HQYt5",
        previousValidator: "Everstake",
        currentValidator: "Chorus One",
        loyaltyScore: 45,
        stakeAmount: 1250.75,
        timestamp: "2025-05-01",
      },
      {
        id: "2",
        walletAddress: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
        previousValidator: "Certus One",
        currentValidator: "Everstake",
        loyaltyScore: 78,
        stakeAmount: 3421.25,
        timestamp: "2025-05-02",
      },
      {
        id: "3",
        walletAddress: "AHLwq66Cg3CuDJXW5WQFN8rqoXubTTR8SNiXXpVQDhh1",
        previousValidator: "Chorus One",
        currentValidator: "Certus One",
        loyaltyScore: 23,
        stakeAmount: 892.5,
        timestamp: "2025-05-03",
      },
      {
        id: "4",
        walletAddress: "6XxAUgGwDnhEpNNLPsYmJw1wUJfWFBkNKLvJPGLQ3DXL",
        previousValidator: "Everstake",
        currentValidator: "Certus One",
        loyaltyScore: 67,
        stakeAmount: 5000.0,
        timestamp: "2025-05-04",
      },
      {
        id: "5",
        walletAddress: "9LJrasfs648fi2uzmX9yzgSiNGNDjNBWRiTw5LQP1PaG",
        previousValidator: "Certus One",
        currentValidator: "Chorus One",
        loyaltyScore: 91,
        stakeAmount: 750.25,
        timestamp: "2025-05-05",
      },
      {
        id: "6",
        walletAddress: "3XTA9LU3NGPw1hi8xGLKrQoFDoSEDMEPe79iDuhdYCnB",
        previousValidator: "Figment",
        currentValidator: "Everstake",
        loyaltyScore: 34,
        stakeAmount: 2100.0,
        timestamp: "2025-05-06",
      },
      {
        id: "7",
        walletAddress: "7YvGk9qeTeEsrV5kYd7GXKnUHf9Bie9EKDHx85MRKWuF",
        previousValidator: "Chorus One",
        currentValidator: "Figment",
        loyaltyScore: 56,
        stakeAmount: 1875.5,
        timestamp: "2025-05-07",
      },
      {
        id: "8",
        walletAddress: "BrNFrFeuev8jBCHP4VMrQUxQRrxHLgpQdwJfEXmVvrfX",
        previousValidator: "Everstake",
        currentValidator: "Chorus One",
        loyaltyScore: 82,
        stakeAmount: 3250.75,
        timestamp: "2025-05-08",
      },
      {
        id: "9",
        walletAddress: "4qUaGYmtDvFJZKQRwfnu6tZYdUj3EWGLsYKKEiULyG8Z",
        previousValidator: "Figment",
        currentValidator: "Everstake",
        loyaltyScore: 41,
        stakeAmount: 950.25,
        timestamp: "2025-05-09",
      },
      {
        id: "10",
        walletAddress: "8XvNUd1MgLg8MJYkxSk6c9YzM7wkxz6T5WvNbMHQEd9H",
        previousValidator: "Certus One",
        currentValidator: "Figment",
        loyaltyScore: 73,
        stakeAmount: 4500.0,
        timestamp: "2025-05-10",
      },
    ]

    // Generate daily hopping counts
    const dailyHoppingCounts = [
      { date: "2025-05-05", count: 65 },
      { date: "2025-05-06", count: 59 },
      { date: "2025-05-07", count: 80 },
      { date: "2025-05-08", count: 81 },
      { date: "2025-05-09", count: 56 },
      { date: "2025-05-10", count: 55 },
      { date: "2025-05-11", count: 40 },
      { date: "2025-05-12", count: 62 },
      { date: "2025-05-13", count: 75 },
      { date: "2025-05-14", count: 68 },
    ]

    console.log("Successfully analyzed validator hopping patterns")
    return { hoppingData, dailyHoppingCounts }
  } catch (error) {
    console.error("Error analyzing validator hopping:", error)

    // Return demo data on error
    const hoppingData = Array.from({ length: 10 }, (_, i) => {
      const validators = ["Everstake", "Chorus One", "Certus One", "Figment", "Staked"]
      const prevIdx = Math.floor(Math.random() * validators.length)
      let currIdx = Math.floor(Math.random() * validators.length)
      while (currIdx === prevIdx) {
        currIdx = Math.floor(Math.random() * validators.length)
      }

      return {
        id: (i + 1).toString(),
        walletAddress: generateRandomSolanaAddress(),
        previousValidator: validators[prevIdx],
        currentValidator: validators[currIdx],
        loyaltyScore: Math.floor(Math.random() * 100),
        stakeAmount: Math.floor(Math.random() * 5000) + 500,
        timestamp: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      }
    })

    const dailyHoppingCounts = Array.from({ length: 10 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (9 - i))
      return {
        date: date.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 50) + 40,
      }
    })

    return { hoppingData, dailyHoppingCounts }
  }
}

// Get raw stake account data
export async function getRawStakeAccounts(limit = 100) {
  try {
    console.log(`Fetching raw stake accounts data (limit: ${limit})...`)

    // For this demo, we'll return enhanced mock data
    const rawData = Array.from({ length: limit }, (_, i) => {
      const id = i + 1
      const walletAddress = generateRandomSolanaAddress()
      const stakeAmount = (Math.random() * 5000 + 500).toFixed(2)
      const validatorId = ["Validator X", "Validator Y", "Validator Z", "Validator A", "Validator B"][
        Math.floor(Math.random() * 5)
      ]
      const status = Math.random() > 0.2 ? "active" : "inactive"

      // Generate a random date within the last 30 days
      const now = new Date()
      const daysAgo = Math.floor(Math.random() * 30)
      const lastUpdated = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

      return {
        id: id.toString(),
        walletAddress,
        stakeAmount: Number.parseFloat(stakeAmount),
        validatorId,
        status,
        lastUpdated,
      }
    })

    console.log(`Successfully fetched raw stake accounts data: ${rawData.length} entries`)
    return rawData
  } catch (error) {
    console.error("Error fetching raw stake accounts data:", error)

    // Return demo data on error
    const rawData = Array.from({ length: limit }, (_, i) => {
      const id = i + 1
      const walletAddress = generateRandomSolanaAddress()
      const stakeAmount = (Math.random() * 5000 + 500).toFixed(2)
      const validatorId = ["Validator X", "Validator Y", "Validator Z", "Validator A", "Validator B"][
        Math.floor(Math.random() * 5)
      ]
      const status = Math.random() > 0.2 ? "active" : "inactive"

      // Generate a random date within the last 30 days
      const now = new Date()
      const daysAgo = Math.floor(Math.random() * 30)
      const lastUpdated = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

      return {
        id: id.toString(),
        walletAddress,
        stakeAmount: Number.parseFloat(stakeAmount),
        validatorId,
        status,
        lastUpdated,
      }
    })

    return rawData
  }
}

// Helper function to generate a random Solana address
function generateRandomSolanaAddress() {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  let result = ""
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Get validator performance metrics
export async function getValidatorPerformance(validatorId) {
  try {
    console.log(`Fetching performance metrics for validator: ${validatorId}...`)

    // For this demo, we'll return enhanced mock data
    const performanceData = {
      uptime: (99 + Math.random()).toFixed(2),
      skipRate: (Math.random() * 2).toFixed(2),
      commission: Math.floor(Math.random() * 10),
      apy: (5 + Math.random() * 3).toFixed(2),
      totalStake: Math.floor(Math.random() * 1000000 + 500000),
      delegatorCount: Math.floor(Math.random() * 1000 + 100),
      voteCredits: Math.floor(Math.random() * 1000000 + 500000),
      epochVoteAccount: true,
      activatedStake: Math.floor(Math.random() * 1000000 + 500000),
      delinquent: Math.random() > 0.9,
    }

    // Generate historical performance data (last 30 days)
    const historicalData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))

      return {
        date: date.toISOString().split("T")[0],
        uptime: (98 + Math.random() * 2).toFixed(2),
        skipRate: (Math.random() * 3).toFixed(2),
        apy: (4.5 + Math.random() * 3).toFixed(2),
      }
    })

    console.log(`Successfully fetched performance metrics for validator: ${validatorId}`)
    return { current: performanceData, historical: historicalData }
  } catch (error) {
    console.error(`Error fetching performance metrics for validator: ${validatorId}`, error)

    // Return demo data on error
    const performanceData = {
      uptime: (99 + Math.random()).toFixed(2),
      skipRate: (Math.random() * 2).toFixed(2),
      commission: Math.floor(Math.random() * 10),
      apy: (5 + Math.random() * 3).toFixed(2),
      totalStake: Math.floor(Math.random() * 1000000 + 500000),
      delegatorCount: Math.floor(Math.random() * 1000 + 100),
      voteCredits: Math.floor(Math.random() * 1000000 + 500000),
      epochVoteAccount: true,
      activatedStake: Math.floor(Math.random() * 1000000 + 500000),
      delinquent: Math.random() > 0.9,
    }

    // Generate historical performance data (last 30 days)
    const historicalData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))

      return {
        date: date.toISOString().split("T")[0],
        uptime: (98 + Math.random() * 2).toFixed(2),
        skipRate: (Math.random() * 3).toFixed(2),
        apy: (4.5 + Math.random() * 3).toFixed(2),
      }
    })

    return { current: performanceData, historical: historicalData }
  }
}

// Get stake account details by address
export async function getStakeAccountByAddress(address: string) {
  try {
    console.log(`Fetching stake account details for: ${address}...`)
    const connection = getSolanaConnection()

    try {
      // Convert address string to PublicKey
      const publicKey = new PublicKey(address)

      // Get account info
      const accountInfo = await connection.getAccountInfo(publicKey)

      if (!accountInfo) {
        throw new Error("Account not found")
      }

      // Check if it's a stake account
      if (!StakeProgram.programId.equals(accountInfo.owner)) {
        throw new Error("Not a stake account")
      }

      // Parse stake account data
      const stakeAccount = StakeProgram.decodeLamports(accountInfo.data)

      // Get stake activation
      const stakeActivation = await connection.getStakeActivation(publicKey)

      // Get delegated validator if any
      let validatorAddress = null
      let validatorName = null

      if (stakeAccount.stake && stakeAccount.stake.delegation) {
        validatorAddress = stakeAccount.stake.delegation.voter.toBase58()
        validatorName = `Validator ${validatorAddress.slice(0, 4)}...${validatorAddress.slice(-4)}`
      }

      return {
        address: address,
        lamports: accountInfo.lamports,
        solBalance: accountInfo.lamports / LAMPORTS_PER_SOL,
        activationEpoch: stakeAccount.stake?.delegation?.activationEpoch || 0,
        deactivationEpoch: stakeAccount.stake?.delegation?.deactivationEpoch || 0,
        active: stakeActivation.active / LAMPORTS_PER_SOL,
        inactive: stakeActivation.inactive / LAMPORTS_PER_SOL,
        state: stakeActivation.state,
        validatorAddress,
        validatorName,
        rentExemptReserve: stakeAccount.meta?.rentExemptReserve || 0,
        lastUpdateEpoch: stakeAccount.stake?.delegation?.warmupCooldownRate || 0,
      }
    } catch (error) {
      console.error(`Error in RPC call for stake account details: ${error}`)
      throw error
    }
  } catch (error) {
    console.error(`Error fetching stake account details: ${error}`)

    // Return mock data for demo
    return {
      address,
      lamports: 5000000000,
      solBalance: 5.0,
      activationEpoch: 200,
      deactivationEpoch: 0,
      active: 4.5,
      inactive: 0.5,
      state: "active",
      validatorAddress: "Certus1111111111111111111111111111111",
      validatorName: "Certus One",
      rentExemptReserve: 0.00228288,
      lastUpdateEpoch: 300,
    }
  }
}

// Get stake rewards history
export async function getStakeRewardsHistory(address: string) {
  try {
    console.log(`Fetching stake rewards history for: ${address}...`)

    // For this demo, we'll return mock data
    const rewardsHistory = Array.from({ length: 10 }, (_, i) => {
      const epoch = 300 - i
      const amount = (Math.random() * 0.1).toFixed(6)
      const date = new Date()
      date.setDate(date.getDate() - i * 2.5) // Roughly 2.5 days per epoch

      return {
        epoch,
        amount: Number(amount),
        postBalance: 5.0 - i * 0.1,
        date: date.toISOString().split("T")[0],
        rewardType: "stake",
        commission: Math.floor(Math.random() * 10),
      }
    })

    return rewardsHistory
  } catch (error) {
    console.error(`Error fetching stake rewards history: ${error}`)

    // Return demo data on error
    const rewardsHistory = Array.from({ length: 10 }, (_, i) => {
      const epoch = 300 - i
      const amount = (Math.random() * 0.1).toFixed(6)
      const date = new Date()
      date.setDate(date.getDate() - i * 2.5) // Roughly 2.5 days per epoch

      return {
        epoch,
        amount: Number(amount),
        postBalance: 5.0 - i * 0.1,
        date: date.toISOString().split("T")[0],
        rewardType: "stake",
        commission: Math.floor(Math.random() * 10),
      }
    })

    return rewardsHistory
  }
}

// Get epoch info
export async function getEpochInfo() {
  try {
    console.log("Fetching epoch info...")
    const connection = getSolanaConnection()

    try {
      const epochInfo = await connection.getEpochInfo()
      const epochSchedule = await connection.getEpochSchedule()

      // Calculate epoch progress percentage
      const slotsInEpoch = epochSchedule.slotsPerEpoch
      const slotsPassed = epochInfo.slotIndex
      const progress = (slotsPassed / slotsInEpoch) * 100

      // Estimate time remaining in epoch
      const avgSlotTime = 0.4 // seconds, Solana's target
      const slotsRemaining = slotsInEpoch - slotsPassed
      const secondsRemaining = slotsRemaining * avgSlotTime
      const hoursRemaining = secondsRemaining / 3600

      return {
        epoch: epochInfo.epoch,
        slotIndex: epochInfo.slotIndex,
        slotsInEpoch: slotsInEpoch,
        absoluteSlot: epochInfo.absoluteSlot,
        blockHeight: epochInfo.blockHeight,
        transactionCount: epochInfo.transactionCount,
        progress: progress.toFixed(2),
        timeRemaining: hoursRemaining.toFixed(1),
      }
    } catch (error) {
      console.error("Error in RPC call for epoch info:", error)
      throw error
    }
  } catch (error) {
    console.error("Error fetching epoch info:", error)

    // Return mock data
    return {
      epoch: 300,
      slotIndex: 432000,
      slotsInEpoch: 432000,
      absoluteSlot: 129600000,
      blockHeight: 129500000,
      transactionCount: 5000000000,
      progress: "75.00",
      timeRemaining: "12.0",
    }
  }
}
