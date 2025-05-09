"use client";

import { motion } from "framer-motion";
import {
  FaBitcoin,
  FaChartLine,
  FaMoneyBillWave,
  FaPiggyBank,
} from "react-icons/fa";

export default function FeaturesSection({ dictionary }) {
  const features = [
    {
      icon: <FaBitcoin size={40} className="text-blue-600" />,
      title: dictionary.features.item1.title,
      description: dictionary.features.item1.description,
    },
    {
      icon: <FaMoneyBillWave size={40} className="text-blue-600" />,
      title: dictionary.features.item2.title,
      description: dictionary.features.item2.description,
    },
    {
      icon: <FaChartLine size={40} className="text-blue-600" />,
      title: dictionary.features.item3.title,
      description: dictionary.features.item3.description,
    },
    {
      icon: <FaPiggyBank size={40} className="text-blue-600" />,
      title: dictionary.features.item4.title,
      description: dictionary.features.item4.description,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="bg-white py-20">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {dictionary.features.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {dictionary.features.subtitle}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-700 mb-2">
              $10M+
              </div>
              <div className="text-gray-600">Assets Under Management</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-700 mb-2">5K+</div>
              <div className="text-gray-600">Active Investors</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-700 mb-2">24/7</div>
              <div className="text-gray-600">Market Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
