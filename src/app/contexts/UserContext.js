"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const UserContext = createContext();

// Define default user structure
const defaultUser = {
  _id: "",
  name: "Loading...",
  email: "",
  balance: 0,
  investmentBalance: 0,
  totalEarnings: 0,
  investmentPlan: null,
  investmentStartDate: null,
  referralCode: "",
  referralCount: 0,
  isAdmin: false,
  lastDailyPayout: null,
  createdAt: "",
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        } else {
          const role = localStorage.getItem("userRole");
          if (role === "admin") {
            setUser({});
            return;
          } else {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_NAME}api/users/user`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // Merge response data with defaults to ensure all fields exist
            setUser({ ...defaultUser, ...response.data });
          }
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
