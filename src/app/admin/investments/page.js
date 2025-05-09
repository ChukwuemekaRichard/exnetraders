"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/app/components/layouts/AdminDashboardLayout";
import { ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function AdminInvestments() {
  const router = useRouter();
  const [expandedRows, setExpandedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch investments data
  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await axios.get(
        `${SERVER_NAME}api/transactions/admin/investments/active`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", response.data); // Keep this for debugging
      setInvestments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching investments:", err);
      setError(err.response?.data?.error || "Failed to load investments");
      if (err.response?.status === 401) {
        router.push("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle investment termination
  const handleTerminateInvestment = async (investmentId) => {
    if (!confirm("Are you sure you want to terminate this investment?")) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${SERVER_NAME}api/transactions/${investmentId}/terminate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchInvestments();
    } catch (err) {
      console.error("Error terminating investment:", err);
      setError(err.response?.data?.error || "Failed to terminate investment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Filter investments based on search term
  const filteredInvestments = investments.filter((investment) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      investment.name?.toLowerCase().includes(searchLower) ||
      investment.email?.toLowerCase().includes(searchLower) ||
      investment.investmentPlan?.toLowerCase().includes(searchLower) ||
      investment._id?.toLowerCase().includes(searchLower) ||
      formatCurrency(investment.investmentBalance)
        .toLowerCase()
        .includes(searchLower)
    );
  });

  // Initial data fetch
  useEffect(() => {
    fetchInvestments();
  }, []);

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Plan badge styles
  const getPlanBadgeClass = (plan) => {
    if (!plan) return "bg-gray-100 text-gray-800";
    switch (plan.toLowerCase()) {
      case "basic":
        return "bg-gray-100 text-gray-800";
      case "premium":
        return "bg-purple-100 text-purple-800";
      case "elite":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Investment Management
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={fetchInvestments}
          >
            Refresh Investments
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search investments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
        </div>

        {/* Investments Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvestments.length > 0 ? (
                  filteredInvestments.map((investment) => (
                    <>
                      <tr
                        key={`${investment.email}-${investment.investmentPlan}-${investment.investmentStartDate}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {investment.name || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {investment.email || "No email"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanBadgeClass(
                              investment.investmentPlan
                            )}`}
                          >
                            {investment.investmentPlan
                              ?.charAt(0)
                              .toUpperCase() +
                              investment.investmentPlan?.slice(1) || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(investment.investmentBalance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(investment.investmentStartDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(investment.totalEarnings || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleRowExpand(investment._id)}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              Details
                              {expandedRows[investment._id] ? (
                                <ChevronUp size={16} className="ml-1" />
                              ) : (
                                <ChevronDown size={16} className="ml-1" />
                              )}
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() =>
                                handleTerminateInvestment(investment._id)
                              }
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                "Terminate"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows[investment._id] && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Investment Details
                                </h4>
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-600">
                                      Plan:
                                    </span>{" "}
                                    {investment.investmentPlan || "N/A"}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-600">
                                      Amount:
                                    </span>{" "}
                                    {formatCurrency(
                                      investment.investmentBalance
                                    )}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-600">
                                      Start Date:
                                    </span>{" "}
                                    {formatDate(investment.investmentStartDate)}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  User Details
                                </h4>
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-600">
                                      Name:
                                    </span>{" "}
                                    {investment.name || "N/A"}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-600">
                                      Email:
                                    </span>{" "}
                                    {investment.email || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No investments match your search"
                        : "No active investments found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
