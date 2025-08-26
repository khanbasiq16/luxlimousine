"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/login", { email, password });

      if (response.data.success) {
      
        router.push("/");
      } else {
        toast.error(response.data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      toast(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center text-center p-10 bg-gray-100">
        <img
          src="/logo.png"
          alt="Taxi Service Logo"
          className="w-auto h-20 mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Luxcar
        </h1>
        <p className="text-gray-700 text-lg px-20">
          Fast, safe, and reliable Car rental Service. Sign in to book your ride
          now!
        </p>
      </div>

      {/* Right Section (Form) */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Sign In
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition focus:ring-2 focus:ring-black flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <a href="/sign-up" className="text-black font-medium">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
