"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, TrendingUp, Award, Users, Clock } from "lucide-react"

interface MetricFlashCard {
  title: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  icon: React.ReactNode
  color: string
}

export default function MetricFlashCards() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Sample metrics data - in a real app, this would come from an API
  const metrics: MetricFlashCard[] = [
    {
      title: "Total Staked SOL",
      value: "372.5M",
      change: "+2.3%",
      trend: "up",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-green-500 to-emerald-700",
    },
    {
      title: "Active Validators",
      value: "1,834",
      change: "+12",
      trend: "up",
      icon: <Users className="h-6 w-6" />,
      color: "from-blue-500 to-indigo-700",
    },
    {
      title: "Average APY",
      value: "6.8%",
      change: "-0.2%",
      trend: "down",
      icon: <Award className="h-6 w-6" />,
      color: "from-purple-500 to-violet-700",
    },
    {
      title: "Epoch Progress",
      value: "73%",
      change: "~8h remaining",
      trend: "neutral",
      icon: <Clock className="h-6 w-6" />,
      color: "from-amber-500 to-orange-700",
    },
  ]

  // Auto-rotate cards every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % metrics.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, metrics.length])

  const handleCardClick = (index: number) => {
    setCurrentCardIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 15 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative h-[140px] w-full overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Card className="h-full w-full overflow-hidden border-0 shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-r ${metrics[currentCardIndex].color} opacity-90`}></div>
              <CardContent className="flex h-full items-center justify-between p-6 relative z-10">
                <div className="text-white">
                  <h3 className="text-lg font-medium opacity-90">{metrics[currentCardIndex].title}</h3>
                  <p className="mt-1 text-3xl font-bold">{metrics[currentCardIndex].value}</p>
                  {metrics[currentCardIndex].change && (
                    <div className="mt-2 flex items-center text-sm">
                      {metrics[currentCardIndex].trend === "up" ? (
                        <ArrowUp className="mr-1 h-4 w-4" />
                      ) : metrics[currentCardIndex].trend === "down" ? (
                        <ArrowDown className="mr-1 h-4 w-4" />
                      ) : null}
                      <span>{metrics[currentCardIndex].change}</span>
                    </div>
                  )}
                </div>
                <div className="rounded-full bg-white/20 p-4 text-white">{metrics[currentCardIndex].icon}</div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Card indicators/navigation */}
      <div className="flex justify-center space-x-2">
        {metrics.map((_, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentCardIndex ? "bg-primary w-6" : "bg-gray-300 dark:bg-gray-600"
            }`}
            aria-label={`View metric card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
