"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ExternalLink, RefreshCw, HelpCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ValidatorPerformance {
  uptime: string
  skipRate: string
  commission: number
  apy: string
  totalStake: number
  delegatorCount: number
  voteCredits: number
  epochVoteAccount: boolean
  activatedStake: number
  delinquent: boolean
}

interface HistoricalData {
  date: string
  uptime: string
  skipRate: string
  apy: string
}

interface ValidatorDetailViewProps {
  validatorId: string
}

export default function ValidatorDetailView({ validatorId }: ValidatorDetailViewProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [performance, setPerformance] = useState<ValidatorPerformance | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isDemo, setIsDemo] = useState(false)

  const fetchValidatorData = async () => {
    try {
      setLoading(true)
      // In a real app, this would be a real API call
      // For now, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for demonstration
      const mockPerformance = {
        uptime: "99.87",
        skipRate: "0.42",
        commission: 7,
        apy: "6.8",
        totalStake: 2345678,
        delegatorCount: 432,
        voteCredits: 987654,
        epochVoteAccount: true,
        activatedStake: 2345678,
        delinquent: false,
      }

      const mockHistorical = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return {
          date: date.toISOString().split("T")[0],
          uptime: (98 + Math.random() * 2).toFixed(2),
          skipRate: (Math.random() * 1.5).toFixed(2),
          apy: (6.5 + Math.random() * 0.8).toFixed(2),
        }
      })

      setPerformance(mockPerformance)
      setHistoricalData(mockHistorical)
      setIsDemo(true) // Since we're using mock data
      setError(null)
    } catch (err) {
      console.error("Error fetching validator data:", err)
      setError("Failed to load validator data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchValidatorData()
  }, [validatorId])

  const handleRefresh = () => {
    fetchValidatorData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Validator Details</h1>
          {isDemo && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Demo Data</span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Validator {validatorId}</CardTitle>
                  <CardDescription>Performance metrics and historical data for this validator</CardDescription>
                </div>
                <a
                  href={`https://explorer.solana.com/address/${validatorId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                  View on Solana Explorer
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="delegators">Delegators</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Metric
                      title="Total Stake"
                      value={`${(performance?.totalStake || 0).toLocaleString()} SOL`}
                      tooltip="Total amount of SOL staked with this validator"
                    />
                    <Metric
                      title="Commission"
                      value={`${performance?.commission || 0}%`}
                      tooltip="Percentage fee charged by the validator"
                    />
                    <Metric
                      title="APY"
                      value={`${performance?.apy || 0}%`}
                      tooltip="Estimated annual percentage yield"
                    />
                    <Metric
                      title="Delegators"
                      value={performance?.delegatorCount.toLocaleString() || "0"}
                      tooltip="Number of accounts delegating to this validator"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Uptime</span>
                            <span className="text-sm">{performance?.uptime}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{ width: `${performance?.uptime}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Skip Rate</span>
                            <span className="text-sm">{performance?.skipRate}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-amber-500"
                              style={{ width: `${Number.parseFloat(performance?.skipRate || "0") * 20}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                performance?.delinquent ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {performance?.delinquent ? "Delinquent" : "Active"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">APY History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={historicalData.slice(-14)} // Last 14 days
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[6, 8]} />
                              <RechartsTooltip />
                              <Line
                                type="monotone"
                                dataKey="apy"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                                name="APY (%)"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Historical Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis yAxisId="left" orientation="left" domain={[95, 100]} />
                              <YAxis yAxisId="right" orientation="right" domain={[0, 3]} />
                              <RechartsTooltip />
                              <Legend />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="uptime"
                                stroke="#4ade80"
                                activeDot={{ r: 8 }}
                                name="Uptime (%)"
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="skipRate"
                                stroke="#f59e0b"
                                name="Skip Rate (%)"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Monthly Performance Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { month: "Jan", uptime: 99.8, skipRate: 0.4 },
                                { month: "Feb", uptime: 99.9, skipRate: 0.3 },
                                { month: "Mar", uptime: 99.7, skipRate: 0.5 },
                                { month: "Apr", uptime: 99.8, skipRate: 0.4 },
                                { month: "May", uptime: 99.9, skipRate: 0.2 },
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <RechartsTooltip />
                              <Legend />
                              <Bar dataKey="uptime" name="Avg. Uptime (%)" fill="#4ade80" />
                              <Bar dataKey="skipRate" name="Avg. Skip Rate (%)" fill="#f59e0b" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="delegators" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Delegators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Wallet Address
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Stake Amount
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Delegation Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <tr key={index}>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {`${index + 1}. Wallet${index + 1}...${index * 3 + 1}Kp`}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <div className="text-sm text-gray-900">
                                    {(Math.random() * 10000 + 1000).toFixed(2)} SOL
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <div className="text-sm text-gray-900">
                                    {new Date(
                                      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
                                    ).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                      Math.random() > 0.2
                                        ? "bg-green-100 text-green-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {Math.random() > 0.2 ? "Active" : "Warming up"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Button variant="outline" size="sm">
                          View All Delegators
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Delegator Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { range: "0-100", count: 156 },
                              { range: "100-500", count: 87 },
                              { range: "500-1000", count: 43 },
                              { range: "1000-5000", count: 28 },
                              { range: "5000+", count: 12 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar
                              dataKey="count"
                              name="Number of Delegators"
                              fill="#8884d8"
                              label={{ position: "top" }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "Commission Change",
                      date: "2023-05-10",
                      description: "Commission changed from 8% to 7%",
                    },
                    {
                      type: "Delinquent Status",
                      date: "2023-04-22",
                      description: "Validator was delinquent for 2 hours",
                    },
                    {
                      type: "Major Delegation",
                      date: "2023-04-15",
                      description: "Received 50,000 SOL delegation",
                    },
                    {
                      type: "Version Update",
                      date: "2023-04-01",
                      description: "Updated to Solana v1.14.11",
                    },
                  ].map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">{event.type}</p>
                        <p className="text-sm text-gray-500">{event.description}</p>
                        <p className="text-xs text-gray-400">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validator Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vote Account</p>
                    <p className="break-all text-sm">{validatorId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Identity</p>
                    <p className="break-all text-sm">
                      {`${validatorId.substring(0, 8)}...${validatorId.substring(validatorId.length - 8)}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://example-validator.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data Center</p>
                    <p className="text-sm">AWS, us-west-2</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Node Version</p>
                    <p className="text-sm">1.14.17</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

interface MetricProps {
  title: string
  value: string
  tooltip?: string
}

function Metric({ title, value, tooltip }: MetricProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-500">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}
