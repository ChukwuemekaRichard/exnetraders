"use client";
import AdminLayout from "@/app/components/layouts/AdminDashboardLayout";
import {
  Search,
  Filter,
  DollarSign,
  Clock,
  Check,
  X,
  ChevronDown,
  Loader2,
  User,
  Calendar,
  CreditCard,
  Wallet,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function WithdrawalsManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [methodFilter, setMethodFilter] = useState("all");
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch withdrawals from API
  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await axios.get(
        `${SERVER_NAME}api/transactions/admin/withdrawals`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formattedWithdrawals = response.data.map((withdrawal) => ({
        id: withdrawal._id,
        user:
          withdrawal.userId?.name || withdrawal.userId?.email || "Unknown User",
        method: withdrawal.paymentMethod || "Unknown Method",
        amount: withdrawal.amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
        date: new Date(withdrawal.createdAt).toLocaleDateString(),
        status: withdrawal.status,
        walletAddress: withdrawal.walletAddress,
        transaction: withdrawal, // Keep full transaction object
      }));

      setWithdrawals(formattedWithdrawals);
      setError(null);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      setError(err.response?.data?.error || "Failed to fetch withdrawals");
      if (err.response?.status === 401) {
        router.push("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle withdrawal approval/rejection
  const handleWithdrawalAction = async (transactionId, action) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        action === "approve"
          ? "/admin/withdrawals/approve"
          : "/admin/withdrawals/reject";

      const requestData = {
        transactionId,
        notes: `Withdrawal ${action}d via admin dashboard`,
      };

      

      await axios.put(
        `${SERVER_NAME}api/transactions${endpoint}`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh withdrawals list
      await fetchWithdrawals();
    } catch (err) {
      console.error(`Error ${action}ing withdrawal:`, err);
      setError(`Failed to ${action} withdrawal`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Filter withdrawals
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || withdrawal.status === statusFilter;
    const matchesMethod =
      methodFilter === "all" ||
      withdrawal.method.toLowerCase() === methodFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const WithdrawalCard = ({ withdrawal }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header with ID and Status */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Withdrawal ID
          </p>
          <p className="text-sm font-medium text-gray-900">
            {withdrawal.id.substring(0, 8)}...
          </p>
        </div>
        <StatusBadge status={withdrawal.status} />
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-2">
        <User size={16} className="text-gray-400" />
        <div>
          <p className="text-xs text-gray-500">User</p>
          <p className="text-sm text-gray-900">{withdrawal.user}</p>
        </div>
      </div>

      {/* Amount and Method */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <DollarSign size={16} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Amount</p>
            <p className="text-sm font-medium text-gray-900">
              {withdrawal.amount}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CreditCard size={16} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Method</p>
            <p className="text-sm text-gray-900 capitalize">
              {withdrawal.method}
            </p>
          </div>
        </div>
      </div>

      {/* Date and Wallet Address */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm text-gray-900">{withdrawal.date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Wallet size={16} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Wallet</p>
            {withdrawal.walletAddress ? (
              <p className="text-sm text-gray-900 font-mono">
                {withdrawal.walletAddress.substring(0, 6)}...
                {withdrawal.walletAddress.substring(
                  withdrawal.walletAddress.length - 4
                )}
              </p>
            ) : (
              <span className="text-gray-400 text-sm">N/A</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {withdrawal.status === "pending" && (
        <div className="flex space-x-2 pt-2 border-t border-gray-100">
          <button
            className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            onClick={() => handleWithdrawalAction(withdrawal.id, "approve")}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-1 animate-spin" size={16} />
            ) : (
              <Check className="mr-1" size={16} />
            )}
            Approve
          </button>
          <button
            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            onClick={() => handleWithdrawalAction(withdrawal.id, "reject")}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-1 animate-spin" size={16} />
            ) : (
              <X className="mr-1" size={16} />
            )}
            Reject
          </button>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <CustomLoader />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6 text-red-500">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Withdrawals Management
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
            onClick={fetchWithdrawals}
          >
            Refresh Withdrawals
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search withdrawals..."
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                className="bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                className="bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="all">All Methods</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
                <option value="usdt">USDT</option>
              </select>
              <button
                className="flex items-center justify-center bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200"
                onClick={fetchWithdrawals}
              >
                <Filter size={16} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden lg:block bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Withdrawal ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWithdrawals.length > 0 ? (
                  filteredWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {withdrawal.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="truncate max-w-[120px] inline-block">
                          {withdrawal.user}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {withdrawal.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {withdrawal.walletAddress ? (
                          <span className="truncate max-w-[100px] inline-block font-mono">
                            {withdrawal.walletAddress.substring(0, 6)}...
                            {withdrawal.walletAddress.substring(
                              withdrawal.walletAddress.length - 4
                            )}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {withdrawal.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={withdrawal.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {withdrawal.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              className="text-green-600 hover:text-green-800 flex items-center disabled:opacity-50"
                              onClick={() =>
                                handleWithdrawalAction(withdrawal.id, "approve")
                              }
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <Loader2
                                  className="mr-1 animate-spin"
                                  size={16}
                                />
                              ) : (
                                <Check className="mr-1" size={16} />
                              )}
                              Approve
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 flex items-center disabled:opacity-50"
                              onClick={() =>
                                handleWithdrawalAction(withdrawal.id, "reject")
                              }
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <Loader2
                                  className="mr-1 animate-spin"
                                  size={16}
                                />
                              ) : (
                                <X className="mr-1" size={16} />
                              )}
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No withdrawals found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View (visible on mobile and tablet) */}
        <div className="lg:hidden">
          {filteredWithdrawals.length > 0 ? (
            <div className="space-y-4">
              {filteredWithdrawals.map((withdrawal) => (
                <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
              No withdrawals found matching your criteria
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredWithdrawals.length > 0 && (
          <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredWithdrawals.length}</span>{" "}
              of{" "}
              <span className="font-medium">{filteredWithdrawals.length}</span>{" "}
              results
            </div>
            <div className="flex space-x-2">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}