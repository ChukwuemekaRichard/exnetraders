// components/admin/AdminLayout.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import {
  MdDashboard,
  MdPeople,
  MdAccountBalanceWallet,
  MdShowChart,
  MdHistory,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import axios from "axios";
import logo from "@/public/logo.png";
import CustomLoader from "../CustomLoader";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [userName, setUserName] = useState("");

  // Admin navigation items
  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: MdDashboard },
    { name: "Users", href: "/admin/users", icon: MdPeople },
    { name: "Deposits", href: "/admin/deposits", icon: MdAccountBalanceWallet },
    {
      name: "Withdrawals",
      href: "/admin/withdrawals",
      icon: MdAccountBalanceWallet,
    },
    { name: "Investments", href: "/admin/investments", icon: MdShowChart },
    { name: "Transactions", href: "/admin/history", icon: MdHistory },
  ];

  useEffect(() => {
    // Check authentication and fetch admin info
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");

        if (!token || role !== "admin") {
          router.push("/auth");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/auth");
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none bg-white shadow-md"
        >
          <MdMenu className="h-6 w-6" />
        </button>

        {/* Mobile menu */}
        <div className="lg:hidden">
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}

          {/* Mobile sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-blue-900 transition-transform duration-300 ease-in-out transform ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } rounded-r-xl shadow-2xl`}
          >
            <div className="flex items-center justify-between h-16 px-4 shadow-lg rounded-tr-xl">
              <div className="flex items-center justify-center">
                <div className="h-14 w-14 flex items-center justify-center">
                  <Image src={logo} alt="Logo" width={56} height={56} />
                </div>
                <span className="ml-2 text-white font-bold">Admin Panel</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white focus:outline-none"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <nav className="mt-5 px-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-xl ${
                      router.pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "text-blue-100 hover:bg-blue-600 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        router.pathname === item.href
                          ? "text-white"
                          : "text-blue-200 group-hover:text-white"
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 text-base font-medium text-blue-100 rounded-xl hover:bg-blue-600 hover:text-white"
              >
                <MdLogout className="mr-3 h-6 w-6 text-blue-200" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="flex h-screen">
          {/* Desktop sidebar */}
          <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-blue-900 rounded-r-xl shadow-lg">
            <div className="flex items-center justify-center h-16 shadow-lg rounded-tr-xl">
              <div className="flex items-center justify-center">
                <div className="h-14 w-14 flex items-center justify-center">
                  <Image src={logo} alt="Logo" width={56} height={56} />
                </div>
                <span className="ml-2 text-white font-bold">Admin Panel</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto px-2">
              <nav className="mt-5 flex-1 px-2 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition duration-150 ease-in-out ${
                      router.pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "text-blue-100 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        router.pathname === item.href
                          ? "text-white"
                          : "text-blue-200 group-hover:text-white"
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 text-sm font-medium text-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition duration-150 ease-in-out"
              >
                <MdLogout className="mr-3 h-6 w-6 text-blue-200" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:pl-64 flex flex-col flex-1">
            {/* Top navigation */}
            <header className="bg-white shadow-xl">
              <div className="flex justify-between items-center px-12 sm:px-6 lg:px-8 h-16">
                <div className="flex items-center">
                  <div className="ml-3 relative">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        A
                      </div>
                      <span className="ml-2 text-gray-700">Admin</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-600 hover:text-blue-600">
                    <MdSettings className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 pb-8 bg-gray-50">
              <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
