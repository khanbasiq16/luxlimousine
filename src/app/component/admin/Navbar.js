"use client";
import React, { useState, useEffect } from "react";
import { Bell, Home, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = ({ toggleSidebar, isOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter()

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/get-all-notification");
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);


   const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/logout");

      if (res?.data?.success) {
        toast.success(res.data.message);
        router.push("/")
        setShowProfileMenu(false)
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="ml-0 lg:ml-64 z-50 bg-white h-16 shadow-md flex items-center justify-between px-6">
      {/* Center: Search */}
      <div className="hidden md:flex flex-1 justify-center px-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right: Icons and profile */}
      <div className="flex items-center space-x-4 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            className="relative focus:outline-none"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-6 h-6 text-gray-800" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown with Animation */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md border border-gray-200 z-50 origin-top"
              >
                <div className="p-2 font-semibold border-b border-gray-200">
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div className="p-2 text-gray-500">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={`viewbokingdetails/${n.booking_id}`}
                      onClick={() => setShowNotifications(false)} // close dropdown on click
                      className="flex items-start gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                    >
                      {/* Car Image */}
                      {n.car_image && (
                        <img
                          src={n.car_image}
                          alt="Car"
                          className="w-12 h-12 rounded-md object-contain"
                        />
                      )}
                      <div>
                       <p className="text-sm font-medium text-gray-800 line-clamp-2">
  {n.message}
</p>
                        <p className="text-xs text-gray-500">{n.customer_email}</p>
                      </div>
                    </Link>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <span className="hidden md:block font-semibold text-gray-700">
              Admin
            </span>
          </button>

          {/* Profile Dropdown with Animation */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50 origin-top"
              >
                <Link
                  href={"/"}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                >
                  <Home className="w-4 h-4" /> Home
                </Link>
                <button
                disabled={loading}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                   <LogOut className="w-4 h-4" /> {loading ? <Loader2 className="w-4 h-4 animate-spin" />  : "Logout"  } 
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
