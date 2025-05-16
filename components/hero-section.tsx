"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"

export default function HeroSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.9])
  const y = useTransform(scrollY, [0, 500], [0, 100])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleScroll = () => {
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-20 md:px-8"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>

      {/* Animated particles background */}
      {isMounted && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-purple-500"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: 10 + Math.random() * 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-4 inline-block rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 px-6 py-2 backdrop-blur-sm"
        >
          <span className="text-sm font-medium text-gray-200">Solana's Premier Analytics Platform</span>
        </motion.div>

        <motion.h1
          className="mb-6 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          See Deeper. Build Smarter. Act Faster.
        </motion.h1>

        <motion.p
          className="mx-auto mb-8 max-w-3xl text-lg text-gray-300 sm:text-xl md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          We decode on-chain data to reveal insights that drive decisions, improve infrastructure, and empower the
          Solana ecosystem.
        </motion.p>

        <motion.div
          className="mb-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/dashboard">
            <motion.span
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Launch Dashboard
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </motion.span>
          </Link>
          <motion.button
            className="inline-flex items-center justify-center rounded-full border-2 border-purple-500 bg-transparent px-8 py-4 text-lg font-medium text-white transition-all hover:bg-purple-500/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open("https://github.com/Hitanshuser50/StackFlow", "_blank")}
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
            </svg>
            GitHub
          </motion.button>
        </motion.div>

        <motion.div
          style={{ opacity, scale, y }}
          className="relative mt-10 h-[600px] w-full overflow-hidden rounded-xl border border-purple-500/20 bg-black/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
          <iframe
            ref={iframeRef}
            src="https://my.spline.design/claritystream-kZN4HoR5u0ei7GCXUnACDZAw/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="absolute inset-0 z-10"
            style={{ pointerEvents: "auto" }}
            title="Solana Data Visualization"
          ></iframe>
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-center text-sm text-gray-400">
              Interactive 3D visualization of Solana blockchain data flows
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
        <motion.div
          className="animate-bounce cursor-pointer rounded-full bg-purple-500/30 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          onClick={handleScroll}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
