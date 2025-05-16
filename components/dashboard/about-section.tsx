"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">About</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Stake Flow?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Stake Flow refers to the movement of staked SOL tokens across the Solana network. By tracking these
                  movements, we can identify trends in how users are delegating their tokens to validators, which
                  validators are gaining or losing stake, and how the overall staking landscape is evolving over time.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What is Validator Hopping?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Validator Hopping is the behavior where stakers move their delegated SOL from one validator to
                  another. This can happen for various reasons:
                </p>
                <ul className="list-disc pl-6 pt-2">
                  <li>Seeking better rewards or lower commission rates</li>
                  <li>Responding to validator performance issues</li>
                  <li>Diversifying stake across multiple validators</li>
                  <li>Following recommendations from staking platforms or communities</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Why These Insights Matter</AccordionTrigger>
              <AccordionContent>
                <p>
                  Understanding stake flow and validator hopping patterns provides valuable insights for different
                  stakeholders in the Solana ecosystem:
                </p>
                <ul className="list-disc pl-6 pt-2">
                  <li>
                    <strong>For Validators:</strong> Helps identify what factors lead to stake retention or loss,
                    allowing for optimization of operations and commission strategies.
                  </li>
                  <li>
                    <strong>For Developers:</strong> Provides data that can be used to build better staking applications
                    and tools that help users make informed decisions.
                  </li>
                  <li>
                    <strong>For the Ecosystem:</strong> Promotes transparency and helps identify potential
                    centralization risks if too much stake is flowing to a small number of validators.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How We Calculate Loyalty Scores</AccordionTrigger>
              <AccordionContent>
                <p>
                  Our loyalty score is a metric that quantifies how loyal stakers are to particular validators. The
                  score ranges from 0 to 100, with higher scores indicating greater loyalty. The calculation takes into
                  account:
                </p>
                <ul className="list-disc pl-6 pt-2">
                  <li>Duration of stake with a validator</li>
                  <li>Frequency of validator changes</li>
                  <li>Percentage of total stake maintained with a validator over time</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Data Sources</AccordionTrigger>
              <AccordionContent>
                <p>
                  All data is sourced directly from the Solana blockchain using RPC endpoints. We process and analyze
                  this data to extract meaningful patterns and present them in an accessible format. The dashboard is
                  updated regularly to ensure the information remains current and relevant.
                </p>
                <p className="mt-2">
                  <strong>Note:</strong> Currently, the dashboard is operating in demo mode using simulated data due to
                  RPC access limitations.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
