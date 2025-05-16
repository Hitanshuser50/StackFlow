import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/layout"
import ValidatorDetailView from "@/components/dashboard/validator-detail-view"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Validator ${params.id} | Solana Stake Flow Visualizer`,
    description: `Detailed analytics and performance metrics for validator ${params.id} on the Solana network.`,
  }
}

export default function ValidatorDetailPage({ params }: Props) {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ValidatorDetailView validatorId={params.id} />
      </div>
    </DashboardLayout>
  )
}
