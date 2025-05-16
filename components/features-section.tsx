"use client"

import { motion } from "framer-motion"
import { BarChart3, Activity, TrendingUp, LineChart } from "lucide-react"

const features = [
  {
    title: "Deep Chain Analysis",
    description: "Extract insights from Solana's raw transaction data",
    icon: <BarChart3 className="h-10 w-10" />,
    color: "from-purple-500 to-purple-700",
  },
  {
    title: "Validator Infra Monitoring",
    description: "Improve reliability with smart dashboards",
    icon: <Activity className="h-10 w-10" />,
    color: "from-cyan-500 to-cyan-700",
  },
  {
    title: "MEV Observability",
    description: "Reveal hidden patterns and flows",
    icon: <TrendingUp className="h-10 w-10" />,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Delegation & Stake Tracking",
    description: "Visualize LST movements and validator shifts",
    icon: <LineChart className="h-10 w-10" />,
    color: "from-pink-500 to-pink-700",
  },
]

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="features" className="w-full bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 px-4 py-1.5 text-sm font-medium text-purple-400">
            Features
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Powerful Features for the Solana Ecosystem</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Our cutting-edge tools provide unparalleled visibility into the Solana blockchain
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-purple-900/20 to-black p-6 shadow-lg transition-all duration-300 hover:shadow-purple-500/20"
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.1), 0 10px 10px -5px rgba(168, 85, 247, 0.04)",
              }}
            >
              <div
                className={`mb-4 rounded-full bg-gradient-to-r ${feature.color} p-3 text-white transition-transform duration-300 group-hover:scale-110 w-16 h-16 flex items-center justify-center`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="/dashboard"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-0.5 text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/30"
          >
            <span className="relative rounded-full bg-black px-8 py-3.5 transition-all duration-300 group-hover:bg-transparent">
              Explore All Features
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
