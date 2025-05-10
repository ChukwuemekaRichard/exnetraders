"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdPayment,
  MdShowChart,
  MdHistory,
  MdAccountCircle,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import axios from "axios";
import logo from "@/public/logo.png";
import CustomLoader from "../CustomLoader";
import ContactButton from "../ContactButton";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;
const CLIENT_NAME = process.env.NEXT_PUBLIC_CLIENT_NAME;

export default function UserDashboardLayout({ children }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [userName, setUserName] = useState("");

  // Navigation items
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: MdDashboard },
    {
      name: "Deposit",
      href: "/dashboard/deposit",
      icon: MdAccountBalanceWallet,
    },
    { name: "Withdraw", href: "/dashboard/withdrawal", icon: MdPayment },
    { name: "Investments", href: "/dashboard/investments", icon: MdShowChart },
    { name: "Transactions", href: "/dashboard/history", icon: MdHistory },
    { name: "Profile", href: "/dashboard/profile", icon: MdAccountCircle },
  ];

  useEffect(() => {
    // Check authentication and fetch user info
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/auth");
          return;
        }

        // Fetch user profile data
        const response = await axios.get(`${SERVER_NAME}api/users/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        setUserName(response.data.name);
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
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
    <div className="min-height-screen-ext bg-white-ext">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="mobile-menu-button-ext"
      >
        <MdMenu className="icon-height-6-ext icon-width-6-ext" />
      </button>

      {/* Mobile menu */}
      <div className="mobile-menu-container-ext">
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="mobile-overlay-ext"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Mobile sidebar */}
        <div
          className={`mobile-sidebar-ext ${
            isMobileMenuOpen ? "sidebar-visible-ext" : "sidebar-hidden-ext"
          }`}
        >
          <div className="sidebar-header-ext">
            <div className="logo-container-ext">
              <div className="logo-wrapper-ext">
                <Image src={logo} alt="Logo" width={56} height={56} />
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="close-button-ext"
            >
              <MdClose className="icon-height-6-ext icon-width-6-ext" />
            </button>
          </div>
          <div className="sidebar-content-ext">
            <nav className="sidebar-nav-ext">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link-ext ${
                    router.pathname === item.href
                      ? "nav-link-active-ext"
                      : "nav-link-inactive-ext"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`nav-icon-ext ${
                      router.pathname === item.href
                        ? "nav-icon-active-ext"
                        : "nav-icon-inactive-ext"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="sidebar-footer-ext">
            <button
              onClick={handleLogout}
              className="logout-button-ext"
            >
              <MdLogout className="logout-icon-ext" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="dashboard-layout-ext">
        {/* Desktop sidebar */}
        <div className="desktop-sidebar-ext">
          <div className="sidebar-header-ext">
            <div className="logo-container-ext">
              <div className="logo-wrapper-ext">
                <Image src={logo} alt="Logo" width={56} height={56} />
                <p className="logo-p-ext"><span>e</span>xnettrade</p>
              </div>
            </div>
          </div>
          <div className="sidebar-content-ext">
            <nav className="desktop-nav-ext">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`desktop-nav-link-ext ${
                    router.pathname === item.href
                      ? "desktop-nav-link-active-ext"
                      : "desktop-nav-link-inactive-ext"
                  }`}
                >
                  <item.icon
                    className={`desktop-nav-icon-ext ${
                      router.pathname === item.href
                        ? "desktop-nav-icon-active-ext"
                        : "desktop-nav-icon-inactive-ext"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="desktop-sidebar-footer-ext">
            <button
              onClick={handleLogout}
              className="desktop-logout-button-ext"
            >
              <MdLogout className="desktop-logout-icon-ext" />
              Sign Out
            </button>
          </div>
          <ContactButton />
        </div>

        {/* Main content */}
        <div className="main-content-ext">
          {/* Top navigation */}
          <header className="header-ext">
            <div className="header-container-ext">
              <div className="user-info-ext">
                <div className="user-avatar-container-ext">
                  <div className="user-avatar-ext">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-ext">{userName}</span>
                   <div className="bg-white shadow rounded-lg">
                      <h2>
                        {CLIENT_NAME}
                        {userData.referralCode}{" "}
                      </h2>
                    </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="main-ext">
            <div className="content-container-ext">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}