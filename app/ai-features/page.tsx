import BlockchainCommander from "@/components/ai-features/blockchain-commander"
import DecisionMaker from "@/components/ai-features/decision-maker"

export default function AIFeaturesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        AI-Powered Solana Tools
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BlockchainCommander />
        <DecisionMaker />
      </div>

      <div className="mt-12 text-center text-gray-400 text-sm">
        <p>More AI features coming soon!</p>
      </div>
    </div>
  )
}
