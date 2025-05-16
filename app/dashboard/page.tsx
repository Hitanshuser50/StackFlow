import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/layout"
import OverviewSection from "@/components/dashboard/overview-section"
import StakeFlowSection from "@/components/dashboard/stake-flow-section"
import ValidatorHoppingSection from "@/components/dashboard/validator-hopping-section"
import AdvancedMetricsClient from "@/components/dashboard/advanced-metrics-client"
import RawDataSection from "@/components/dashboard/raw-data-section"
import { ValidatorComparison } from "@/components/validator-comparison"
import { StakeFlowPatterns } from "@/components/stake-flow-patterns"
import { DelegatorSupport } from "@/components/delegator-support"
import { HistoricalPerformance } from "@/components/historical-performance"
import { DataExport } from "@/components/data-export"
import MetricFlashCards from "@/components/dashboard/metric-flash-cards"
import AnimatedVisualizations from "@/components/dashboard/animated-visualizations"
import ProFeatures from "@/components/pro-features"

export const metadata: Metadata = {
  title: "Dashboard | Solana Stake Flow Visualizer",
  description: "Visualize and analyze Solana stake flow data",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <OverviewSection />
        <div className="mb-8">
          <MetricFlashCards />
        </div>

        <div className="mb-8">
          <ProFeatures />
        </div>

        <div className="mb-8">
          <AnimatedVisualizations />
        </div>
        <StakeFlowSection />
        <ValidatorHoppingSection />
        <ValidatorComparison />
        <StakeFlowPatterns />
        <DelegatorSupport />
        <HistoricalPerformance />
        <AdvancedMetricsClient />
        <RawDataSection />
        <DataExport />
      </div>
    </DashboardLayout>
  )
}
