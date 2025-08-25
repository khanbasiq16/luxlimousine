"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

const ViewBookingPage = () => {
  const params = useParams();
  const bookingId = params.id;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/view-booking/${bookingId}`);
        if (data.success) setBooking(data.booking);
        else setError(data.message || "Booking not found");
      } catch (err) {
        console.error(err);
        setError("Server error while fetching booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-700" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10 font-medium">
        {error}
      </div>
    );

  if (!booking) return null;

  return (
    <div className="max-w-6xl  ml-0 lg:ml-72 mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Booking Details</h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Customer Info</h3>
          <p><span className="font-medium">Name:</span> {booking.customer_name}</p>
          <p><span className="font-medium">Email:</span> {booking.customer_email}</p>
          <p><span className="font-medium">Phone:</span> {booking.customer_phone}</p>
        </div>

        {/* Booking Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Booking Info</h3>
          <p><span className="font-medium">Date:</span> {booking.booking_date}</p>
          <p><span className="font-medium">Pickup:</span> {booking.pickup_date} ({booking.pickup_location})</p>
          <p><span className="font-medium">Dropoff:</span> {booking.dropoff_date} ({booking.dropoff_location})</p>
          <p><span className="font-medium">Booking Time:</span> {booking.booking_time}</p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className={`px-2 py-1 rounded text-sm ${booking.booking_status === "Confirmed" ? "bg-green-100 text-green-800" : booking.booking_status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
              {booking.booking_status}
            </span>
          </p>
        </div>

        {/* Car Info Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Car Info</h3>
          <p><span className="font-medium">Car:</span> {booking.car_name}</p>
          <p><span className="font-medium">Type:</span> {booking.car_type}</p>
          <p><span className="font-medium">Passengers:</span> {booking.number_of_passengers}</p>
          <p><span className="font-medium">Luggage:</span> {booking.number_of_luggage}</p>
        </div>

        {/* Fare Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Fare</h3>
          <p><span className="font-medium">Base Fare:</span> ${booking.base_fare}</p>
          <p><span className="font-medium">Fare per km:</span> ${booking.fare_per_km}</p>
          <p><span className="font-medium">Total Amount:</span> ${booking.total_amount}</p>
        </div>

      </div>
    </div>
  );
};

export default ViewBookingPage;
