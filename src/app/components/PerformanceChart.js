// components/PerformanceChart.jsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PerformanceChart() {
  const data = [
    { month: "Jan", BTC: 100, ETH: 100, ValidTrades: 100 },
    { month: "Feb", BTC: 105, ETH: 110, ValidTrades: 118 },
    { month: "Mar", BTC: 112, ETH: 115, ValidTrades: 132 },
    { month: "Apr", BTC: 108, ETH: 120, ValidTrades: 149 },
    { month: "May", BTC: 118, ETH: 125, ValidTrades: 165 },
    { month: "Jun", BTC: 124, ETH: 130, ValidTrades: 188 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
          <XAxis dataKey="month" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A202C",
              borderColor: "#2D3748",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="ValidTrades"
            stroke="#4F46E5"
            strokeWidth={3}
            activeDot={{ r: 8 }}
            name="ValidTrades"
          />
          <Line
            type="monotone"
            dataKey="BTC"
            stroke="#F59E0B"
            strokeWidth={2}
            name="Bitcoin"
          />
          <Line
            type="monotone"
            dataKey="ETH"
            stroke="#8B5CF6"
            strokeWidth={2}
            name="Ethereum"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}