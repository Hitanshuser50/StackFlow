import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowUpDown, Plus, Send, Coins, History } from "lucide-react"

export const metadata: Metadata = {
  title: "Wallet | Solana Stake Flow Visualizer",
  description: "Manage your Solana wallet and transactions",
}

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-purple to-premium-pink bg-clip-text text-transparent">
          Wallet
        </h1>
        <p className="text-gray-400 mt-2">Manage your Solana wallet, tokens, and transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card shadow-premium md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Wallet Overview
            </CardTitle>
            <CardDescription className="text-gray-400">Your wallet balance and assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-400">Total Balance</div>
                <div className="text-3xl font-bold text-white">245.32 SOL</div>
                <div className="text-sm text-gray-400">≈ $24,532.00</div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-premium-purple hover:bg-premium-purple/80">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Button
                  variant="outline"
                  className="border-premium-lightBlue/30 text-gray-300 hover:bg-premium-lightBlue/20 hover:text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Receive
                </Button>
                <Button
                  variant="outline"
                  className="border-premium-lightBlue/30 text-gray-300 hover:bg-premium-lightBlue/20 hover:text-white"
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Swap
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                    <Coins className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">SOL</div>
                    <div className="text-xs text-gray-400">Solana</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">245.32 SOL</div>
                  <div className="text-xs text-gray-400">≈ $24,532.00</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#2775CA] flex items-center justify-center">
                    <div className="text-white font-bold text-xs">$</div>
                  </div>
                  <div>
                    <div className="font-medium">USDC</div>
                    <div className="text-xs text-gray-400">USD Coin</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">1,250.00 USDC</div>
                  <div className="text-xs text-gray-400">≈ $1,250.00</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#E84142] flex items-center justify-center">
                    <div className="text-white font-bold text-xs">B</div>
                  </div>
                  <div>
                    <div className="font-medium">BONK</div>
                    <div className="text-xs text-gray-400">Bonk Token</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">5,000,000 BONK</div>
                  <div className="text-xs text-gray-400">≈ $150.00</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Wallet Info
            </CardTitle>
            <CardDescription className="text-gray-400">Your wallet details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
                <div className="p-2 bg-premium-blue/20 rounded-md border border-premium-lightBlue/30 font-mono text-xs break-all">
                  DJT5vP8bwKFp13j4bN4nmDnFPZ1htdakHB6YQo7HQYt5
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Connected Network</div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Mainnet</Badge>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Wallet Type</div>
                <div className="text-sm">Keypair Wallet</div>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full border-premium-lightBlue/30 text-gray-300 hover:bg-premium-lightBlue/20 hover:text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Different Wallet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card shadow-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transactions
          </CardTitle>
          <CardDescription className="text-gray-400">Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-premium-blue/30 mb-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-premium-purple/30">
                All
              </TabsTrigger>
              <TabsTrigger value="sent" className="data-[state=active]:bg-premium-purple/30">
                Sent
              </TabsTrigger>
              <TabsTrigger value="received" className="data-[state=active]:bg-premium-purple/30">
                Received
              </TabsTrigger>
              <TabsTrigger value="staking" className="data-[state=active]:bg-premium-purple/30">
                Staking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium">Received SOL</div>
                    <div className="text-xs text-gray-400">May 15, 2025 • 10:23 AM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-500">+5.0 SOL</div>
                  <div className="text-xs text-gray-400">≈ $500.00</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Send className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium">Sent USDC</div>
                    <div className="text-xs text-gray-400">May 14, 2025 • 3:45 PM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-500">-250.0 USDC</div>
                  <div className="text-xs text-gray-400">≈ $250.00</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <ArrowUpDown className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-medium">Swapped SOL for BONK</div>
                    <div className="text-xs text-gray-400">May 13, 2025 • 11:12 AM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">1.5 SOL → 5,000,000 BONK</div>
                  <div className="text-xs text-gray-400">≈ $150.00</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <History className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">Staked SOL</div>
                    <div className="text-xs text-gray-400">May 12, 2025 • 9:30 AM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-blue-500">10.0 SOL</div>
                  <div className="text-xs text-gray-400">≈ $1,000.00</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Send className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium">Sent USDC</div>
                    <div className="text-xs text-gray-400">May 14, 2025 • 3:45 PM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-500">-250.0 USDC</div>
                  <div className="text-xs text-gray-400">≈ $250.00</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="received" className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium">Received SOL</div>
                    <div className="text-xs text-gray-400">May 15, 2025 • 10:23 AM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-500">+5.0 SOL</div>
                  <div className="text-xs text-gray-400">≈ $500.00</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="staking" className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-premium-blue/20 rounded-lg border border-premium-lightBlue/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <History className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">Staked SOL</div>
                    <div className="text-xs text-gray-400">May 12, 2025 • 9:30 AM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-blue-500">10.0 SOL</div>
                  <div className="text-xs text-gray-400">≈ $1,000.00</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
