// MarketTrendsSection.jsx
import React from "react";
import { Line } from "recharts";
import PerformanceChart from "./PerformanceChart";

const MarketTrendsSection = ({ dictionary }) => {

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {dictionary.marketTrends.title || "Our Market Performance"}
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            {dictionary.marketTrends.subtitle ||
              "exnettrade has consistently outperformed major cryptocurrencies through strategic trading and market analysis."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-800 p-2 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              {dictionary.marketTrends.chartTitle ||
                "Growth Comparison (Last 6 Months)"}
            </h3>
            <div className="h-64 w-full">
              <PerformanceChart />
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <span className="h-3 w-3 bg-blue-500 rounded-full mr-2"></span>
                <span>ValidTrades</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 bg-orange-500 rounded-full mr-2"></span>
                <span>Bitcoin</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 bg-purple-500 rounded-full mr-2"></span>
                <span>Ethereum</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-blue-400">
              {dictionary.marketTrends.achievementsTitle ||
                "Recent Market Achievements"}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-600 p-2 rounded-full mr-4 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">167% ROI</h4>
                  <p className="text-gray-400">
                    Our top investment plan delivered 167% returns in the last
                    quarter, outperforming market averages by 3.2x
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-600 p-2 rounded-full mr-4 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">
                    New Market Expansion
                  </h4>
                  <p className="text-gray-400">
                    Successfully entered 5 emerging cryptocurrency markets with
                    strategic investments in promising tokens
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-600 p-2 rounded-full mr-4 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Risk Mitigation</h4>
                  <p className="text-gray-400">
                    Maintained positive returns during recent market volatility
                    through advanced hedging strategies
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketTrendsSection;
