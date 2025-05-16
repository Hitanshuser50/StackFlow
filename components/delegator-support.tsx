"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Search, AlertCircle, CheckCircle, Info, ArrowRight, Calculator } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DelegatorSupport() {
  const [stakeAmount, setStakeAmount] = useState("100")
  const [riskTolerance, setRiskTolerance] = useState([50])
  const [timeHorizon, setTimeHorizon] = useState("medium")
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [activeTab, setActiveTab] = useState("recommendations")
  const [searchQuery, setSearchQuery] = useState("")
  const [validators, setValidators] = useState([])
  const [filteredValidators, setFilteredValidators] = useState([])
  const [selectedValidator, setSelectedValidator] = useState(null)
  const [rewardEstimates, setRewardEstimates] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchValidators()
  }, [])

  useEffect(() => {
    if (validators.length > 0) {
      const filtered = validators.filter(
        (validator) =>
          validator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          validator.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredValidators(filtered)
    }
  }, [searchQuery, validators])

  const fetchValidators = async () => {
    try {
      setLoading(true)
      // In a real implementation, this would fetch data from an API
      // For now, we'll generate mock data

      const mockValidators = Array.from({ length: 20 }, (_, i) => {
        const commission = Math.floor(Math.random() * 10) + 1
        const apy = (7 - (commission / 100) * 2 + Math.random() * 0.5).toFixed(2)
        const uptime = (99 + Math.random()).toFixed(2)
        const skipRate = (Math.random() * 2).toFixed(2)

        return {
          id: `validator${i + 1}`,
          name: `Validator ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) > 0 ? Math.floor(i / 26) : ""}`,
          stake: Math.floor(Math.random() * 5000000) + 500000,
          commission,
          apy,
          uptime,
          skipRate,
          delinquent: Math.random() > 0.9,
          riskScore: Math.floor(Math.random() * 10) + 1,
          delegatorCount: Math.floor(Math.random() * 1000) + 50,
        }
      })

      setValidators(mockValidators)
      setFilteredValidators(mockValidators)
      setError(null)
    } catch (err) {
      console.error("Error fetching validators:", err)
      setError("Failed to load validator data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const generateRecommendations = () => {
    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      try {
        const amount = Number.parseFloat(stakeAmount)
        if (isNaN(amount) || amount <= 0) {
          setError("Please enter a valid stake amount")
          setLoading(false)
          return
        }

        const risk = riskTolerance[0]

        // Filter validators based on risk tolerance
        // Lower risk tolerance = prefer validators with lower risk scores
        const maxRiskScore = Math.ceil(10 * (risk / 100))

        const eligibleValidators = validators
          .filter((v) => v.riskScore <= maxRiskScore && !v.delinquent)
          .sort((a, b) => {
            // Sort by a weighted score based on APY, commission, and risk
            const aScore = Number.parseFloat(a.apy) * 0.5 - a.commission * 0.3 - a.riskScore * (1 - risk / 100)
            const bScore = Number.parseFloat(b.apy) * 0.5 - b.commission * 0.3 - b.riskScore * (1 - risk / 100)
            return bScore - aScore
          })
          .slice(0, 5)

        // Generate recommendations
        const recommendations = eligibleValidators.map((validator) => {
          const estimatedRewards = calculateEstimatedRewards(amount, validator.apy, timeHorizon)

          return {
            validator,
            estimatedRewards,
            reasons: [
              `APY of ${validator.apy}% is ${Number.parseFloat(validator.apy) > 6.5 ? "above" : "near"} average`,
              `Commission rate of ${validator.commission}% is ${validator.commission < 5 ? "low" : validator.commission > 8 ? "high" : "average"}`,
              `Uptime of ${validator.uptime}% indicates ${Number.parseFloat(validator.uptime) > 99.9 ? "excellent" : "good"} reliability`,
              `Risk score of ${validator.riskScore}/10 matches your risk tolerance`,
            ],
            riskFactors: [
              validator.skipRate > 1
                ? `Skip rate of ${validator.skipRate}% is ${validator.skipRate > 1.5 ? "concerning" : "slightly elevated"}`
                : null,
              validator.stake > 3000000 ? "High stake concentration may impact decentralization" : null,
              validator.commission > 7 ? "Above average commission rate" : null,
            ].filter(Boolean),
          }
        })

        setRecommendations(recommendations)
        setActiveTab("recommendations")
        setError(null)
      } catch (err) {
        console.error("Error generating recommendations:", err)
        setError("Failed to generate recommendations. Please try again.")
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  const calculateEstimatedRewards = (amount, apy, timeHorizon) => {
    const apyDecimal = Number.parseFloat(apy) / 100
    let timeInYears

    switch (timeHorizon) {
      case "short":
        timeInYears = 1 / 12 // 1 month
        break
      case "medium":
        timeInYears = 0.5 // 6 months
        break
      case "long":
        timeInYears = 1 // 1 year
        break
      default:
        timeInYears = 0.5
    }

    // Simple interest calculation for short timeframes
    const rewards = amount * apyDecimal * timeInYears

    // Generate monthly breakdown
    const months = Math.ceil(timeInYears * 12)
    const monthlyBreakdown = Array.from({ length: months }, (_, i) => {
      const monthReward = amount * apyDecimal * (1 / 12)
      return {
        month: i + 1,
        reward: monthReward,
        cumulative: monthReward * (i + 1),
      }
    })

    return {
      total: rewards,
      monthly: rewards / months,
      breakdown: monthlyBreakdown,
    }
  }

  const handleValidatorSelect = (validator) => {
    setSelectedValidator(validator)

    // Calculate reward estimates
    const amount = Number.parseFloat(stakeAmount) || 100
    const estimatedRewards = calculateEstimatedRewards(amount, validator.apy, timeHorizon)
    setRewardEstimates(estimatedRewards)

    // Switch to calculator tab
    setActiveTab("calculator")
  }

  const getRiskLabel = (score) => {
    if (score <= 3) return { label: "Low Risk", color: "green" }
    if (score <= 6) return { label: "Medium Risk", color: "yellow" }
    return { label: "High Risk", color: "red" }
  }

  const getTimeHorizonLabel = () => {
    switch (timeHorizon) {
      case "short":
        return "1 month"
      case "medium":
        return "6 months"
      case "long":
        return "1 year"
      default:
        return "6 months"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delegator Decision Support</CardTitle>
          <CardDescription>Get personalized staking recommendations based on your preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="stake-amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Stake Amount (SOL)
                </label>
                <Input
                  id="stake-amount"
                  type="number"
                  min="0"
                  step="0.1"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="risk-tolerance" className="block text-sm font-medium text-gray-700">
                    Risk Tolerance
                  </label>
                  <span className="text-sm text-gray-500">{riskTolerance[0]}%</span>
                </div>
                <Slider
                  id="risk-tolerance"
                  min={0}
                  max={100}
                  step={5}
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </div>
              </div>

              <div>
                <label htmlFor="time-horizon" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Horizon
                </label>
                <div className="flex space-x-2">
                  <Button
                    variant={timeHorizon === "short" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setTimeHorizon("short")}
                  >
                    Short
                  </Button>
                  <Button
                    variant={timeHorizon === "medium" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setTimeHorizon("medium")}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={timeHorizon === "long" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setTimeHorizon("long")}
                  >
                    Long
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {timeHorizon === "short" ? "1 month" : timeHorizon === "medium" ? "6 months" : "1 year"}
                </p>
              </div>

              <Button onClick={generateRecommendations} disabled={loading} className="w-full">
                {loading ? "Generating..." : "Generate Recommendations"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="md:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="search">Validator Search</TabsTrigger>
                  <TabsTrigger value="calculator">Reward Calculator</TabsTrigger>
                </TabsList>

                <TabsContent value="recommendations">
                  {recommendations.length === 0 ? (
                    <div className="text-center p-8 border rounded-md">
                      <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">
                        Set your preferences and click "Generate Recommendations" to get personalized staking
                        suggestions.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <Card key={rec.validator.id} className="overflow-hidden">
                          <div
                            className={`h-1 ${index === 0 ? "bg-green-500" : index === 1 ? "bg-blue-500" : "bg-purple-500"}`}
                          ></div>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{rec.validator.name}</h3>
                                  {index === 0 && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      Top Pick
                                    </Badge>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className={`bg-${getRiskLabel(rec.validator.riskScore).color}-50 text-${getRiskLabel(rec.validator.riskScore).color}-700 border-${getRiskLabel(rec.validator.riskScore).color}-200`}
                                  >
                                    {getRiskLabel(rec.validator.riskScore).label}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">APY:</span> {rec.validator.apy}%
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Commission:</span> {rec.validator.commission}%
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Uptime:</span> {rec.validator.uptime}%
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Delegators:</span> {rec.validator.delegatorCount}
                                  </div>
                                </div>

                                <div className="text-sm">
                                  <span className="text-gray-500">Estimated {getTimeHorizonLabel()} rewards:</span>{" "}
                                  <span className="font-medium">{rec.estimatedRewards.total.toFixed(2)} SOL</span>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-gray-700">Why we recommend this validator:</p>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {rec.reasons.map((reason, i) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                                        <span>{reason}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {rec.riskFactors.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-700">Risk factors to consider:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                      {rec.riskFactors.map((factor, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5" />
                                          <span>{factor}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-row md:flex-col justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleValidatorSelect(rec.validator)}
                                >
                                  <Calculator className="h-4 w-4 mr-2" />
                                  Calculate
                                </Button>
                                <Button size="sm">
                                  Stake Now
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="search">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search validators by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">APY</TableHead>
                            <TableHead className="text-right">Commission</TableHead>
                            <TableHead className="text-right">Uptime</TableHead>
                            <TableHead className="text-right">Risk Score</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell colSpan={6} className="text-center py-4">
                                  <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : filteredValidators.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                No validators found matching your search
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredValidators.slice(0, 10).map((validator) => (
                              <TableRow key={validator.id} className={validator.delinquent ? "bg-red-50" : ""}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {validator.name}
                                    {validator.delinquent && (
                                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        Delinquent
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">{validator.apy}%</TableCell>
                                <TableCell className="text-right">{validator.commission}%</TableCell>
                                <TableCell className="text-right">{validator.uptime}%</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <span>{validator.riskScore}/10</span>
                                    <div
                                      className={`w-2 h-2 rounded-full bg-${getRiskLabel(validator.riskScore).color}-500`}
                                    ></div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" onClick={() => handleValidatorSelect(validator)}>
                                    <Calculator className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="calculator">
                  {!selectedValidator ? (
                    <div className="text-center p-8 border rounded-md">
                      <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">
                        Select a validator from the recommendations or search to calculate potential rewards.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <Card className="flex-1">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{selectedValidator.name}</CardTitle>
                            <CardDescription>Validator Details</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">APY</p>
                                <p className="text-xl font-medium">{selectedValidator.apy}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Commission</p>
                                <p className="text-xl font-medium">{selectedValidator.commission}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Uptime</p>
                                <p className="text-xl font-medium">{selectedValidator.uptime}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Risk Score</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xl font-medium">{selectedValidator.riskScore}/10</p>
                                  <div
                                    className={`w-3 h-3 rounded-full bg-${getRiskLabel(selectedValidator.riskScore).color}-500`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="flex-1">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Reward Estimates</CardTitle>
                            <CardDescription>
                              Based on {Number.parseFloat(stakeAmount).toFixed(2)} SOL for {getTimeHorizonLabel()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500">Total Estimated Reward</p>
                                <p className="text-2xl font-medium">{rewardEstimates?.total.toFixed(4)} SOL</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Monthly Average</p>
                                <p className="text-xl font-medium">{rewardEstimates?.monthly.toFixed(4)} SOL</p>
                              </div>
                              <div className="pt-2">
                                <div className="flex justify-between text-sm">
                                  <span>Initial</span>
                                  <span>Final (estimated)</span>
                                </div>
                                <Progress value={100} className="h-2 mt-1" />
                                <div className="flex justify-between text-sm mt-1">
                                  <span>{Number.parseFloat(stakeAmount).toFixed(2)} SOL</span>
                                  <span>
                                    {(Number.parseFloat(stakeAmount) + rewardEstimates?.total).toFixed(2)} SOL
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Reward Projection</CardTitle>
                          <CardDescription>Estimated rewards over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={rewardEstimates?.breakdown || []}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="month"
                                  label={{ value: "Month", position: "insideBottom", offset: -5 }}
                                />
                                <YAxis label={{ value: "SOL", angle: -90, position: "insideLeft" }} />
                                <Tooltip formatter={(value) => value.toFixed(4) + " SOL"} />
                                <Legend />
                                <Bar dataKey="reward" name="Monthly Reward" fill="#8884d8" />
                                <Bar dataKey="cumulative" name="Cumulative Reward" fill="#82ca9d" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t">
                          <div className="text-sm text-gray-500 w-full">
                            <p className="mb-2">
                              <Info className="h-4 w-4 inline-block mr-1" />
                              These projections are estimates based on current APY rates and may vary over time.
                            </p>
                            <div className="flex justify-between">
                              <Button variant="outline" size="sm" onClick={() => setActiveTab("recommendations")}>
                                Back to Recommendations
                              </Button>
                              <Button size="sm">
                                Stake with {selectedValidator.name}
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
