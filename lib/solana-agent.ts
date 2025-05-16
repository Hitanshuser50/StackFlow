import { SolanaAgentKit } from "solana-agent-kit"
import { KeypairWallet } from "./wallet-adapter" // Use our custom wallet adapter
import TokenPlugin from "@solana-agent-kit/plugin-token"
import NFTPlugin from "@solana-agent-kit/plugin-nft"
import DefiPlugin from "@solana-agent-kit/plugin-defi"
import MiscPlugin from "@solana-agent-kit/plugin-misc"
import BlinksPlugin from "@solana-agent-kit/plugin-blinks"
import { Keypair } from "@solana/web3.js"
import bs58 from "bs58"

// Cache the agent instance
let agentInstance: SolanaAgentKit | null = null

// Initialize the Solana Agent Kit with all plugins
export async function getSolanaAgent(): Promise<SolanaAgentKit> {
  if (agentInstance) {
    return agentInstance
  }

  try {
    // In a real application, you would get this from a secure source
    // For demo purposes, we're using a placeholder
    const demoPrivateKey = "4rQanLxTFvdgtLKqzGJCFjLm2xfG8SLfAgXZEHmGDCWFQDsxXJQqtZGUHgFNmGGKnnhEPvUNKQVXZgHF7JnkzBik"
    const keyPair = Keypair.fromSecretKey(bs58.decode(demoPrivateKey))
    const wallet = new KeypairWallet(keyPair)

    // Initialize with private key and RPC URL
    const agent = new SolanaAgentKit(wallet, process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com", {
      // No OpenAI API key needed since we're using Gemini
    })
      .use(TokenPlugin)
      .use(NFTPlugin)
      .use(DefiPlugin)
      .use(MiscPlugin)
      .use(BlinksPlugin)

    agentInstance = agent
    return agent
  } catch (error) {
    console.error("Error initializing Solana Agent:", error)
    throw error
  }
}

// Create AI tools for the agent
export async function createAITools() {
  const agent = await getSolanaAgent()

  // This is a simplified version - in a real implementation, you would
  // create proper tools based on the agent's capabilities
  return [
    {
      name: "stakeSOL",
      description: "Stake SOL to a validator",
      parameters: {
        type: "object",
        properties: {
          amount: {
            type: "number",
            description: "Amount of SOL to stake",
          },
          validator: {
            type: "string",
            description: "Validator to stake to",
          },
        },
        required: ["amount"],
      },
      execute: async ({ amount }: { amount: number }) => {
        return await agent.methods.stakeWithJup(agent, amount)
      },
    },
    {
      name: "swapTokens",
      description: "Swap one token for another",
      parameters: {
        type: "object",
        properties: {
          sourceToken: {
            type: "string",
            description: "Token to swap from",
          },
          targetToken: {
            type: "string",
            description: "Token to swap to",
          },
          amount: {
            type: "number",
            description: "Amount to swap",
          },
          slippage: {
            type: "number",
            description: "Slippage tolerance in percentage",
          },
        },
        required: ["sourceToken", "targetToken", "amount"],
      },
      execute: async ({
        sourceToken,
        targetToken,
        amount,
        slippage = 1,
      }: {
        sourceToken: string
        targetToken: string
        amount: number
        slippage?: number
      }) => {
        // This is a placeholder - in a real implementation, you would
        // convert token symbols to public keys and call the appropriate method
        return { message: `Swap ${amount} ${sourceToken} to ${targetToken} with ${slippage}% slippage` }
      },
    },
    // Add more tools as needed
  ]
}
