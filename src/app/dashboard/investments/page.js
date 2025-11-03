"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserDashboardLayout from "@/app/components/layouts/UserDashboardLayout";
import { MdArrowUpward, MdInfo, MdQueryStats, MdAttachMoney } from "react-icons/md";
import { useUser } from "@/app/contexts/UserContext";
import CustomLoader from "@/app/components/CustomLoader";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

const investmentPlans = {
  basic: {
    id: "basic",
    dailyRate: 0.10, // 10% daily
    label: "Basic (10% Daily)",
    minAmount: 100,
    maxAmount: 1500,
    duration: 7, // in days
    description: "Low risk with steady daily returns",
  },
  premium: {
    id: "premium",
    dailyRate: 0.20, // 20% daily
    label: "Premium (20% Daily)",
    minAmount: 1500,
    maxAmount: 10000,
    duration: 7,
    description: "Balanced risk-reward with daily profits",
  },
  elite: {
    id: "elite",
    dailyRate: 0.50, // 50% daily
    label: "Elite (50% Daily)",
    minAmount: 10000,
    maxAmount: 1000000,
    duration: 7,
    description: "Higher potential daily returns",
  },
};

export default function Investments() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [activeInvestments, setActiveInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchActiveInvestments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const response = await axios.get(
          `${SERVER_NAME}api/transactions/investments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Check if response.data exists and is an array
        if (!Array.isArray(response?.data)) {
          throw new Error("Invalid response format");
        }

        // If empty array, just set empty investments and return
        if (response.data.length === 0) {
          setActiveInvestments([]);
          setIsLoading(false);
          return;
        }

        // Format active investments with daily returns calculation
        const formattedInvestments = response.data.map((investment) => {
          const plan = investmentPlans[investment.investmentPlan];
          const startDate = new Date(investment.createdAt);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + plan.duration);

          const totalDays = plan.duration;
          const daysPassed = Math.floor(
            (new Date() - startDate) / (1000 * 60 * 60 * 24)
          );
          const progress = Math.min(
            Math.floor((daysPassed / totalDays) * 100),
            100
          );

          // Calculate daily return and total earned so far
          const dailyReturn = investment.amount * plan.dailyRate;
          const totalEarned = dailyReturn * daysPassed;
          const expectedTotalReturn = dailyReturn * totalDays;

          return {
            id: investment._id,
            plan: plan.label,
            amount: investment.amount,
            dailyReturn: dailyReturn.toFixed(2),
            totalEarned: totalEarned.toFixed(2),
            dateStarted: startDate.toLocaleDateString(),
            dateEnding: endDate.toLocaleDateString(),
            expectedTotalReturn: expectedTotalReturn.toFixed(2),
            daysPassed,
            totalDays,
            progress,
            status: investment.status,
          };
        });

        setActiveInvestments(formattedInvestments);
      } catch (error) {
        console.error("Error fetching investments:", error);
        setError(
          error.response?.data?.error || 
          error.message || 
          "Failed to load active investments"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveInvestments();
  }, [router]);

  const handleInvestmentSubmit = async (e) => {
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
      if (parseFloat(investmentAmount) > user.balance) {
        throw new Error("Insufficient funds");
      }

      if (
        parseFloat(investmentAmount) < selectedPlan.minAmount ||
        parseFloat(investmentAmount) > selectedPlan.maxAmount
      ) {
        throw new Error(
          `Amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount}`
        );
      }

      // Submit investment
      const response = await axios.post(
        `${SERVER_NAME}api/transactions/investments`,
        {
          amount: parseFloat(investmentAmount),
          investmentPlan: selectedPlan.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        // Refresh investments list
        router.refresh();
        setSelectedPlan(null);
        setInvestmentAmount("");
      }
    } catch (error) {
      console.error("Investment error:", error);
      setError(
        error.response?.data?.error || error.message || "Investment failed"
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
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Investments</h1>

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

        {/* Active Investments */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              Active Investments
            </h2>

            {activeInvestments.length > 0 ? (
              <div className="space-y-5">
                {activeInvestments.map((investment) => (
                  <div
                    key={investment.id}
                    className="bg-gray-50 rounded-lg p-5 border border-gray-200"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-800">
                          {investment.plan}
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            Investment:{" "}
                            <span className="text-gray-800 font-medium">
                              ${investment.amount.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            Started:{" "}
                            <span className="text-gray-800 font-medium">
                              {investment.dateStarted}
                            </span>
                          </div>
                          <div>
                            Ending:{" "}
                            <span className="text-gray-800 font-medium">
                              {investment.dateEnding}
                            </span>
                          </div>
                          <div>
                            Days:{" "}
                            <span className="text-gray-800 font-medium">
                              {investment.daysPassed}/{investment.totalDays}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            Daily Return
                          </div>
                          <div className="text-lg font-medium text-green-600">
                            ${investment.dailyReturn}
                          </div>
                        </div>
                        <MdAttachMoney className="text-green-600 h-6 w-6" />
                      </div>
                    </div>

                    {/* Earnings Summary */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Earned So Far</div>
                        <div className="text-lg font-medium text-green-600">
                          ${investment.totalEarned}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Daily Profit</div>
                        <div className="text-lg font-medium text-blue-600">
                          ${investment.dailyReturn}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Total Expected</div>
                        <div className="text-lg font-medium text-purple-600">
                          ${investment.expectedTotalReturn}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Investment Progress</span>
                        <span>{investment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            investment.status === "active"
                              ? "bg-indigo-500"
                              : "bg-gray-400"
                          }`}
                          style={{ width: `${investment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MdQueryStats className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-800">
                  No Active Investments
                </h3>
                <p className="mt-1 text-gray-500">
                  Start investing to earn daily returns
                </p>
              </div>
            )}
          </div>
        </div>

        {/* New Investment */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              New Investment
            </h2>

            {selectedPlan ? (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-medium text-gray-800">
                    {selectedPlan.label}
                  </h3>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Change Plan
                  </button>
                </div>

                <form onSubmit={handleInvestmentSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="investmentAmount"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Investment Amount (USD)
                    </label>
                    <input
                      type="number"
                      id="investmentAmount"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      min={selectedPlan.minAmount}
                      max={selectedPlan.maxAmount}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={`Enter amount ($${selectedPlan.minAmount}-$${selectedPlan.maxAmount})`}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Available Balance: $
                      {user?.balance?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  {/* Investment Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Daily Return</div>
                      <div className="text-lg font-medium text-green-600">
                        ${(investmentAmount * selectedPlan.dailyRate || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Days</div>
                      <div className="text-lg font-medium text-blue-600">
                        {selectedPlan.duration}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Return</div>
                      <div className="text-lg font-medium text-purple-600">
                        ${(investmentAmount * selectedPlan.dailyRate * selectedPlan.duration || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <MdInfo className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">
                        You are about to invest in the {selectedPlan.label}{" "}
                        plan. You will earn{" "}
                        <span className="font-medium text-green-600">
                          ${(investmentAmount * selectedPlan.dailyRate || 0).toFixed(2)} daily
                        </span>{" "}
                        for {selectedPlan.duration} days.
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Total expected return:{" "}
                        <span className="font-medium text-purple-600">
                          ${(investmentAmount * selectedPlan.dailyRate * selectedPlan.duration || 0).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        "Confirm Investment"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  Select an investment plan to start earning daily returns:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(investmentPlans).map(([key, plan]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlan(plan)}
                      className="bg-white hover:bg-gray-50 p-5 rounded-lg border border-gray-200 text-left transition-colors"
                    >
                      <h3 className="text-lg font-medium text-gray-800">
                        {plan.label}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {plan.description}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Min. Investment</span>
                          <p className="text-gray-800 font-medium">
                            ${plan.minAmount}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Max. Investment</span>
                          <p className="text-gray-800 font-medium">
                            ${plan.maxAmount}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration</span>
                          <p className="text-gray-800 font-medium">
                            {plan.duration} days
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Daily ROI</span>
                          <p className="text-green-600 font-medium">
                            {(plan.dailyRate * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-green-50 rounded border border-green-100">
                        <div className="text-xs text-green-800 text-center">
                          Daily Payout
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}