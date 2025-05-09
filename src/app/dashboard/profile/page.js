"use client";
import { useState, useEffect } from "react";
import UserDashboardLayout from "@/app/components/layouts/UserDashboardLayout";
import {
  MdEdit,
  MdLock,
  MdPerson,
  MdEmail,
  MdPhone,
  MdCheckCircle,
  MdVerified,
  MdWarning,
  MdLocationOn,
} from "react-icons/md";
import axios from "axios";

const SERVER_NAME = process.env.NEXT_PUBLIC_SERVER_NAME;

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SERVER_NAME}api/users/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || "",
          country: response.data.country || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.response?.data?.msg || "Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${SERVER_NAME}api/users/user`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
      setEditingProfile(false);
      setError(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.msg || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${SERVER_NAME}api/users/reset-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setEditingPassword(false);
      setError(null);
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.response?.data?.msg || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <UserDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </UserDashboardLayout>
    );
  }

  if (!user) {
    return (
      <UserDashboardLayout>
        <div className="text-center py-10">
          <p className="text-red-500">Failed to load user data</p>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>

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

        {/* Profile Information */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-800">
                Personal Information
              </h2>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center text-indigo-600 hover:text-indigo-500"
                >
                  <MdEdit className="mr-1 h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {editingProfile ? (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <MdPerson className="text-indigo-500 h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Full Name
                      </span>
                    </div>
                    <p className="mt-1 text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <MdEmail className="text-indigo-500 h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Email Address
                      </span>
                      <MdVerified
                        className="ml-2 text-green-500 h-4 w-4"
                        title="Verified"
                      />
                    </div>
                    <p className="mt-1 text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <MdPhone className="text-indigo-500 h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Phone Number
                      </span>
                      {user.phone && (
                        <MdVerified
                          className="ml-2 text-green-500 h-4 w-4"
                          title="Verified"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-gray-800">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <MdLocationOn className="text-indigo-500 h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Country
                      </span>
                    </div>
                    <p className="mt-1 text-gray-800">
                      {user.country || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Member since:{" "}
                <span className="text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              Security Settings
            </h2>

            {/* Password Change */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <MdLock className="text-indigo-500 h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium text-gray-800">
                    Password
                  </h3>
                </div>
                {!editingPassword && (
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="flex items-center text-indigo-600 hover:text-indigo-500"
                  >
                    <MdEdit className="mr-1 h-4 w-4" />
                    Change Password
                  </button>
                )}
              </div>

              {editingPassword ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingPassword(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-500 text-sm">
                  Your password was last changed more than 3 months ago. We
                  recommend updating it regularly for security reasons.
                </p>
              )}
            </div>

            {/* 2FA Toggle */}
            <div className="py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    Two-Factor Authentication
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add an extra layer of security by requiring a verification
                    code in addition to your password.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      twoFactorEnabled ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">
                      Enable two-factor authentication
                    </span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Email notifications */}
            <div className="py-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    Email Notifications
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Receive security alerts and notifications about your account
                    activity.
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      emailNotifications ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">Enable email notifications</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        emailNotifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              Identity Verification
            </h2>

            <div className="p-5 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 mt-1 p-1 rounded-full ${
                    user.identityVerified ? "bg-green-100" : "bg-yellow-100"
                  }`}
                >
                  {user.identityVerified ? (
                    <MdCheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <MdWarning className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {user.identityVerified
                      ? "Identity Verified"
                      : "Identity Verification Required"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {user.identityVerified
                      ? "Your identity has been verified. You now have full access to all features."
                      : "Complete identity verification to unlock higher investment limits and withdrawal options."}
                  </p>
                  {!user.identityVerified && (
                    <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Verify Identity
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
