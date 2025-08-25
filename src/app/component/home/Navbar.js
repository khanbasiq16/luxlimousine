"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, LogIn } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { userdata, setUserData } = useContext(UserContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/logout");

      if (res?.data?.success) {
        toast.success(res.data.message);
        setUserData(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-3 shadow-md bg-white sticky top-0 z-50">
      {/* Left - Logo + Links */}
      <div className="flex items-center gap-8">
        <Image
          src="/logo.webp"
          alt="logo"
          width={45}
          height={45}
          className="object-contain cursor-pointer"
          onClick={() => router.push("/")}
        />

        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <h2
            className="cursor-pointer hover:text-blue-500 transition"
            onClick={() => router.push("/")}
          >
            Home
          </h2>
          {userdata && (
            <h2
              className="cursor-pointer hover:text-blue-500 transition"
              onClick={() => router.push("/bookings")}
            >
              View my Bookings
            </h2>
          )}
          {userdata?.role === "admin" && (
            <h2
              className="cursor-pointer hover:text-blue-500 transition"
              onClick={() => router.push("/panel")}
            >
              Dashboard
            </h2>
          )}
        </div>
      </div>

      {/* Right - User Profile OR Sign In */}
      {userdata ? (
        <div className="relative">
          <Image
            src={userdata?.profileImage || "/default-avatar.png"}
            alt="user"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border cursor-pointer object-contain"
            onClick={() => setOpen(!open)}
          />

          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-60 rounded-xl shadow-lg bg-white p-4 border"
            >
              <div className="flex items-center gap-3 border-b pb-3 mb-3">
                <Image
                  src={userdata?.profileImage || "/default-avatar.png"}
                  alt="profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-contain"
                />
                <div>
                  <p className="font-semibold text-gray-800">{userdata.name}</p>
                  <p className="text-sm text-gray-500">{userdata.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full bg-black text-white py-2 px-4 rounded-lg transition flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Logout"}
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <button
      onClick={() => router.push("/sign-in")}
      className="flex items-center gap-2 bg-black text-white p-3 rounded-full 
                 hover:bg-gray-800 hover:scale-105 transition-all duration-300 ease-in-out"
    >
      <LogIn size={20} />
    </button>
      )}
    </nav>
  );
};

export default Navbar;
