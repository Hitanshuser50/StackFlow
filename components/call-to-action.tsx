"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CallToAction() {
  const currentYear = new Date().getFullYear()

  return (
    <section className="w-full bg-gradient-to-t from-black to-[#0a0118] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-8 shadow-lg backdrop-blur-sm sm:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              className="mb-6 text-3xl font-bold text-white md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Ready to unlock the power of Solana data?
            </motion.h2>
            <motion.p
              className="mb-10 text-lg text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Start exploring the ecosystem with our powerful analytics tools and gain insights that were previously
              hidden.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <Link href="/dashboard">
                <motion.span
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore the Dashboard
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    ></path>
                  </svg>
                </motion.span>
              </Link>
              <Link href="#features">
                <motion.span
                  className="inline-flex items-center justify-center rounded-full border-2 border-purple-500 bg-transparent px-8 py-4 text-lg font-medium text-white transition-all hover:bg-purple-500/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <footer className="mt-20 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-6 border-t border-gray-800 pt-8 sm:flex-row sm:space-y-0">
            <p className="text-sm text-gray-500">© {currentYear} Solana Data Analytics. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Discord</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M18.93 5.34a16.89 16.89 0 00-4.07-1.23c-.03 0-.05.01-.07.03-.17.3-.37.7-.5 1.01a15.72 15.72 0 00-4.57 0c-.14-.32-.34-.71-.51-1.01-.02-.02-.04-.03-.07-.03a16.89 16.89 0 00-4.07 1.23c-.01 0-.03.01-.04.02-2.59 3.77-3.3 7.45-2.95 11.08 0 .02.01.04.03.05a16.95 16.95 0 005.04 2.52c.03 0 .06-.01.07-.03.42-.55.79-1.13 1.11-1.74.02-.04 0-.08-.04-.09-.54-.2-1.06-.44-1.56-.72-.04-.02-.04-.08-.01-.11.1-.08.21-.16.31-.24.02-.01.04-.02.07-.01 3.44 1.54 7.16 1.54 10.55 0 .02-.01.05 0 .07.01.1.08.2.16.31.24.04.03.03.09-.01.11-.5.28-1.02.52-1.56.72-.04.01-.05.06-.04.09.32.61.69 1.19 1.11 1.74.02.02.04.03.07.03a16.9 16.9 0 005.04-2.52c.02-.01.03-.03.03-.05.42-4.27-.73-7.93-2.96-11.08-.01-.01-.02-.02-.04-.02zM8.56 14.49c-.99 0-1.81-.9-1.81-2 0-1.11.8-2 1.81-2 1.01 0 1.82.9 1.81 2 0 1.11-.8 2-1.81 2zm6.7 0c-.99 0-1.81-.9-1.81-2 0-1.11.8-2 1.81-2 1.01 0 1.82.9 1.81 2 0 1.11-.8 2-1.81 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-sm text-gray-400 hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-300">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
