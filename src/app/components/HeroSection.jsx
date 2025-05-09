"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";

export default function HeroSection({ dictionary }) {
  const { locale } = useParams();

  return (
    <section className=" h-screen hero-gradient text-white">
      <div className="container-custom mx-auto py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-left">
          <div className="hero-text-div">
            <h1>{dictionary.hero.title}</h1>
            <p>{dictionary.hero.subtitle}</p>
            <div className="buttons-div">
              
            </div>
          </div>


          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="block"
          >
            {/* Glass morphism-inspired dashboard with neon accents */}
            <div className="relative w-full h-96 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl p-6 overflow-hidden shadow-2xl border border-blue-500/20">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
              </div>

              {/* Top control bar with realistic glassmorphism */}
              <div className="relative flex items-center justify-between mb-6 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                  </div>
                  <span className="font-medium text-sm text-white/90">
                    exnettraders
                  </span>
                </div>
                <div className="flex space-x-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Main metrics with glowing accents */}
              <div className="relative grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-800/40 to-blue-900/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/20 group hover:border-blue-400/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-blue-200 font-medium">
                      Market Sentiment
                    </div>
                    <div className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full font-medium">
                      BULLISH
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                    92<span className="text-lg">/100</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-blue-300">
                      Global trend: Positive
                    </div>
                    <div className="text-green-400 text-xs font-medium flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      2.4%
                    </div>
                  </div>
                  <div className="mt-2 h-1 w-full bg-blue-800/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-800/40 to-blue-900/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/20 group hover:border-blue-400/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-blue-200 font-medium">
                      Portfolio Health
                    </div>
                    <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full font-medium">
                      OPTIMAL
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                    Excellent
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-blue-300">
                      Risk profile: Balanced
                    </div>
                    <div className="text-blue-300 text-xs font-medium">
                      +4.2% Monthly
                    </div>
                  </div>
                  <div className="mt-2 flex h-1 gap-0.5">
                    <div className="h-full bg-green-500 rounded-l flex-1"></div>
                    <div className="h-full bg-green-400 flex-1"></div>
                    <div className="h-full bg-green-300 flex-1"></div>
                    <div className="h-full bg-blue-400 flex-1"></div>
                    <div className="h-full bg-blue-500 rounded-r flex-1"></div>
                  </div>
                </div>
              </div>

              {/* Advanced chart visualization */}
              <div className="relative bg-gradient-to-br from-blue-800/40 to-blue-900/40 p-4 rounded-lg backdrop-blur-sm border border-blue-500/20 group hover:border-blue-400/30 transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-blue-200 font-medium">
                    Performance Metrics
                  </div>
                  <div className="flex space-x-2">
                    <div className="px-2 py-0.5 text-xs rounded-full bg-blue-700/50 text-blue-200 border border-blue-600/30">
                      1D
                    </div>
                    <div className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50">
                      1W
                    </div>
                    <div className="px-2 py-0.5 text-xs rounded-full bg-blue-700/50 text-blue-200 border border-blue-600/30">
                      1M
                    </div>
                    <div className="px-2 py-0.5 text-xs rounded-full bg-blue-700/50 text-blue-200 border border-blue-600/30">
                      1Y
                    </div>
                  </div>
                </div>

                {/* Stunning area chart with gradient and glow */}
                <div className="relative h-24">
                  {/* Chart container */}
                  <div className="absolute inset-0">
                    {/* Chart line */}
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 100 30"
                      preserveAspectRatio="none"
                    >
                      {/* Gradient for fill */}
                      <defs>
                        <linearGradient
                          id="chartGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity="0.5"
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity="0"
                          />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="1" result="blur" />
                          <feComposite
                            in="SourceGraphic"
                            in2="blur"
                            operator="over"
                          />
                        </filter>
                      </defs>

                      {/* Chart area fill */}
                      <path
                        d="M0,25 L5,22 L10,23 L15,20 L20,21 L25,19 L30,16 L35,15 L40,14 L45,13 L50,12 L55,9 L60,11 L65,7 L70,8 L75,5 L80,6 L85,3 L90,7 L95,4 L100,2 L100,30 L0,30 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Chart line with glow */}
                      <path
                        d="M0,25 L5,22 L10,23 L15,20 L20,21 L25,19 L30,16 L35,15 L40,14 L45,13 L50,12 L55,9 L60,11 L65,7 L70,8 L75,5 L80,6 L85,3 L90,7 L95,4 L100,2"
                        stroke="#3b82f6"
                        strokeWidth="0.5"
                        fill="none"
                        filter="url(#glow)"
                      />

                      {/* Data points with glow */}
                      <circle
                        cx="65"
                        cy="7"
                        r="0.8"
                        fill="#fff"
                        filter="url(#glow)"
                      />
                      <circle
                        cx="85"
                        cy="3"
                        r="0.8"
                        fill="#fff"
                        filter="url(#glow)"
                      />
                      <circle
                        cx="100"
                        cy="2"
                        r="0.8"
                        fill="#fff"
                        filter="url(#glow)"
                      />
                    </svg>
                  </div>

                  {/* Axis markers */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                    <div className="text-xs text-blue-300 opacity-60">Mar</div>
                    <div className="text-xs text-blue-300 opacity-60">Apr</div>
                    <div className="text-xs text-blue-300 opacity-60">May</div>
                    <div className="text-xs text-blue-300 opacity-60">Jun</div>
                    <div className="text-xs text-blue-300 opacity-60">Jul</div>
                  </div>
                </div>
              </div>

              {/* Asset allocation floating labels */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <div className="bg-blue-800/60 px-2 py-1 rounded text-xs font-medium text-blue-200 border border-blue-600/20">
                  Stocks 42%
                </div>
                <div className="bg-indigo-800/60 px-2 py-1 rounded text-xs font-medium text-indigo-200 border border-indigo-600/20">
                  Crypto 28%
                </div>
                <div className="bg-violet-800/60 px-2 py-1 rounded text-xs font-medium text-violet-200 border border-violet-600/20">
                  Bonds 30%
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
