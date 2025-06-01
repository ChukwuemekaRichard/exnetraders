"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserDashboardLayout from "@/app/components/layouts/UserDashboardLayout";
import { MdInfo, MdWarning } from "react-icons/md";
import CustomLoader from "@/app/components/CustomLoader";
import { useUser } from "@/app/contexts/UserContext";
import { Bitcoin, Coins, CircleDollarSign } from "lucide-react";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function WithdrawalFunds() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedMethod, setSelectedMethod] = useState("bitcoin"); // Default to bitcoin
  const [amount, setAmount] = useState("");
  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only crypto withdrawal methods
  const withdrawalMethods = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      icon: <Bitcoin className="h-8 w-8 md:h-10 md:w-10" />,
      shortName: "BTC"
    },
    {
      id: "ethereum",
      name: "Ethereum",
      icon: <Coins className="h-8 w-8 md:h-10 md:w-10" />,
      shortName: "ETH"
    },
    {
      id: "usdt",
      name: "USDT (TRC20)",
      icon: <CircleDollarSign className="h-8 w-8 md:h-10 md:w-10" />,
      shortName: "USDT"
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      // Validate amount
      if (parseFloat(amount) > user.balance) {
        throw new Error("Insufficient funds");
      }

      // Prepare withdrawal data
      const withdrawalData = {
        amount: parseFloat(amount),
        method: selectedMethod,
        fee: user.withdrawalFee,
        walletAddress: withdrawalAddress,
      };

      // Submit to backend
      const response = await axios.post(
        `${SERVER_NAME}api/transactions/withdrawals`,
        withdrawalData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      setError(
        error.response?.data?.error || error.message || "Withdrawal failed"
      );
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="space-y-4 md:space-y-6 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Withdraw Funds</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 rounded-md">
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

        {/* Balance Card - Mobile Optimized */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm md:text-base opacity-90">Available Balance</p>
              <p className="text-2xl md:text-3xl font-bold">${user?.balance?.toLocaleString() || '0.00'}</p>
            </div>
            <div className="p-2 md:p-3 bg-white bg-opacity-20 rounded-lg">
              <MdInfo className="h-6 w-6 md:h-8 md:w-8" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4 md:mb-6">
              Choose Withdrawal Method
            </h2>

            {/* Payment Methods - Mobile Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
              {withdrawalMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`p-3 md:p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                    selectedMethod === method.id
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="text-center">
                    <div className="mx-auto mb-2 text-indigo-500">
                      {method.icon}
                    </div>
                    <span className="text-sm md:text-base text-gray-800 font-medium block">
                      {method.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 block md:hidden">
                      {method.shortName}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Amount Input */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="50"
                    max={user?.balance || 0}
                    step="0.01"
                    required
                    className="block w-full pl-8 pr-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    placeholder="Enter amount (minimum $50)"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum withdrawal: $50 • Maximum: ${user?.balance?.toLocaleString() || '0.00'}
                </p>
              </div>

              {/* Wallet Address Input */}
              <div>
                <label
                  htmlFor="withdrawalAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Wallet Address
                </label>
                <textarea
                  id="withdrawalAddress"
                  value={withdrawalAddress}
                  onChange={(e) => setWithdrawalAddress(e.target.value)}
                  required
                  rows={3}
                  className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder={`Enter your ${selectedMethod} wallet address`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Double-check your wallet address. Cryptocurrency transactions cannot be reversed.
                </p>
              </div>

              {/* Warning Notice */}
              <div className="flex items-start p-3 md:p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <MdWarning className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">
                    Please verify all details carefully before submitting.
                    Withdrawal requests are processed within 1-3 business days.
                    Make sure the wallet address is correct as cryptocurrency
                    transactions cannot be reversed.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !amount || !withdrawalAddress}
                  className="w-full flex justify-center items-center py-3 md:py-4 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Submit Withdrawal Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Instructions Card - Mobile Optimized */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3 md:mb-4">
              Withdrawal Instructions
            </h2>
            
            {/* Mobile: Accordion-style steps */}
            <div className="space-y-3 md:space-y-4 text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm md:text-base">
                    Select Withdrawal Method:
                  </span>
                  <p className="text-sm mt-1">Choose your preferred cryptocurrency option.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm md:text-base">
                    Enter Amount:
                  </span>
                  <p className="text-sm mt-1">Specify how much you wish to withdraw (minimum $50).</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm md:text-base">
                    Provide Wallet Address:
                  </span>
                  <p className="text-sm mt-1">Enter your wallet information carefully.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm md:text-base">
                    Verification:
                  </span>
                  <p className="text-sm mt-1">Larger withdrawals may require additional verification.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                  5
                </div>
                <div>
                  <span className="font-medium text-gray-700 text-sm md:text-base">
                    Processing Time:
                  </span>
                  <p className="text-sm mt-1">Withdrawals are typically processed within 1-3 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}