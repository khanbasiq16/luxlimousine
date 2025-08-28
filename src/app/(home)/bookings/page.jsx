"use client"
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/component/context/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye } from "lucide-react"; // View icon

const Page = () => {
  const router = useRouter();
  const { userdata, setUserData } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("/api/get-user", { withCredentials: true });
        setUserData(res.data?.user);
      } catch (err) {
        console.error("Error checking user:", err);
        router.replace("/sign-in");
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (userdata?.id) {
      const fetchBookings = async () => {
        try {
          setLoading(true); // start loader
          const res = await axios.get(`/api/get-my-bookings?userId=${userdata?.id}`);

          console.log(res.data.bookings)
          setBookings(res.data.bookings);
        } catch (err) {
          console.error("Error fetching bookings:", err);
        } finally {
          setLoading(false); // stop loader
        }
      };

      fetchBookings();
    }
  }, [userdata]);

  return (
    <div className="p-6">
      <div className="flex justify-center w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        View My Booking
      </h1>
      </div>

      <div className="bg-white px-10 mt-3 rounded-2xl overflow-hidden">
        
        <div className="overflow-x-auto">
          {loading ? (
            // Loader UI
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 font-medium">
                Loading your bookings...
              </span>
            </div>
          ) : (
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Booking ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Car</th>
                  <th className="px-6 py-3 text-left">Car Type</th>
                  <th className="px-6 py-3 text-left">Booking Status</th>
                  <th className="px-6 py-3 text-left">Payment Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{b.id}</td>
                      <td className="px-6 py-4">{b.customer_name}</td>
                      <td className="px-6 py-4">{b.car_name}</td>
                      <td className="px-6 py-4">{b.car_type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            b.booking_status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : b.booking_status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {b.booking_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            b.payment_status === "paid"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {b.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => router.push(`/booking/${b.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
