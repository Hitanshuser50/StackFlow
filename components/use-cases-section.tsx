"use client"

import { motion } from "framer-motion"
import { Server, Code, Globe } from "lucide-react"

const useCases = [
  {
    title: "For Validators",
    description: "Optimize block production & latency",
    icon: <Server className="h-12 w-12" />,
    color: "from-purple-500 to-purple-700",
  },
  {
    title: "For Devs",
    description: "Build apps with on-chain intelligence baked in",
    icon: <Code className="h-12 w-12" />,
    color: "from-cyan-500 to-cyan-700",
  },
  {
    title: "For the Ecosystem",
    description: "Promote transparency, reduce risk",
    icon: <Globe className="h-12 w-12" />,
    color: "from-blue-500 to-blue-700",
  },
]

export default function UseCasesSection() {
  return (
    <section className="w-full bg-[#0a0118] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="mb-16 text-center text-3xl font-bold text-white md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Tailored Solutions for Every Need
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-xl bg-black/50 p-8 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div
                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${useCase.color} p-4 text-white shadow-lg`}
              >
                {useCase.icon}
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">{useCase.title}</h3>
              <p className="text-gray-300">{useCase.description}</p>
              <div className="mt-auto pt-6">
                <motion.a
                  href="#"
                  className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
                  whileHover={{ x: 5 }}
                >
                  Learn more
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
