"use client";
import AdminLayout from "@/app/components/layouts/AdminDashboardLayout";
import {
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart2,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";
import NewsletterModal from "@/app/components/NewsLetterModal";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await axios.get(
        `${SERVER_NAME}api/admin/dashboard/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { stats: apiStats, recentTransactions } = response.data;

      // Format stats for display
      const formattedStats = [
        {
          title: "Total Deposits",
          value: `$${apiStats.totalDeposits.toLocaleString()}`,
          change: "+0%", // You can calculate actual changes if you track historical data
          trend: "up",
          icon: <DollarSign className="text-blue-500" size={24} />,
          bgColor: "bg-blue-500/10",
        },
        {
          title: "Active Users",
          value: apiStats.activeUsers.toLocaleString(),
          change: "+0%",
          trend: "up",
          icon: <Users className="text-green-500" size={24} />,
          bgColor: "bg-green-500/10",
        },
        {
          title: "Pending Requests",
          value: (
            apiStats.pendingDeposits + apiStats.pendingWithdrawals
          ).toLocaleString(),
          change: "+0%",
          trend: "up",
          icon: <Clock className="text-yellow-500" size={24} />,
          bgColor: "bg-yellow-500/10",
        },
        {
          title: "Total Users",
          value: apiStats.totalUsers.toLocaleString(),
          change: "+0%",
          trend: "up",
          icon: <TrendingUp className="text-purple-500" size={24} />,
          bgColor: "bg-purple-500/10",
        },
      ];

      // Format recent activities
      const formattedActivities = recentTransactions.map((transaction) => ({
        id: transaction._id,
        user: transaction.userId?.name || "Unknown User",
        action: transaction.type,
        amount: `$${transaction.amount.toLocaleString()}`,
        status: transaction.status,
        time: new Date(transaction.createdAt).toLocaleTimeString(),
        transaction, // Keep the full transaction object for actions
      }));

      setStats(formattedStats);
      setRecentActivities(formattedActivities);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
      if (err.response?.status === 401) {
        router.push("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Handle transaction approval/rejection
  const handleTransactionAction = async (transactionId, action) => {
    try {
      const token = localStorage.getItem("token");
      // Find the transaction in recentActivities
      const transaction = recentActivities.find(
        (t) => t.id === transactionId
      )?.transaction;

      if (!transaction) {
        setError("Transaction not found");
        return;
      }

      let endpoint = "";
      let body = { transactionId, notes: "Processed via admin dashboard" };

      if (action === "approve") {
        endpoint =
          transaction.type === "deposit"
            ? "/admin/deposits/approve"
            : "/admin/withdrawals/approve";

        if (transaction.type === "withdrawal") {
          body.transactionHash = `admin-approved-${Date.now()}`;
        }
      } else {
        endpoint =
          transaction.type === "deposit"
            ? "/admin/deposits/reject"
            : "/admin/withdrawals/reject";
      }

      await axios.put(`${SERVER_NAME}api/transactions${endpoint}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh data after action
      fetchDashboardData();
    } catch (err) {
      console.error(`Error ${action}ing transaction:`, err);
      setError(`Failed to ${action} transaction`);
    }
  };

  const handleSendNewsletter = async (newsletterData) => {
    try {
      const token = localStorage.getItem("token");
      
      // Structure the content with HTML tags for proper formatting
      const formattedContent = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
          <!-- Header -->
          <div style="background-color: #6b46c1; padding: 25px; text-align: center; color: white;">
            <h1 style="margin: 0;">VALID TRADES INVESTMENT</h1>
          </div>
          
          <!-- Body Content -->
          <div style="padding: 25px; background-color: #ffffff; line-height: 1.6;">
            ${newsletterData.content.replace(/\n/g, '<br>')}
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
            <p>© ${new Date().getFullYear()} Valid Trades Investment</p>
          </div>
        </div>
      `;
  
      const response = await axios.post(
        `${SERVER_NAME}api/admin/dashboard/newsletter/send`,
        {
          subject: newsletterData.subject,
          content: formattedContent
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status !== 200) throw new Error("Failed to send newsletter");
      alert("Newsletter sent successfully!");
    } catch (error) {
      console.error("Error sending newsletter:", error);
      alert(error.response?.data?.error || "Error sending newsletter");
    }
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const StatCard = ({ title, value, change, trend, icon, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-xl`}>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div
            className={`flex items-center mt-2 text-sm ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend === "up" ? (
              <ArrowUp size={16} className="mr-1" />
            ) : (
              <ArrowDown size={16} className="mr-1" />
            )}
            {change}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-opacity-20">{icon}</div>
      </div>
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
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Revenue Overview
              </h2>
              <select className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart2 size={48} className="mx-auto mb-2" />
                <p>Revenue chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                User Activity
              </h2>
              <select className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-64 bg-gray-90 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Activity size={48} className="mx-auto mb-2" />
                <p>Activity chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activities
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StatusBadge status={activity.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() =>
                          router.push(`/admin/transactions/${activity.id}`)
                        }
                      >
                        View
                      </button>
                      {activity.status === "pending" && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900 mr-3"
                            onClick={() =>
                              handleTransactionAction(activity.id, "approve")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() =>
                              handleTransactionAction(activity.id, "reject")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {recentActivities.length} most recent transactions
            </div>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => router.push("/admin/history")}
            >
              View All Transactions
            </button>
          </div>
        </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-amber-200 rounded-lg shadow hover:bg-blue-amber-500 transition"
          >
            Send Newsletter
          </button>
          <NewsletterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSend={handleSendNewsletter}
          />
      </div>
    </AdminLayout>
  );
}
