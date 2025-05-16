import { OpenAI } from "openai"
import { createAITools, getSolanaAgent } from "./solana-agent"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Process natural language commands for blockchain operations
export async function processBlockchainCommand(command: string) {
  try {
    // Get Solana Agent and AI tools
    const agent = await getSolanaAgent()
    const tools = await createAITools()

    // Use OpenAI to interpret the command
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a blockchain assistant that helps users interact with Solana. Interpret the user's command and determine which blockchain operation to perform.",
        },
        {
          role: "user",
          content: command,
        },
      ],
      tools: tools.map((tool) => ({
        type: "function" as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters as any,
        },
      })),
    })

    // Extract the tool call
    const toolCall = response.choices[0]?.message?.tool_calls?.[0]

    if (!toolCall) {
      return {
        success: false,
        message: "Could not determine the appropriate blockchain operation",
        data: null,
      }
    }

    // Find the matching tool
    const matchingTool = tools.find((t) => t.name === toolCall.function.name)

    if (!matchingTool) {
      return {
        success: false,
        message: `Tool ${toolCall.function.name} not found`,
        data: null,
      }
    }

    // Parse arguments
    const args = JSON.parse(toolCall.function.arguments)

    // Execute the tool
    const result = await matchingTool.execute(args)

    return {
      success: true,
      message: `Successfully executed ${toolCall.function.name}`,
      data: result,
    }
  } catch (error) {
    console.error("Error processing blockchain command:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    }
  }
}

// Generate NFT artwork using DALL-E
export async function generateNFTArtwork(prompt: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a high-quality, detailed NFT artwork with the following description: ${prompt}. The artwork should be suitable for a Solana NFT collection, with vibrant colors and a digital art style.`,
      n: 1,
      size: "1024x1024",
    })

    return {
      success: true,
      message: "Successfully generated NFT artwork",
      data: {
        url: response.data[0]?.url,
        revisedPrompt: response.data[0]?.revised_prompt,
      },
    }
  } catch (error) {
    console.error("Error generating NFT artwork:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    }
  }
}

// Get market analysis and insights
export async function getMarketAnalysis(token: string) {
  try {
    const agent = await getSolanaAgent()

    // Get price data from Pyth
    const priceFeedID = await agent.methods.fetchPythPriceFeedID(token)
    const price = await agent.methods.fetchPythPrice(priceFeedID)

    // Get price inference from Allora if available
    let priceInference = null
    try {
      priceInference = await agent.methods.getPriceInference(token, "5m")
    } catch (error) {
      console.warn(`Could not get price inference for ${token}:`, error)
    }

    // Get token information from CoinGecko
    let tokenInfo = null
    try {
      // This is a placeholder - the actual method name might be different
      tokenInfo = await agent.methods.getTokenInfo(token)
    } catch (error) {
      console.warn(`Could not get token info for ${token}:`, error)
    }

    // Generate market analysis using OpenAI
    const analysisPrompt = `
      Provide a brief market analysis for ${token} with the following data:
      - Current price: ${price}
      - 5-minute price inference: ${priceInference || "Not available"}
      - Market cap: ${tokenInfo?.market_cap || "Not available"}
      - 24h volume: ${tokenInfo?.volume_24h || "Not available"}
      - 24h price change: ${tokenInfo?.price_change_24h || "Not available"}
    `

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a cryptocurrency market analyst. Provide a concise, data-driven analysis of the token.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
    })

    return {
      success: true,
      message: "Successfully generated market analysis",
      data: {
        token,
        price,
        priceInference,
        tokenInfo,
        analysis: analysisResponse.choices[0]?.message?.content,
      },
    }
  } catch (error) {
    console.error("Error generating market analysis:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    }
  }
}

async function getWalletAddress(): Promise<string> {
  // Placeholder implementation - replace with actual logic to fetch wallet address
  return "0x1234567890abcdef"
}

// Generate automated decision recommendations
export async function getAutomatedDecisionRecommendations(context: {
  token?: string
  amount?: number
  action?: string
  timeframe?: string
}) {
  try {
    const agent = await getSolanaAgent()

    // Get current market data
    let marketData = null
    if (context.token) {
      try {
        const priceFeedID = await agent.methods.fetchPythPriceFeedID(context.token)
        const price = await agent.methods.fetchPythPrice(priceFeedID)
        marketData = { price }
      } catch (error) {
        console.warn(`Could not get market data for ${context.token}:`, error)
      }
    }

    // Get wallet balance
    const walletAddress = await getWalletAddress()
    let walletBalance = null
    try {
      // This is a placeholder - the actual method name might be different
      walletBalance = await agent.methods.getWalletBalance(agent)
    } catch (error) {
      console.warn("Could not get wallet balance:", error)
    }

    // Generate decision recommendations using OpenAI
    const decisionPrompt = `
      Generate automated decision recommendations for a Solana blockchain user with the following context:
      - Token: ${context.token || "Not specified"}
      - Current price: ${marketData?.price || "Not available"}
      - Action being considered: ${context.action || "Not specified"}
      - Amount: ${context.amount || "Not specified"}
      - Timeframe: ${context.timeframe || "Not specified"}
      - Wallet balance: ${walletBalance || "Not available"}
      - Wallet address: ${walletAddress}
      
      Provide 3 specific recommendations with rationale, risks, and potential outcomes.
    `

    const decisionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a blockchain investment advisor. Provide data-driven, specific recommendations for Solana blockchain actions.",
        },
        {
          role: "user",
          content: decisionPrompt,
        },
      ],
    })

    return {
      success: true,
      message: "Successfully generated decision recommendations",
      data: {
        context,
        marketData,
        walletBalance,
        recommendations: decisionResponse.choices[0]?.message?.content,
      },
    }
  } catch (error) {
    console.error("Error generating decision recommendations:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    }
  }
}
