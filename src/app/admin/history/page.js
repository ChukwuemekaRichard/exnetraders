"use client";
import AdminLayout from "@/app/components/layouts/AdminDashboardLayout";
import { Search, Filter, DollarSign, ArrowUp, ArrowDown, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function TransactionsHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${SERVER_NAME}api/transactions/admin/all`, {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            search: searchQuery,
            type: typeFilter !== 'all' ? typeFilter : undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTransactions(response.data.transactions);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [pagination.page, pagination.limit, searchQuery, typeFilter, statusFilter]);

  // Handle approve/reject transactions
  const handleTransactionAction = async (transactionId, action, notes = '', transactionHash = '') => {
    try {
      setLoading(true);
      
      // First, get the transaction to determine its type
      const transactionResponse = await axios.get(`${SERVER_NAME}api/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const transaction = transactionResponse.data;
  
      let endpoint = '';
      let data = { transactionId, notes };
  
      if (action === 'approve') {
        endpoint = transaction.type === 'deposit' 
          ? `${SERVER_NAME}api/transactions/admin/deposits/approve` 
          : `${SERVER_NAME}api/transactions/admin/withdrawals/approve`;
        
        if (transaction.type === 'withdrawal') {
          data.transactionHash = transactionHash;
        }
      } else {
        endpoint = transaction.type === 'deposit' 
          ? `${SERVER_NAME}api/transactions/admin/deposits/reject` 
          : `${SERVER_NAME}api/transactions/admin/withdrawals/reject`;
      }
  
      await axios.put(endpoint, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh transactions after action
      const response = await axios.get(`${SERVER_NAME}api/transactions/admin/all`, {
        params: {
          page: pagination.page,
          limit: pagination.limit
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTransactions(response.data.transactions);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process transaction');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      transaction._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const TypeBadge = ({ type }) => {
    const typeClasses = {
      deposit: "bg-blue-100 text-blue-800",
      withdrawal: "bg-purple-100 text-purple-800",
      investment: "bg-indigo-100 text-indigo-800",
      payout: "bg-green-100 text-green-800"
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeClasses[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions History</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <div className="flex items-center space-x-2">
              <div>
                <select 
                  className="bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="investment">Investments</option>
                  <option value="payout">Payouts</option>
                </select>
              </div>
              <div>
                <select 
                  className="bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <button className="flex items-center bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
                <Filter size={16} className="mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p>Loading transactions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Transactions Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction._id.substring(18, 24).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.userId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TypeBadge type={transaction.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {transaction.type === "withdrawal" ? (
                            <ArrowUp className="text-red-500 mr-1" size={16} />
                          ) : (
                            <ArrowDown className="text-green-500 mr-1" size={16} />
                          )}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        {(transaction.status === 'pending' && (transaction.type === 'deposit' || transaction.type === 'withdrawal')) && (
                          <>
                            <button 
                              onClick={() => handleTransactionAction(transaction._id, 'approve')}
                              className="text-green-600 hover:text-green-800"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleTransactionAction(transaction._id, 'reject')}
                              className="text-red-600 hover:text-red-800"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-800">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </button>
                  <button 
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={pagination.page * pagination.limit >= pagination.total}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}