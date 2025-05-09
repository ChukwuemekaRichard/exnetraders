import React from "react";
import Link from "next/link";

const InvestmentPlansSection = ({ dictionary }) => {
  return (
    <section id="investment-plans" className="py-16 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {dictionary.plans.title || "Investment Plans"}
          </h2>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            {dictionary.plans.subtitle ||
              "Choose the investment plan that aligns with your financial goals and risk tolerance."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
            <div className="bg-blue-100 p-6 text-center">
              <h3 className="text-2xl font-bold text-blue-900">
                {dictionary.plans.basic.title || "Basic Plan"}
              </h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-blue-600">
                  12%
                </span>
                <span className="ml-1 text-xl text-gray-500">Annual ROI</span>
              </div>
              <p className="mt-4 text-gray-600">
                {dictionary.plans.basic.description ||
                  "Perfect for beginners looking to enter the crypto investment market"}
              </p>
            </div>

            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Minimum Investment: $500</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Monthly Withdrawal Option</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>24/7 Market Monitoring</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Conservative Risk Profile</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg
                    className="h-6 w-6 text-gray-300 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Dedicated Investment Manager</span>
                </li>
              </ul>

              <button className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                <Link href={`/auth`}>Get Started</Link>
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-lg transform scale-105 z-10 border-4 border-blue-500">
            <div className="absolute top-0 right-0">
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl">
                MOST POPULAR
              </div>
            </div>
            <div className="bg-blue-100 p-6 text-center">
              <h3 className="text-2xl font-bold text-blue-900">
                {dictionary.plans.premium.title || "Premium Plan"}
              </h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-blue-600">
                  18%
                </span>
                <span className="ml-1 text-xl text-gray-500">Annual ROI</span>
              </div>
              <p className="mt-4 text-gray-600">
                {dictionary.plans.premium.description ||
                  "Balanced approach for experienced investors seeking growth"}
              </p>
            </div>

            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Minimum Investment: $1,500</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Weekly Withdrawal Option</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>24/7 Market Monitoring</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Moderate Risk Profile</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Dedicated Investment Manager</span>
                </li>
              </ul>

              <button className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                <Link href={`/auth`}>Get Started</Link>
              </button>
            </div>
          </div>

          {/* Elite Plan */}
          <div className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
            <div className="bg-blue-100 p-6 text-center">
              <h3 className="text-2xl font-bold text-blue-900">
                {dictionary.plans.elite.title || "Elite Plan"}
              </h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-blue-600">
                  24%
                </span>
                <span className="ml-1 text-xl text-gray-500">Annual ROI</span>
              </div>
              <p className="mt-4 text-gray-600">
                {dictionary.plans.elite.description ||
                  "Aggressive strategy for maximum growth potential"}
              </p>
            </div>

            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Minimum Investment: $10,000</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Daily Withdrawal Option</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>24/7 Market Monitoring</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Aggressive Risk Profile</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Personal Investment Advisor</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Access to Pre-ICO Opportunities</span>
                </li>
              </ul>

              <button className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                <Link href={`/auth`}>Get Started</Link>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-blue-200 mb-6">
            {dictionary.plans.disclaimer ||
              "* Returns based on historical performance. Past performance is not indicative of future results. Investment involves risk."}
          </p>
          <a
            href="https://t.me/exnettraderss"
            className="inline-flex items-center bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-100 transition duration-300"
          >
            <span>Schedule Investment Consultation</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InvestmentPlansSection;
