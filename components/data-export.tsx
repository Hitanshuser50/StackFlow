"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, Code, FileJson, CheckCircle, Terminal, ExternalLink } from "lucide-react"

export function DataExport() {
  const [activeTab, setActiveTab] = useState("export")
  const [dataType, setDataType] = useState("validators")
  const [fileFormat, setFileFormat] = useState("json")
  const [timeRange, setTimeRange] = useState("30d")
  const [includeFields, setIncludeFields] = useState({
    id: true,
    name: true,
    stake: true,
    commission: true,
    apy: true,
    uptime: true,
    skipRate: true,
    delegatorCount: true,
    delinquent: true,
  })
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleExport = () => {
    setDownloading(true)

    // Simulate download delay
    setTimeout(() => {
      setDownloading(false)

      // Create a mock file download
      const fileName = `solana_stake_flow_${dataType}_${timeRange}.${fileFormat}`
      const mockData = generateMockData()
      let content

      if (fileFormat === "json") {
        content = JSON.stringify(mockData, null, 2)
      } else if (fileFormat === "csv") {
        // Convert to CSV
        const headers = Object.keys(mockData[0]).join(",")
        const rows = mockData.map((item) => Object.values(item).join(","))
        content = [headers, ...rows].join("\n")
      } else {
        // TSV format
        const headers = Object.keys(mockData[0]).join("\t")
        const rows = mockData.map((item) => Object.values(item).join("\t"))
        content = [headers, ...rows].join("\n")
      }

      const blob = new Blob([content], { type: `text/${fileFormat === "json" ? "json" : "csv"};charset=utf-8;` })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 1500)
  }

  const generateMockData = () => {
    // Generate mock data based on selected data type and fields
    const count = dataType === "validators" ? 20 : dataType === "stake_accounts" ? 50 : 30

    const data = []
    for (let i = 0; i < count; i++) {
      const item = {}

      if (includeFields.id) item.id = `${dataType.slice(0, -1)}_${i + 1}`
      if (includeFields.name)
        item.name = `${dataType === "validators" ? "Validator" : "Account"} ${String.fromCharCode(65 + (i % 26))}`
      if (includeFields.stake) item.stake = Math.floor(Math.random() * 5000000) + 500000
      if (includeFields.commission && dataType === "validators") item.commission = Math.floor(Math.random() * 10) + 1
      if (includeFields.apy && dataType === "validators")
        item.apy = (7 - (item.commission / 100) * 2 + Math.random() * 0.5).toFixed(2)
      if (includeFields.uptime && dataType === "validators") item.uptime = (99 + Math.random()).toFixed(2)
      if (includeFields.skipRate && dataType === "validators") item.skipRate = (Math.random() * 2).toFixed(2)
      if (includeFields.delegatorCount && dataType === "validators")
        item.delegatorCount = Math.floor(Math.random() * 1000) + 50
      if (includeFields.delinquent && dataType === "validators") item.delinquent = Math.random() > 0.9

      if (dataType === "stake_accounts") {
        item.owner = `wallet${i + 1}`
        item.validator = `validator${Math.floor(Math.random() * 10) + 1}`
        item.status = Math.random() > 0.2 ? "active" : "inactive"
      }

      if (dataType === "stake_flow") {
        const date = new Date()
        date.setDate(date.getDate() - i)
        item.date = date.toISOString().split("T")[0]
        item.totalStake = 1000000 + i * 10000 + Math.random() * 50000
        item.newStake = 20000 + Math.random() * 5000
        item.unstake = 15000 + Math.random() * 4000
      }

      data.push(item)
    }

    return data
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey || "YOUR_API_KEY")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getApiEndpoint = () => {
    switch (dataType) {
      case "validators":
        return "/api/validators"
      case "stake_accounts":
        return "/api/stake-accounts"
      case "stake_flow":
        return "/api/stake-history"
      default:
        return "/api/validators"
    }
  }

  const getApiQueryParams = () => {
    const params = []

    if (timeRange !== "all") {
      params.push(`timeRange=${timeRange}`)
    }

    if (Object.values(includeFields).some((v) => !v)) {
      const fields = Object.keys(includeFields)
        .filter((k) => includeFields[k])
        .join(",")
      params.push(`fields=${fields}`)
    }

    return params.length > 0 ? `?${params.join("&")}` : ""
  }

  const getApiExample = () => {
    const endpoint = getApiEndpoint()
    const params = getApiQueryParams()

    return `fetch("https://api.solana-stake-flow.com${endpoint}${params}", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));`
  }

  const getPythonExample = () => {
    const endpoint = getApiEndpoint()
    const params = getApiQueryParams()

    return `import requests

url = "https://api.solana-stake-flow.com${endpoint}${params}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
  }

  const getCliExample = () => {
    const endpoint = getApiEndpoint()
    const params = getApiQueryParams()

    return `curl -X GET "https://api.solana-stake-flow.com${endpoint}${params}" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Export & API Documentation</CardTitle>
          <CardDescription>Export data or integrate with our API</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="export">Data Export</TabsTrigger>
              <TabsTrigger value="api">API Documentation</TabsTrigger>
              <TabsTrigger value="integration">Integration Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="export">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                    <Select value={dataType} onValueChange={setDataType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="validators">Validators</SelectItem>
                        <SelectItem value="stake_accounts">Stake Accounts</SelectItem>
                        <SelectItem value="stake_flow">Stake Flow History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Format</label>
                    <Select value={fileFormat} onValueChange={setFileFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select file format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="tsv">TSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Include Fields</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.keys(includeFields).map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${field}`}
                          checked={includeFields[field]}
                          onCheckedChange={(checked) => {
                            setIncludeFields({
                              ...includeFields,
                              [field]: !!checked,
                            })
                          }}
                        />
                        <label
                          htmlFor={`field-${field}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleExport} disabled={downloading}>
                    {downloading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <h3 className="text-lg font-medium mb-2">API Overview</h3>
                  <p className="text-gray-600 mb-4">
                    Our REST API provides programmatic access to Solana stake flow data. You can retrieve information
                    about validators, stake accounts, and historical stake movements.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Base URL</h4>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          https://api.solana-stake-flow.com
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode("https://api.solana-stake-flow.com")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Authentication</h4>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="YOUR_API_KEY"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="font-mono text-sm"
                        />
                        <Button variant="ghost" size="sm" onClick={handleCopyApiKey}>
                          {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Available Endpoints</h3>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">GET /api/validators</CardTitle>
                        <Badge>GET</Badge>
                      </div>
                      <CardDescription>Retrieve validator information</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium">Query Parameters</h4>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">limit</code> - Number of validators to
                              return (default: 20)
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">offset</code> - Pagination offset
                              (default: 0)
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">sort</code> - Sort field (stake,
                              commission, apy)
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">order</code> - Sort order (asc, desc)
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Example Response</h4>
                          <div className="bg-gray-100 p-2 rounded text-xs font-mono overflow-auto max-h-40">
                            {JSON.stringify(
                              {
                                validators: [
                                  {
                                    id: "validator_1",
                                    name: "Validator A",
                                    stake: 2345678,
                                    commission: 7,
                                    apy: "6.8",
                                    uptime: "99.87",
                                    skipRate: "0.42",
                                    delegatorCount: 432,
                                    delinquent: false,
                                  },
                                ],
                                total: 1872,
                                limit: 20,
                                offset: 0,
                              },
                              null,
                              2,
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">GET /api/stake-accounts</CardTitle>
                        <Badge>GET</Badge>
                      </div>
                      <CardDescription>Retrieve stake account information</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium">Query Parameters</h4>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">limit</code> - Number of accounts to
                              return (default: 50)
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">offset</code> - Pagination offset
                              (default: 0)
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">validator</code> - Filter by validator
                              ID
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">status</code> - Filter by status
                              (active, inactive)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">GET /api/stake-history</CardTitle>
                        <Badge>GET</Badge>
                      </div>
                      <CardDescription>Retrieve historical stake flow data</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium">Query Parameters</h4>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">timeRange</code> - Time range (7d, 30d,
                              90d, 1y, all)
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">validator</code> - Filter by validator
                              ID
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">startDate</code> - Start date
                              (YYYY-MM-DD)
                            </li>
                            <li>
                              <code className="text-xs bg-gray-100 px-1 rounded">endDate</code> - End date (YYYY-MM-DD)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                    <Select value={dataType} onValueChange={setDataType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="validators">Validators</SelectItem>
                        <SelectItem value="stake_accounts">Stake Accounts</SelectItem>
                        <SelectItem value="stake_flow">Stake Flow History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs defaultValue="javascript">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="cli">CLI</TabsTrigger>
                  </TabsList>

                  <TabsContent value="javascript" className="mt-4">
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md relative">
                      <pre className="font-mono text-sm overflow-auto">
                        <code>{getApiExample()}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(getApiExample())}
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="python" className="mt-4">
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md relative">
                      <pre className="font-mono text-sm overflow-auto">
                        <code>{getPythonExample()}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(getPythonExample())}
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="cli" className="mt-4">
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md relative">
                      <pre className="font-mono text-sm overflow-auto">
                        <code>{getCliExample()}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(getCliExample())}
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Integration Resources</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Code className="h-4 w-4 mr-2 text-blue-500" />
                      <a href="#" className="text-blue-600 hover:underline flex items-center">
                        GitHub Repository with Example Code
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </li>
                    <li className="flex items-center">
                      <FileJson className="h-4 w-4 mr-2 text-blue-500" />
                      <a href="#" className="text-blue-600 hover:underline flex items-center">
                        OpenAPI Specification
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </li>
                    <li className="flex items-center">
                      <Terminal className="h-4 w-4 mr-2 text-blue-500" />
                      <a href="#" className="text-blue-600 hover:underline flex items-center">
                        API Client Libraries
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t">
          <div className="text-sm text-gray-500 w-full">
            <p>
              Need help with integration? Contact us at{" "}
              <a href="mailto:api@solana-stake-flow.com" className="text-blue-600 hover:underline">
                api@solana-stake-flow.com
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
