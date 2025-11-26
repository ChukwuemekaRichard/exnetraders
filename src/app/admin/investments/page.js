"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/app/components/layouts/AdminDashboardLayout";
import { ChevronDown, ChevronUp, Search, Loader2, User, Calendar, DollarSign, TrendingUp, Award, RefreshCw } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function AdminInvestments() {
  const router = useRouter();
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Check if user is admin - using your localStorage key "userRole"
  const isAdmin = () => {
    if (typeof window === 'undefined') return false;
    const role = localStorage.getItem("userRole");
    return role === "admin";
  };

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin()) {
      setError("Access denied: Admin privileges required");
      setIsLoading(false);
    } else {
      fetchInvestments();
    }
  }, []);

  // Fetch investments data
  const fetchInvestments = async () => {
    // Client-side admin check
    if (!isAdmin()) {
      setError("Access denied: Admin privileges required");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      
      if (!token) {
        router.push("/auth");
        return;
      }

      console.log("User role from localStorage:", role);

      const response = await axios.get(
        `${SERVER_NAME}api/transactions/admin/investments/active`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
          } 
        }
      );

      console.log("API Response:", response.data);
      setInvestments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching investments:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        router.push("/auth");
      } else if (err.response?.status === 403) {
        setError("Access denied: Admin privileges required");
      } else {
        setError(err.response?.data?.error || "Failed to load investments");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

// Handle investment termination - UPDATED VERSION
const handleTerminateInvestment = async (transactionId) => {
  // Client-side admin check
  if (!isAdmin()) {
    setError("Access denied: Admin privileges required");
    return;
  }

  if (!confirm("Are you sure you want to terminate this investment? This action cannot be undone.")) return;

  setIsProcessing(true);
  setProcessingId(transactionId);
  try {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
    if (!token) {
      router.push("/auth");
      return;
    }

    console.log("Attempting to terminate investment with ID:", transactionId);

    // Based on your withdrawals pattern, try these endpoints:
    let response;
    let success = false;

    // Option 1: Following the same pattern as withdrawals
    try {
      console.log("Trying endpoint: PUT /api/transactions/admin/investments/terminate");
      response = await axios.put(
        `${SERVER_NAME}api/transactions/admin/investments/terminate`,
        { transactionId: transactionId },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
          } 
        }
      );
      success = true;
      console.log("Termination successful with admin investments endpoint");
    } catch (err) {
      console.log("Admin investments endpoint failed:", err.response?.data);
      
      // Option 2: Alternative pattern
      try {
        console.log("Trying endpoint: PUT /api/transactions/admin/terminate-investment");
        response = await axios.put(
          `${SERVER_NAME}api/transactions/admin/terminate-investment`,
          { transactionId: transactionId },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
            } 
          }
        );
        success = true;
        console.log("Termination successful with terminate-investment endpoint");
      } catch (err2) {
        console.log("Terminate-investment endpoint failed:", err2.response?.data);
        
        // Option 3: Direct termination endpoint
        try {
          console.log("Trying endpoint: POST /api/transactions/admin/terminate-investment");
          response = await axios.post(
            `${SERVER_NAME}api/transactions/admin/terminate-investment`,
            { transactionId: transactionId },
            { 
              headers: { 
                Authorization: `Bearer ${token}`,
              } 
            }
          );
          success = true;
          console.log("Termination successful with POST terminate-investment endpoint");
        } catch (err3) {
          console.log("POST terminate-investment endpoint failed:", err3.response?.data);
          throw err; // Throw the original error
        }
      }
    }

    if (success) {
      // Show success message
      alert("Investment terminated successfully!");
      
      // Refresh the investments list
      await fetchInvestments();
    }
    
  } catch (err) {
    console.error("Error terminating investment:", err);
    console.error("Error details:", err.response?.data);
    
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      router.push("/auth");
    } else if (err.response?.status === 403) {
      setError("Access denied: Admin privileges required");
    } else if (err.response?.status === 404) {
      setError(`Investment not found. Please check:\n\n1. Investment ID: ${transactionId}\n2. Backend endpoint configuration\n3. Investment exists in database`);
    } else {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to terminate investment";
      setError(`Error: ${errorMessage}`);
      
      alert(`Error: ${errorMessage}\n\nPlease check the console for details.`);
    }
  } finally {
    setIsProcessing(false);
    setProcessingId(null);
  }
};

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchInvestments();
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

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle card expansion
  const toggleCardExpand = (id) => {
    setExpandedCards((prev) => ({
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

  // Investment Card Component for Mobile View
  const InvestmentCard = ({ investment }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <User size={16} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {investment.name || "Unknown User"}
            </p>
            <p className="text-xs text-gray-500">
              {investment.email || "No email"}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanBadgeClass(
            investment.investmentPlan
          )}`}
        >
          {investment.investmentPlan?.charAt(0).toUpperCase() +
            investment.investmentPlan?.slice(1) || "N/A"}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Invested:</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(investment.investmentBalance)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Earnings:</span>
          </div>
          <span className="text-sm font-medium text-green-600">
            {formatCurrency(investment.totalEarnings || 0)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Start Date:</span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(investment.investmentStartDate)}
          </span>
        </div>
      </div>

      {expandedCards[investment._id] && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Investment Details
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-600">Plan:</span>{" "}
                  {investment.investmentPlan || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Amount:</span>{" "}
                  {formatCurrency(investment.investmentBalance)}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Start Date:</span>{" "}
                  {formatDate(investment.investmentStartDate)}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Total Earnings:</span>{" "}
                  {formatCurrency(investment.totalEarnings || 0)}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Investment ID:</span>{" "}
                  <code className="text-xs bg-gray-100 p-1 rounded">{investment._id}</code>
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                User Details
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-600">Name:</span>{" "}
                  {investment.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Email:</span>{" "}
                  {investment.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">User ID:</span>{" "}
                  {investment.userId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => toggleCardExpand(investment._id)}
          className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          {expandedCards[investment._id] ? "Hide Details" : "Show Details"}
          {expandedCards[investment._id] ? (
            <ChevronUp size={16} className="ml-1" />
          ) : (
            <ChevronDown size={16} className="ml-1" />
          )}
        </button>
        <button
          className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleTerminateInvestment(investment._id)}
          disabled={isProcessing && processingId === investment._id}
        >
          {isProcessing && processingId === investment._id ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Terminate"
          )}
        </button>
      </div>
    </div>
  );

  // Show access denied if not admin
  if (!isAdmin()) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-red-800 font-semibold text-xl mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">Admin privileges are required to access this page.</p>
            <button 
              onClick={() => router.push("/dashboard")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <CustomLoader />
      </AdminLayout>
    );
  }

  if (error && !isAdmin()) {
    return (
      <AdminLayout>
        <div className="p-6 text-red-500">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Investment Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all active user investments
            </p>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full md:w-auto flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            <span>Refresh Investments</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Investments</p>
                <p className="text-2xl font-bold text-gray-900">{investments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(investments.reduce((sum, inv) => sum + (inv.investmentBalance || 0), 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Your Role</p>
                <p className="text-2xl font-bold text-gray-900">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
          <p className="font-medium text-yellow-800">Debug Information:</p>
          <p className="text-yellow-700">
            Total investments: {investments.length} | 
            First investment ID: {investments[0]?._id || 'None'} |
            Server: {SERVER_NAME}
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search investments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
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
        )}

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden lg:block bg-white p-6 rounded-xl shadow">
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
                        key={investment._id}
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
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              onClick={() =>
                                handleTerminateInvestment(investment._id)
                              }
                              disabled={isProcessing && processingId === investment._id}
                            >
                              {isProcessing && processingId === investment._id ? (
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
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-600">
                                      Total Earnings:
                                    </span>{" "}
                                    {formatCurrency(investment.totalEarnings || 0)}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-600">
                                      Investment ID:
                                    </span>{" "}
                                    <code className="text-xs bg-gray-100 p-1 rounded">{investment._id}</code>
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
                                  <p className="text-sm">
                                    <span className="font-medium text-gray-600">
                                      User ID:
                                    </span>{" "}
                                    {investment.userId || "N/A"}
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

        {/* Mobile Card View (hidden on desktop) */}
        <div className="lg:hidden space-y-4">
          {filteredInvestments.length > 0 ? (
            filteredInvestments.map((investment) => (
              <InvestmentCard
                key={investment._id}
                investment={investment}
              />
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-500">
              {searchTerm
                ? "No investments match your search"
                : "No active investments found"}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}