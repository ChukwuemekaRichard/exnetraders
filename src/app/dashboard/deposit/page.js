"use client";
import UserDashboardLayout from "@/app/components/layouts/UserDashboardLayout";
import { useState } from "react";
import axios from "axios";
import { MdContentCopy, MdCheckCircle, MdInfo } from "react-icons/md";
import { useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";
import { Bitcoin, Coins, CircleDollarSign } from "lucide-react";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function DepositFunds() {
  const [selectedMethod, setSelectedMethod] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const router = useRouter();

  const paymentMethods = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      address: process.env.NEXT_PUBLIC_BITCOIN,
      icon: <Bitcoin className="h-10 w-10" />,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      address: process.env.NEXT_PUBLIC_ETHEREUM,
      icon: <Coins className="h-10 w-10" />,
    },
    {
      id: "usdt",
      name: "USDT (TRC20)",
      address: process.env.NEXT_PUBLIC_USDT,
      icon: <CircleDollarSign className="h-10 w-10" />,
    },
  ];

  const handleCopyAddress = () => {
    const selectedAddress = paymentMethods.find(
      (method) => method.id === selectedMethod
    ).address;
    navigator.clipboard.writeText(selectedAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!amount || amount < 100) {
        throw new Error("Minimum deposit amount is $100");
      }

      if (!file) {
        throw new Error("Please upload payment proof");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("paymentMethod", selectedMethod);
      formData.append(
        "walletAddress",
        paymentMethods.find((m) => m.id === selectedMethod).address
      );
      formData.append("transactionHash", transactionHash);
      formData.append("proofImage", file);

      const response = await axios.post(
        `${SERVER_NAME}api/transactions/deposits`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Deposit error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Deposit failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Deposit Funds</h1>

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

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              Choose Deposit Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`p-4 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    selectedMethod === method.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-2 text-indigo-500">
                      {method.icon}
                    </div>
                    <span className="text-gray-800 font-medium">
                      {method.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount (USD)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter amount (minimum $100)"
                />
              </div>

              <div>
                <label
                  htmlFor="transactionHash"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Transaction Hash
                </label>
                <input
                  type="text"
                  id="transactionHash"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your transaction hash"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {
                      paymentMethods.find(
                        (method) => method.id === selectedMethod
                      ).name
                    }{" "}
                    Address
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    {copied ? (
                      <>
                        <MdCheckCircle className="mr-1 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <MdContentCopy className="mr-1 h-4 w-4" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white p-3 rounded break-all font-mono text-sm text-gray-600 border border-gray-200">
                  {
                    paymentMethods.find(
                      (method) => method.id === selectedMethod
                    ).address
                  }
                </div>
              </div>

              <div className="flex items-start p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <MdInfo className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">
                    Send your payment to the address above. After making the
                    payment, upload your proof of payment below. Your deposit
                    will be credited to your account after confirmation.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Proof (Screenshot of Transaction)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {file ? (
                      <div className="text-indigo-600">
                        <MdCheckCircle className="mx-auto h-12 w-12" />
                        <p className="mt-1 text-gray-800">{fileName}</p>
                        <p className="text-xs text-gray-500">
                          Click below to change
                        </p>
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span className="px-3 py-2 block">Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                          required
                        />
                      </label>
                      <p className="pl-1 py-2">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
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
                    "Submit Deposit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Deposit Instructions
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <span className="font-medium text-gray-700">
                  1. Select Payment Method:
                </span>{" "}
                Choose your preferred cryptocurrency option.
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  2. Enter Amount:
                </span>{" "}
                Specify how much you wish to deposit (minimum $100).
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  3. Send Payment:
                </span>{" "}
                Transfer the exact amount to the wallet address shown.
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  4. Upload Proof:
                </span>{" "}
                Take a screenshot of your transaction and upload it.
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  5. Wait for Confirmation:
                </span>{" "}
                Your deposit will be credited to your account once confirmed
                (typically within 1-3 business days).
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
