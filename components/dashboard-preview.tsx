"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Dummy data for charts
const areaData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
  { name: "Jul", value: 1200 },
  { name: "Aug", value: 850 },
]

const barData = [
  { name: "Validator A", value: 2400 },
  { name: "Validator B", value: 1398 },
  { name: "Validator C", value: 9800 },
  { name: "Validator D", value: 3908 },
  { name: "Validator E", value: 4800 },
]

const pieData = [
  { name: "Staked", value: 68 },
  { name: "Unstaked", value: 32 },
]

const COLORS = ["#9333ea", "#06b6d4"]

export default function DashboardPreview() {
  const [animate, setAnimate] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % pieData.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full bg-gradient-to-b from-black to-[#0a0118] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Make your data work for you</h2>
            <p className="mb-8 text-lg text-gray-300">
              From validator health to MEV visibility, our tools bring clarity to every layer of the Solana chain.
            </p>
            <ul className="space-y-4">
              {[
                "Real-time transaction monitoring",
                "Validator performance metrics",
                "Stake delegation analytics",
                "Custom alerts and notifications",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs">
                    ✓
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="space-y-6 rounded-xl bg-black/50 p-6 shadow-lg shadow-purple-500/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onViewportEnter={() => setAnimate(true)}
          >
            <div className="rounded-lg bg-black/70 p-4">
              <h3 className="mb-4 text-lg font-medium text-white">Solana Transaction Volume</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", borderColor: "#374151" }}
                      itemStyle={{ color: "#e5e7eb" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#9333ea"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-black/70 p-4">
                <h3 className="mb-4 text-lg font-medium text-white">Validator Performance</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", borderColor: "#374151" }}
                        itemStyle={{ color: "#e5e7eb" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#06b6d4"
                        radius={[4, 4, 0, 0]}
                        animationDuration={animate ? 1500 : 0}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg bg-black/70 p-4">
                <h3 className="mb-4 text-lg font-medium text-white">SOL Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={animate ? 1000 : 0}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            opacity={index === activeIndex ? 1 : 0.7}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111827", borderColor: "#374151" }}
                        itemStyle={{ color: "#e5e7eb" }}
                        formatter={(value) => [`${value}%`, pieData[activeIndex].name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
