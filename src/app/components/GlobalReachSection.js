"use client";
import React from "react";
import GlobalPresenceMap from "./GlobalPresenceMap";

const GlobalReachSection = ({ dictionary }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {dictionary.globalReach.title || "Our Global Reach"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {dictionary.globalReach.subtitle ||
              "exnettraders connects investors from around the world to the most promising cryptocurrency opportunities."}
          </p>
        </div>

        <div className="relative mb-12 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
          <GlobalPresenceMap />
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">40+</div>
            <p className="text-gray-700">Countries with Active Investors</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">$10M+</div>
            <p className="text-gray-700">Assets Under Management</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-gray-700">Support Available</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
            <p className="text-gray-700">International Offices</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              {dictionary.globalReach.americas.title || "Americas"}
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">US</span>
                </div>
                <span>New York (Headquarters)</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">CA</span>
                </div>
                <span>Toronto</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">BR</span>
                </div>
                <span>São Paulo</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              {dictionary.globalReach.europe.title || "Europe & Africa"}
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">UK</span>
                </div>
                <span>London</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">CH</span>
                </div>
                <span>Zurich</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">ZA</span>
                </div>
                <span>Cape Town</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">AE</span>
                </div>
                <span>Dubai</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              {dictionary.globalReach.asia.title || "Asia-Pacific"}
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">SG</span>
                </div>
                <span>Singapore</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">HK</span>
                </div>
                <span>Hong Kong</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">JP</span>
                </div>
                <span>Tokyo</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                  <span className="text-xs font-bold">AU</span>
                </div>
                <span>Sydney</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="tel:+447446264643"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Find Your Nearest Office</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GlobalReachSection;
