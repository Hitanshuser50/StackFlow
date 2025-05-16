import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import DashboardPreview from "@/components/dashboard-preview"
import UseCasesSection from "@/components/use-cases-section"
import CallToAction from "@/components/call-to-action"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Solana Stake Flow Visualizer | Real-time Solana Analytics",
  description:
    "Track and analyze Solana stake movements, validator performance, and network metrics in real-time with our advanced analytics dashboard.",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-black to-[#0a0118]">
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <UseCasesSection />
      <CallToAction />
    </main>
  )
}
