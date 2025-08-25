"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Car, List, MapPin } from "lucide-react";

const DashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, carsRes, areasRes] = await Promise.all([
          axios.get("/api/get-all-bookings"),
          axios.get("/api/get-all-cars"),
          axios.get("/api/get-service-areas"),
        ]);

        setBookings(bookingsRes?.data?.bookings);
        setCars(carsRes?.data?.data);
        setServiceAreas(areasRes?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="text-center mt-20 text-lg font-medium">Loading...</div>;

  return (
    <div className="p-6 ml-0 lg:ml-72">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border rounded-xl p-6 flex items-center gap-4 transform  transition-transform duration-300">
          <List className="text-black w-10 h-10" />
          <div>
            <h2 className="text-black font-medium">Total Bookings</h2>
            <p className="text-3xl font-bold text-black">{bookings?.length}</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 flex items-center gap-4 transform transition-transform duration-300">
          <Car className="text-black w-10 h-10" />
          <div>
            <h2 className="text-black font-medium">Total Cars</h2>
            <p className="text-3xl font-bold text-black">{cars?.length}</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 flex items-center gap-4 transform  transition-transform duration-300">
          <MapPin className="text-black w-10 h-10" />
          <div>
            <h2 className="text-black font-medium">Service Areas</h2>
            <p className="text-3xl font-bold text-black">{serviceAreas?.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 rounded-t-xl">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider rounded-tl-xl">Customer</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider">Booking Status</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium uppercase tracking-wider rounded-tr-xl">Payment Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings?.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-3">{booking.customer_name}</td>
                  <td className="px-6 py-3">{booking.car_name}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full  text-black text-sm ${
                        booking.booking_status === "confirmed"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {booking.booking_status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-black text-sm ${
                        booking.payment_status === "paid" ? "bg-green-100" : "bg-red-510"
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
