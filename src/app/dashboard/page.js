"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  MdTrendingUp,
  MdAccountBalance,
  MdPayment,
  MdHistory,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import UserDashboardLayout from "../components/layouts/UserDashboardLayout";
import CustomLoader from "../components/CustomLoader";

import TawkToChat from "../components/smartsup";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    investmentBalance: 0,
    totalEarnings: 0,
    activeInvestments: 0,
    recentTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user data
        const userResponse = await axios.get(`${SERVER_NAME}api/users/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch ALL transactions (updated endpoint)
        const transactionsResponse = await axios.get(
          `${SERVER_NAME}api/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              limit: 5, // Get only the 5 most recent transactions
              sort: "-createdAt", // Sort by newest first
            },
          }
        );

        // Count active investments
        const activeInvestments = userResponse.data.investmentPlan ? 1 : 0;

        setDashboardData({
          balance: userResponse.data.balance || 0,
          investmentBalance: userResponse.data.investmentBalance || 0,
          totalEarnings: userResponse.data.totalEarnings || 0,
          activeInvestments,
          recentTransactions: transactionsResponse.data || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
        // Optional: Redirect to login if unauthorized
        if (error.response?.status === 401) {
          router.push("/auth");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  // Helper function to safely format numbers
  const formatNumber = (num) => {
    return (num || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return (
      <UserDashboardLayout>
        <CustomLoader />
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

        {/* Account Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <MdAccountBalance className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Available Balance
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ${formatNumber(dashboardData.balance)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <MdTrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Invested Amount
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ${formatNumber(dashboardData.investmentBalance)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <MdPayment className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Earnings
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ${formatNumber(dashboardData.totalEarnings)}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <MdArrowUpward className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="sr-only">Increased by</span>
                        {dashboardData.investmentBalance > 0
                          ? (
                              (dashboardData.totalEarnings /
                                dashboardData.investmentBalance) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                        %
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <MdHistory className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Investments
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {dashboardData.activeInvestments}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Transactions
            </h3>
            <a
              href="/dashboard/history"
              className="text-sm text-blue-900 hover:text-blue-800"
            >
              View All
            </a>
          </div>
          <div className="border-t border-gray-200">
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentTransactions?.length > 0 ? (
                    dashboardData.recentTransactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {transaction.type === "deposit" && (
                              <MdArrowUpward className="mr-2 h-5 w-5 text-green-500" />
                            )}
                            {transaction.type === "withdrawal" && (
                              <MdArrowDownward className="mr-2 h-5 w-5 text-red-500" />
                            )}
                            {transaction.type === "investment" && (
                              <MdTrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                            )}
                            {transaction.type === "payout" && (
                              <MdAccountBalance className="mr-2 h-5 w-5 text-indigo-500" />
                            )}
                            <span className="capitalize">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`text-sm ${
                              transaction.type === "withdrawal"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {transaction.type === "withdrawal" ? "-" : "+"}$
                            {formatNumber(transaction.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No recent transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Visible only on mobile */}
            <div className="md:hidden divide-y divide-gray-200">
              {dashboardData.recentTransactions?.length > 0 ? (
                dashboardData.recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {transaction.type === "deposit" && (
                          <MdArrowUpward className="mr-2 h-5 w-5 text-green-500" />
                        )}
                        {transaction.type === "withdrawal" && (
                          <MdArrowDownward className="mr-2 h-5 w-5 text-red-500" />
                        )}
                        {transaction.type === "investment" && (
                          <MdTrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                        )}
                        {transaction.type === "payout" && (
                          <MdAccountBalance className="mr-2 h-5 w-5 text-indigo-500" />
                        )}
                        <span className="capitalize font-medium text-gray-900">
                          {transaction.type}
                        </span>
                      </div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`text-lg font-semibold ${
                          transaction.type === "withdrawal"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {transaction.type === "withdrawal" ? "-" : "+"}$
                        {formatNumber(transaction.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No recent transactions
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Investment Performance */}
        {dashboardData.activeInvestments > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Investment Performance
              </h3>
            </div>
            <div className="border-t border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Summary */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Investment Summary
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Invested Amount
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          ${formatNumber(dashboardData.investmentBalance)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Total Earnings
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          ${formatNumber(dashboardData.totalEarnings)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          ROI
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {dashboardData.investmentBalance > 0
                            ? (
                                (dashboardData.totalEarnings /
                                  dashboardData.investmentBalance) *
                                100
                              ).toFixed(2)
                            : "0.00"}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Status */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Investment Status
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800">
                      Your investment is currently active and earning daily
                      returns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Deposit Funds
            </h3>
            <p className="text-gray-600 mb-4">
              Add funds to your account to start investing and growing your
              portfolio.
            </p>
            <a
              href="/dashboard/deposit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Deposit Now
            </a>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {dashboardData.activeInvestments > 0
                ? "Manage Investments"
                : "Start Investing"}
            </h3>
            <p className="text-gray-600 mb-4">
              {dashboardData.activeInvestments > 0
                ? "View and manage your current investment plan"
                : "Explore our investment plans and start growing your wealth today."}
            </p>
            <a
              href="/dashboard/investments"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {dashboardData.activeInvestments > 0
                ? "View Investment"
                : "Explore Plans"}
            </a>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4">
              Our support team is always ready to assist you with any questions.
            </p>
            <a
              href="https://t.me/exnettrades"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact Support
            </a>
          </div>
        </div>
        
      </div>
      <TawkToChat/>
    </UserDashboardLayout>
  );
}