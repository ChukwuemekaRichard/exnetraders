import React from "react";

const TrustSection = ({ dictionary }) => {
  return (
    <section className="py-16 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {dictionary.trust.title ||
              "Why You Should Trust exnettraders"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {dictionary.trust.subtitle ||
              "We've built our reputation on transparency, security, and consistent returns for our investors."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-lg p-8 shadow-md border border-blue-100 text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-blue-900">
              {dictionary.trust.security.title || "Bank-Level Security"}
            </h3>
            <p className="text-gray-700">
              {dictionary.trust.security.description ||
                "We implement military-grade encryption and multi-factor authentication to secure your investments and personal data."}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 shadow-md border border-blue-100 text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-blue-900">
              {dictionary.trust.transparency.title || "Full Transparency"}
            </h3>
            <p className="text-gray-700">
              {dictionary.trust.transparency.description ||
                "Access real-time reports on your investments and our trading activities. We maintain open communication about market conditions."}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 shadow-md border border-blue-100 text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-blue-900">
              {dictionary.trust.performance.title || "Proven Track Record"}
            </h3>
            <p className="text-gray-700">
              {dictionary.trust.performance.description ||
                "Five consecutive years of positive returns, with 97% client retention rate and a growing portfolio worth over $10M."}
            </p>
          </div>
        </div>

        <div className="mt-16 bg-blue-900 text-white p-8 rounded-lg shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                {dictionary.trust.regulation.title ||
                  "Fully Regulated & Compliant"}
              </h3>
              <p className="mb-4">
                {dictionary.trust.regulation.description ||
                  "exnettraders operates under strict regulatory oversight to ensure your investments are managed with the highest standards of integrity."}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Licensed Financial Services Provider (FSP# 123456)
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Annual Independent Audits</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Anti-Money Laundering (AML) Compliant</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Client Funds Held in Segregated Accounts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
