import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Key, Shield, Moon, Sun, Laptop } from "lucide-react"

export const metadata: Metadata = {
  title: "Settings | Solana Stake Flow Visualizer",
  description: "Configure your application settings",
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-purple to-premium-pink bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Configure your application preferences and account settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-premium-blue/30 mb-6">
          <TabsTrigger value="general" className="data-[state=active]:bg-premium-purple/30">
            General
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-premium-purple/30">
            Wallet
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-premium-purple/30">
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-premium-purple/30">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-premium-purple/30">
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="glass-card shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Appearance
              </CardTitle>
              <CardDescription className="text-gray-400">Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <div className="text-sm text-gray-400">Select your preferred theme</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-premium-lightBlue/30 text-gray-300 hover:bg-premium-lightBlue/20 hover:text-white"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-premium-lightBlue/30 bg-premium-purple/20 text-premium-purple"
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-premium-lightBlue/30 text-gray-300 hover:bg-premium-lightBlue/20 hover:text-white"
                  >
                    <Laptop className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Accent Color</Label>
                  <div className="text-sm text-gray-400">Choose your preferred accent color</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-premium-purple cursor-pointer ring-2 ring-white"></div>
                  <div className="h-6 w-6 rounded-full bg-blue-500 cursor-pointer"></div>
                  <div className="h-6 w-6 rounded-full bg-green-500 cursor-pointer"></div>
                  <div className="h-6 w-6 rounded-full bg-orange-500 cursor-pointer"></div>
                  <div className="h-6 w-6 rounded-full bg-red-500 cursor-pointer"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Animations</Label>
                  <div className="text-sm text-gray-400">Enable or disable UI animations</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Font Size</Label>
                  <span className="text-sm text-gray-400">Medium</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Data Settings
              </CardTitle>
              <CardDescription className="text-gray-400">Configure data display and refresh settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-refresh Data</Label>
                  <div className="text-sm text-gray-400">Automatically refresh data at intervals</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Refresh Interval</Label>
                <Select defaultValue="60">
                  <SelectTrigger className="w-full bg-premium-blue/20 border-premium-lightBlue/30 text-white">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent className="bg-premium-blue/90 border-premium-lightBlue/30">
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                    <SelectItem value="1800">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Default Time Range</Label>
                <Select defaultValue="7d">
                  <SelectTrigger className="w-full bg-premium-blue/20 border-premium-lightBlue/30 text-white">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent className="bg-premium-blue/90 border-premium-lightBlue/30">
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Demo Data</Label>
                  <div className="text-sm text-gray-400">Use demo data when real data is unavailable</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <Card className="glass-card shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Wallet Settings
              </CardTitle>
              <CardDescription className="text-gray-400">Configure your wallet connection preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base">Default RPC Endpoint</Label>
                <Input
                  defaultValue="https://api.mainnet-beta.solana.com"
                  className="bg-premium-blue/20 border-premium-lightBlue/30 text-white"
                />
                <div className="text-xs text-gray-400">The Solana RPC endpoint used for blockchain operations</div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Network</Label>
                <Select defaultValue="mainnet">
                  <SelectTrigger className="w-full bg-premium-blue/20 border-premium-lightBlue/30 text-white">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent className="bg-premium-blue/90 border-premium-lightBlue/30">
                    <SelectItem value="mainnet">Mainnet</SelectItem>
                    <SelectItem value="testnet">Testnet</SelectItem>
                    <SelectItem value="devnet">Devnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-connect Wallet</Label>
                  <div className="text-sm text-gray-400">Automatically connect to your wallet on startup</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Transaction Signing Confirmation</Label>
                  <div className="text-sm text-gray-400">Always confirm before signing transactions</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-card shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure security preferences for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <div className="text-sm text-gray-400">Enable 2FA for additional security</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Session Timeout</Label>
                  <div className="text-sm text-gray-400">Automatically log out after inactivity</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Timeout Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-full bg-premium-blue/20 border-premium-lightBlue/30 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-premium-blue/90 border-premium-lightBlue/30">
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-premium-purple hover:bg-premium-purple/80">
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Notification Settings
              </CardTitle>
              <CardDescription className="text-gray-400">Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <div className="text-sm text-gray-400">Receive notifications via email</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Browser Notifications</Label>
                  <div className="text-sm text-gray-400">Receive notifications in your browser</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Transaction Alerts</Label>
                  <div className="text-sm text-gray-400">Get notified about wallet transactions</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Stake Change Alerts</Label>
                  <div className="text-sm text-gray-400">Get notified about significant stake changes</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Price Alerts</Label>
                  <div className="text-sm text-gray-400">Get notified about significant price changes</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="glass-card shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                API Settings
              </CardTitle>
              <CardDescription className="text-gray-400">Configure API keys and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base">OpenAI API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your OpenAI API key"
                  className="bg-premium-blue/20 border-premium-lightBlue/30 text-white"
                />
                <div className="text-xs text-gray-400">
                  Required for AI features like NFT generation and market analysis
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Solana RPC URL</Label>
                <Input
                  placeholder="Enter your custom Solana RPC URL"
                  className="bg-premium-blue/20 border-premium-lightBlue/30 text-white"
                />
                <div className="text-xs text-gray-400">Optional: Use your own RPC endpoint for better performance</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Use Solana Agent Kit</Label>
                  <div className="text-sm text-gray-400">
                    Enable Solana Agent Kit for advanced blockchain operations
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-4">
                <Button className="w-full bg-premium-purple hover:bg-premium-purple/80">
                  <Shield className="mr-2 h-4 w-4" />
                  Verify API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
