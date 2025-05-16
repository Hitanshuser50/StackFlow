"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F", "#FFBB28", "#FF8042"]

// Sample data - in a real app, this would come from an API
const stakingData = [
  { name: "Jan", validator1: 4000, validator2: 2400, validator3: 1800 },
  { name: "Feb", validator1: 3000, validator2: 2210, validator3: 2200 },
  { name: "Mar", validator1: 2000, validator2: 2290, validator3: 2500 },
  { name: "Apr", validator1: 2780, validator2: 3090, validator3: 2800 },
  { name: "May", validator1: 1890, validator2: 3490, validator3: 2400 },
  { name: "Jun", validator1: 2390, validator2: 3490, validator3: 2100 },
  { name: "Jul", validator1: 3490, validator2: 2300, validator3: 2400 },
]

const distributionData = [
  { name: "Validator A", value: 400 },
  { name: "Validator B", value: 300 },
  { name: "Validator C", value: 300 },
  { name: "Validator D", value: 200 },
  { name: "Others", value: 100 },
]

export default function AnimatedVisualizations() {
  const [activeTab, setActiveTab] = useState("line")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Set visible after component mounts for animations
    setIsVisible(true)

    // Intersection Observer to trigger animations when component is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("animated-visualizations")
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  return (
    <section id="animated-visualizations" className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
          <CardHeader className="border-b border-slate-700 bg-slate-800/50 pb-3">
            <CardTitle className="text-xl font-bold text-white">Animated Stake Flow Visualizations</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-4 bg-slate-700/30">
                <TabsTrigger value="line" className="data-[state=active]:bg-slate-600">
                  Line Chart
                </TabsTrigger>
                <TabsTrigger value="area" className="data-[state=active]:bg-slate-600">
                  Area Chart
                </TabsTrigger>
                <TabsTrigger value="bar" className="data-[state=active]:bg-slate-600">
                  Bar Chart
                </TabsTrigger>
                <TabsTrigger value="pie" className="data-[state=active]:bg-slate-600">
                  Pie Chart
                </TabsTrigger>
              </TabsList>

              <div className="h-[400px] w-full">
                <TabsContent value="line" className="h-full mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stakingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(30,41,59,0.9)", borderColor: "#475569" }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="validator1"
                        name="Validator 1"
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ stroke: "#8884d8", strokeWidth: 2, r: 4, fill: "#8884d8" }}
                        activeDot={{ r: 8 }}
                        animationDuration={2000}
                        animationBegin={300}
                      />
                      <Line
                        type="monotone"
                        dataKey="validator2"
                        name="Validator 2"
                        stroke="#82ca9d"
                        strokeWidth={3}
                        dot={{ stroke: "#82ca9d", strokeWidth: 2, r: 4, fill: "#82ca9d" }}
                        activeDot={{ r: 8 }}
                        animationDuration={2000}
                        animationBegin={600}
                      />
                      <Line
                        type="monotone"
                        dataKey="validator3"
                        name="Validator 3"
                        stroke="#ffc658"
                        strokeWidth={3}
                        dot={{ stroke: "#ffc658", strokeWidth: 2, r: 4, fill: "#ffc658" }}
                        activeDot={{ r: 8 }}
                        animationDuration={2000}
                        animationBegin={900}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="area" className="h-full mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stakingData}>
                      <defs>
                        <linearGradient id="colorValidator1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorValidator2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorValidator3" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(30,41,59,0.9)", borderColor: "#475569" }} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="validator1"
                        name="Validator 1"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorValidator1)"
                        animationDuration={2000}
                        animationBegin={300}
                      />
                      <Area
                        type="monotone"
                        dataKey="validator2"
                        name="Validator 2"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorValidator2)"
                        animationDuration={2000}
                        animationBegin={600}
                      />
                      <Area
                        type="monotone"
                        dataKey="validator3"
                        name="Validator 3"
                        stroke="#ffc658"
                        fillOpacity={1}
                        fill="url(#colorValidator3)"
                        animationDuration={2000}
                        animationBegin={900}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="bar" className="h-full mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stakingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(30,41,59,0.9)", borderColor: "#475569" }} />
                      <Legend />
                      <Bar
                        dataKey="validator1"
                        name="Validator 1"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                        animationDuration={2000}
                        animationBegin={300}
                      />
                      <Bar
                        dataKey="validator2"
                        name="Validator 2"
                        fill="#82ca9d"
                        radius={[4, 4, 0, 0]}
                        animationDuration={2000}
                        animationBegin={600}
                      />
                      <Bar
                        dataKey="validator3"
                        name="Validator 3"
                        fill="#ffc658"
                        radius={[4, 4, 0, 0]}
                        animationDuration={2000}
                        animationBegin={900}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="pie" className="h-full mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        animationDuration={2000}
                        animationBegin={300}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "rgba(30,41,59,0.9)", borderColor: "#475569" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
