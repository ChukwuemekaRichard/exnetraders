"use client";
import React from "react";
import AdminLayout from "@/app/components/layouts/AdminDashboardLayout";
import {
  User,
  Mail,
  Calendar,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Trash2,
  Loader2,
  MessageSquare,
  Bell,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function UserDetailPage({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentNote, setAdjustmentNote] = useState("");

  // Get the unwrapped params
  const unwrappedParams = React.use(params);
  const userId = unwrappedParams.id;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch user data and transactions
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      // First fetch user data
      const userRes = await axios.get(
        `${SERVER_NAME}api/users/auser/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(userRes.data);
      setError(null);

      // Then try to fetch transactions (don't fail if no transactions exist)
      try {
        const transactionsRes = await axios.get(
          `${SERVER_NAME}api/transactions/user/${userId}&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(transactionsRes.data);
      } catch (transactionsError) {
        console.log("No transactions found for user, setting empty array");
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data?.error || "Failed to load user data");
      if (err.response?.status === 401) {
        router.push("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle balance adjustment
  const handleBalanceAdjustment = async (action) => {
    if (!adjustmentAmount || adjustmentAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${SERVER_NAME}api/users/${userId}/balance`,
        {
          amount: parseFloat(adjustmentAmount),
          action: action,
          note: adjustmentNote || "Balance adjustment by admin",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUserData();
      setAdjustmentAmount(0);
      setAdjustmentNote("");
    } catch (err) {
      console.error("Error adjusting balance:", err);
      setError(err.response?.data?.error || "Failed to adjust balance");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${SERVER_NAME}api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/admin/users");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.error || "Failed to delete user");
    } finally {
      setIsProcessing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <CustomLoader />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="p-6 text-gray-500">User not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            <p className="mt-1 text-gray-500">
              View and manage user account information
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/users")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Users
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Left Column - User Profile */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex flex-col items-center py-4">
                  {/* Profile Avatar with Initials */}
                  <div className="relative mb-6">
                    <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {user.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </div>
                    <div className="absolute -bottom-2 right-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                          user.isSuspended
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-green-100 text-green-800 border border-green-200"
                        }`}
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </div>
                  </div>

                  {/* User Info */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {user.name}
                  </h2>

                  <div className="flex items-center justify-center bg-gray-50 rounded-full px-4 py-2 mb-4 w-full max-w-xs">
                    <Mail size={16} className="text-gray-500 flex-shrink-0" />
                    <p className="text-gray-600 ml-2 truncate">{user.email}</p>
                  </div>

                  {/* Additional User Stats */}
                  <div className="grid grid-cols-2 gap-4 w-full mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-500">Plan</p>
                      <p className="font-semibold text-gray-800 capitalize">
                        {user.investmentPlan || "None"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full border-t border-gray-100 pt-4 mt-2">
                    <div className="flex justify-center space-x-4">
                      <button className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-3 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
                        <Bell size={18} />
                      </button>
                      <button className="p-3 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">
                        <Shield size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete User Action */}
              <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  Account Actions
                </h3>
                <button
                  onClick={handleDeleteUser}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Account Details */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            {/* Account Summary */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Account Summary
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-50 p-3">
                      <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Registration Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-50 p-3">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Account Balance</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(user.balance)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-indigo-50 p-3">
                      <DollarSign className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Invested Amount</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(user.investmentBalance)}
                      </p>
                    </div>
                  </div>

                  {user.investmentPlan && (
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-purple-50 p-3">
                        <User className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Investment Plan</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {user.investmentPlan}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Balance Adjustment */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Balance Adjustment
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={adjustmentAmount}
                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note (optional)
                      </label>
                      <input
                        type="text"
                        value={adjustmentNote}
                        onChange={(e) => setAdjustmentNote(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Reason for adjustment"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleBalanceAdjustment("add")}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <ArrowDown size={18} />
                          Add Funds
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleBalanceAdjustment("subtract")}
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <ArrowUp size={18} />
                          Remove Funds
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Transactions
                </h3>
                <button
                  onClick={() =>
                    router.push(`/admin/transactions?userId=${user._id}`)
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr key={transaction._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`p-1.5 rounded-full mr-2 ${
                                  transaction.type === "deposit"
                                    ? "bg-green-100"
                                    : "bg-red-100"
                                }`}
                              >
                                {transaction.type === "deposit" ? (
                                  <ArrowDown
                                    className={`text-green-600`}
                                    size={16}
                                  />
                                ) : (
                                  <ArrowUp
                                    className={`text-red-600`}
                                    size={16}
                                  />
                                )}
                              </div>
                              <span className="capitalize font-medium text-gray-900">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
