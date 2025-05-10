'use client'; // Required for state management

import React, { useState } from "react";

const GrowthProjectionSection = ({ dictionary }) => {
  // State for calculator inputs
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [duration, setDuration] = useState(3);
  const [calculated, setCalculated] = useState(false);

  // Investment plan configurations
  const investmentPlans = {
    basic: { rate: 0.12, label: "Basic (12% Annual)" },
    premium: { rate: 0.18, label: "Premium (18% Annual)" },
    elite: { rate: 0.24, label: "Elite (24% Annual)" }
  };

  // Calculate compound growth
  const calculateGrowth = () => {
    const annualRate = investmentPlans[selectedPlan].rate;
    const periods = duration;
    const principal = initialInvestment;
    
    // Compound interest formula: A = P(1 + r)^t
    const futureValue = principal * Math.pow(1 + annualRate, periods);
    const totalEarnings = futureValue - principal;
    const roi = (totalEarnings / principal) * 100;
    
    return {
      futureValue: futureValue.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2),
      roi: roi.toFixed(2),
      annualRate: (annualRate * 100).toFixed(2)
    };
  };

  const results = calculateGrowth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setCalculated(true);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {dictionary.growth.title || "How Your Money Will Grow"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {dictionary.growth.subtitle || 
              "See the potential of your investment with exnettrade through our compound growth strategies."}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-blue-900">
              {dictionary.growth.calculator.title || "Investment Growth Calculator"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label htmlFor="investment" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Investment
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="investment"
                    type="number"
                    min="100"
                    step="100"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Plan
                </label>
                <select
                  id="plan"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  {Object.entries(investmentPlans).map(([key, plan]) => (
                    <option key={key} value={key}>{plan.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Duration (Years)
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value={1}>1 Year</option>
                  <option value={3}>3 Years</option>
                  <option value={5}>5 Years</option>
                  <option value={10}>10 Years</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Calculate Growth
              </button>
            </form>
            
            {(calculated || true) && ( // Always show results, but you can change to only show after calculation
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2">Projected Results:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Future Value</p>
                    <p className="text-xl font-bold text-blue-900">${results.futureValue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-xl font-bold text-green-600">${results.totalEarnings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ROI</p>
                    <p className="text-xl font-bold text-blue-900">{results.roi}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Annual Rate</p>
                    <p className="text-xl font-bold text-blue-900">{results.annualRate}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6 text-blue-900">
              {dictionary.growth.strategy.title || "Our Growth Strategy"}
            </h3>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
                <h4 className="font-bold text-lg mb-2">Diversified Portfolio Allocation</h4>
                <p className="text-gray-700">We spread your investment across multiple cryptocurrencies, tokens, and blockchain projects to minimize risk while maximizing returns.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
                <h4 className="font-bold text-lg mb-2">Strategic Market Timing</h4>
                <p className="text-gray-700">Our team of experts uses advanced technical analysis to enter and exit positions at optimal times, capturing market movements for profit.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
                <h4 className="font-bold text-lg mb-2">Compound Interest Reinvestment</h4>
                <p className="text-gray-700">Unless you opt for regular payouts, all profits are automatically reinvested to accelerate your wealth accumulation through compound growth.</p>
              </div>
              
              <div className="flex items-center justify-center mt-8">
                <a href="#investment-plans" className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                  <span>See Our Investment Plans</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthProjectionSection;