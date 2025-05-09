"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserDashboardLayout from "@/app/components/layouts/UserDashboardLayout";
import { 
  MdFilterList, 
  MdSearch, 
  MdArrowDownward, 
  MdArrowUpward,
  MdCheckCircle,
  MdPending,
  MdCancel
} from "react-icons/md";
import CustomLoader from "@/app/components/CustomLoader";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function TransactionHistory() {
  const router = useRouter();
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const response = await axios.get(`${SERVER_NAME}api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            sort: '-createdAt' // Sort by newest first
          }
        });

        setTransactions(response.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.response?.data?.message || "Failed to fetch transactions");
        if (err.response?.status === 401) {
          router.push("/auth");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on selected filters and search term
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesSearch = 
      transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.details && transaction.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.method && transaction.method.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesStatus && matchesSearch;
  });
  
  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <MdCheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <MdPending className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'rejected':
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <MdCancel className="mr-1 h-3 w-3" />
            {status === 'rejected' ? 'Rejected' : 'Failed'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  // Helper function to get transaction type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <MdArrowDownward className="h-5 w-5 text-green-500" />;
      case 'withdrawal':
        return <MdArrowUpward className="h-5 w-5 text-red-500" />;
      case 'investment':
        return <MdArrowUpward className="h-5 w-5 text-indigo-500" />;
      case 'profit':
      case 'payout':
        return <MdArrowDownward className="h-5 w-5 text-green-500" />;
      default:
        return <MdArrowDownward className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <UserDashboardLayout>
        <CustomLoader />
      </UserDashboardLayout>
    );
  }

  if (error) {
    return (
      <UserDashboardLayout>
        <div className="p-6 text-red-500">
          Error: {error}
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Transaction History</h1>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div>
                  <label htmlFor="type-filter" className="sr-only">Filter by type</label>
                  <select
                    id="type-filter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Types</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdrawal">Withdrawals</option>
                    <option value="investment">Investments</option>
                    <option value="payout">Payouts</option>
                    <option value="profit">Profits</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                  <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search transactions..."
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID & Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">TRX-{
                            transaction._id.substring(transaction._id.length - 6).toUpperCase()
                          }</div>
                          <div className="text-sm text-gray-500">
                            {transaction.details || transaction.method || 'Transaction'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{formatDate(transaction.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTypeIcon(transaction.type)}
                            <span className="ml-2 text-sm text-gray-700 capitalize">{transaction.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'payout'
                              ? 'text-green-600' 
                              : transaction.type === 'withdrawal' 
                                ? 'text-red-600' 
                                : 'text-indigo-600'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'payout' ? '+ ' : '- '}
                            ${transaction.amount?.toLocaleString() || '0.00'}
                          </div>
                          <div className="text-xs text-gray-500">{transaction.method || 'System'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(transaction.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        {transactions.length === 0 ? 'No transactions found' : 'No transactions match your filters'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}