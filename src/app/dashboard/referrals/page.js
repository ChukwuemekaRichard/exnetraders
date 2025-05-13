"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserDashboardLayout from "@/app/components/layouts/UserDashboardLayout";
import {
  MdPerson,
  MdSearch,
  MdShare,
  MdContentCopy,
  MdCheckCircle,
  MdPending,
  MdMonetizationOn,
  MdPeopleOutline
} from "react-icons/md";
import { motion } from "framer-motion";
import CustomLoader from "@/app/components/CustomLoader";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function Referrals() {
  const router = useRouter();
  const [referrals, setReferrals] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [userData, setUserData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const mockReferrals = [
    {
      _id: "ref1",
      referredUser: "John Smith",
      email: "john.smith@example.com",
      status: "active",
      date: "2025-05-01T00:00:00.000Z",
      reward: 25.00,
      rewardStatus: "completed"
    },
    {
      _id: "ref2",
      referredUser: "Alice Johnson",
      email: "alice.johnson@example.com",
      status: "active",
      date: "2025-04-28T00:00:00.000Z",
      reward: 25.00,
      rewardStatus: "completed"
    },
    {
      _id: "ref3",
      referredUser: "Robert Davis",
      email: "robert.davis@example.com",
      status: "pending",
      date: "2025-05-08T00:00:00.000Z",
      reward: 25.00,
      rewardStatus: "pending"
    },
    {
      _id: "ref4",
      referredUser: "Maria Garcia",
      email: "maria.garcia@example.com",
      status: "active",
      date: "2025-04-20T00:00:00.000Z",
      reward: 25.00,
      rewardStatus: "completed"
    },
    {
      _id: "ref5",
      referredUser: "Michael Brown",
      email: "michael.brown@example.com",
      status: "pending",
      date: "2025-05-09T00:00:00.000Z",
      reward: 25.00,
      rewardStatus: "pending"
    }
  ];

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const userResponse = await axios.get(`${SERVER_NAME}api/users/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUserData(userResponse.data);
        
        // fetch actual referrals here
        // For now using mock data
        // const referralsResponse = await axios.get(`${SERVER_NAME}api/referrals`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setReferrals(referralsResponse.data);
        
        setReferrals(mockReferrals);
        
        const completed = mockReferrals
          .filter(ref => ref.rewardStatus === "completed")
          .reduce((sum, ref) => sum + ref.reward, 0);
          
        const pending = mockReferrals
          .filter(ref => ref.rewardStatus === "pending")
          .reduce((sum, ref) => sum + ref.reward, 0);
          
        setTotalEarnings(completed);
        setPendingEarnings(pending);
        
      } catch (err) {
        console.error("Error fetching referrals:", err);
        setError(err.response?.data?.message || "Failed to fetch referrals");
        if (err.response?.status === 401) {
          router.push("/auth");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [router]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userData.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    const referralUrl = `${window.location.origin}?ref=${userData.referralCode}`;

    if (navigator.share) {
      navigator.share({
        title: 'Join exnettrade with my referral code',
        text: 'Sign up using my referral code and we both earn rewards!',
        url: referralUrl,
      });
    } else {
      navigator.clipboard.writeText(referralUrl);
      alert("Referral link copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && referral.status === 'active') ||
      (activeTab === 'pending' && referral.status === 'pending');

    const matchesSearch = 
      referral.referredUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

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
        <div className="p-6 text-red-500">Error: {error}</div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6 w-full max-w-full overflow-x-hidden">
        <h1 className="text-2xl font-semibold text-gray-800">Referral Program</h1>

        {/* Referral Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Total Referrals</h3>
              <div className="p-3 bg-indigo-100 rounded-full">
                <MdPeopleOutline className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{referrals.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {referrals.filter(r => r.status === 'active').length} active referrals
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Total Earnings</h3>
              <div className="p-3 bg-green-100 rounded-full">
                <MdMonetizationOn className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">${totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">
              From {referrals.filter(r => r.rewardStatus === 'completed').length} completed referrals
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Pending Rewards</h3>
              <div className="p-3 bg-yellow-100 rounded-full">
                <MdPending className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">${pendingEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">
              From {referrals.filter(r => r.rewardStatus === 'pending').length} pending referrals
            </p>
          </div>
        </div>
        
        {/* Referral Code Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg rounded-xl overflow-hidden p-4 md:p-6 text-white relative">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-1">Your Referral Code</h3>
            <p className="text-sm opacity-80">Share this code with friends to earn rewards</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-lg flex-grow flex items-center justify-between w-full">
              <span className="text-xl font-mono font-semibold tracking-wider truncate">
                {userData.referralCode}
              </span>
              <motion.button
                onClick={copyToClipboard}
                className="text-white hover:text-white/80 transition-colors ml-2 flex-shrink-0"
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 1 }}
              >
                {copied ? (
                  <MdCheckCircle className="h-6 w-6" />
                ) : (
                  <MdContentCopy className="h-6 w-6" />
                )}
              </motion.button>
            </div>
            
            <motion.button
              onClick={shareReferral}
              className="flex items-center justify-center gap-2 bg-white text-indigo-600 font-medium px-4 sm:px-6 py-3 rounded-lg hover:bg-white/90 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MdShare className="h-5 w-5" />
              <span className="whitespace-nowrap">Share</span>
            </motion.button>
          </div>
          
          <div className="mt-4 text-sm">
            <p>Earn $25 for each new user who signs up and makes their first deposit!</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -right-5 -bottom-10 w-20 h-20 bg-white/10 rounded-full"></div>
        </div>
        
        {/* Referrals List */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`pb-2 px-4 text-sm font-medium ${
                    activeTab === 'all'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Referrals
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`pb-2 px-4 text-sm font-medium ${
                    activeTab === 'active'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`pb-2 px-4 text-sm font-medium ${
                    activeTab === 'pending'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pending
                </button>
              </div>
              
              <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search referrals..."
                />
              </div>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Joined
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reward
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReferrals.length > 0 ? (
                    filteredReferrals.map((referral) => (
                      <tr key={referral._id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                              <MdPerson className="h-4 w-4 sm:h-6 sm:w-6" />
                            </div>
                            <div className="ml-2 sm:ml-4">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">{referral.referredUser}</div>
                              <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-full">{referral.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-700">{formatDate(referral.date)}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {referral.status === 'active' ? (
                              <><MdCheckCircle className="mr-1 h-3 w-3" /> Active</>
                            ) : (
                              <><MdPending className="mr-1 h-3 w-3" /> Pending</>
                            )}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-xs sm:text-sm font-medium ${
                              referral.rewardStatus === 'completed' 
                                ? 'text-green-600' 
                                : 'text-yellow-600'
                            }`}>
                              ${referral.reward.toFixed(2)}
                            </span>
                            <span className={`ml-2 inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              referral.rewardStatus === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {referral.rewardStatus === 'completed' ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                        {referrals.length === 0 ? 'No referrals found' : 'No referrals match your filters'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How Referrals Work</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <MdContentCopy className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Share Your Code</h3>
              <p className="text-gray-600 text-sm">Copy your unique referral code and share it with friends</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <MdPerson className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Friend Signs Up</h3>
              <p className="text-gray-600 text-sm">They create an account using your referral code</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <MdMonetizationOn className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Both Get Rewarded</h3>
              <p className="text-gray-600 text-sm">You receive $25 when they make their first deposit</p>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}