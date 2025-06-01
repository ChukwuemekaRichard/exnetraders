"use client";
import AdminLayout from "@/app/components/layouts/AdminDashboardLayout";
import { Search, Filter, User, Mail, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";
import AddUserModal from "@/app/components/AddUserModal";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function UsersManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await axios.get(`${SERVER_NAME}api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedUsers = response.data.map((user) => ({
        id: user._id,
        name: user.name || "No Name",
        email: user.email,
        joined: new Date(user.createdAt).toLocaleDateString(),
        status: user.investmentPlan ? "active" : "inactive",
        balance:
          user.balance?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }) || "$0.00",
        investments: user.investmentBalance > 0 ? 1 : 0,
        isAdmin: user.isAdmin,
        investmentPlan: user.investmentPlan,
      }));

      setUsers(formattedUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.error || "Failed to fetch users");
      if (err.response?.status === 401) {
        router.push("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // handle submission
  const handleUserAdded = () => {
    fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading)
    return (
      <AdminLayout>
        <CustomLoader />
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <div className="p-6 text-red-500">{error}</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add New User
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                className="flex items-center bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200"
                onClick={fetchUsers}
              >
                <Filter size={16} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investment Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1" size={14} />
                          {user.joined}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.investmentPlan ? (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded capitalize">
                            {user.investmentPlan}
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded capitalize">
                            None
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.balance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-100 px-2 py-0.5 text-blue-600 hover:text-blue-900 rounded"
                            onClick={() =>
                              router.push(`/admin/users/${user.id}`)
                            }
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={22} />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                      <p className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    View
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="text-gray-400 mr-2" size={16} />
                    <span className="text-gray-600 truncate">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="text-gray-400 mr-2" size={16} />
                    <span className="text-gray-600">Joined {user.joined}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Investment Plan</p>
                      {user.investmentPlan ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded capitalize">
                          {user.investmentPlan}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                          None
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Balance</p>
                      <p className="text-sm font-medium text-gray-900">{user.balance}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </AdminLayout>
  );
}