"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { UserContext } from "@/app/component/context/UserContext";

const page = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userdata, setUserData } = useContext(UserContext);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/view-booking/${id}`);

        setBooking(res.data.booking);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading booking details...</span>
      </div>
    );
  }

  if (!booking) {
    return <div className="text-center text-red-500 mt-10">Booking not found!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Details</h1>

      {/* Booking Info */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Booking Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          <p><span className="font-semibold">Booking ID:</span> {booking.id}</p>
          <p><span className="font-semibold">Status:</span> 
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
              booking.booking_status === "confirmed"
                ? "bg-green-100 text-green-700"
                : booking.booking_status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}>
              {booking.booking_status}
            </span>
          </p>
          <p><span className="font-semibold">Payment:</span> 
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
              booking.payment_status === "paid"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {booking.payment_status}
            </span>
          </p>
          <p><span className="font-semibold">Booking Date:</span> {new Date(booking.booking_date).toLocaleDateString()}</p>
          <p><span className="font-semibold">Booking Time:</span> {booking.booking_time}</p>
          <p><span className="font-semibold">Created:</span> {new Date(booking.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">Name:</span> {booking.customer_name}</p>
          <p><span className="font-semibold">Email:</span> {booking.customer_email}</p>
          <p><span className="font-semibold">Phone:</span> {booking.customer_phone}</p>
        </div>
      </div>

      {/* Car Info */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Car Information</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={booking.car_image}
            alt={booking.car_name}
            className="w-40 h-28 object-cover rounded-lg shadow"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Car Name:</span> {booking.car_name}</p>
            <p><span className="font-semibold">Car Type:</span> {booking.car_type}</p>
            <p><span className="font-semibold">Base Fare:</span> ${booking.base_fare}</p>
            <p><span className="font-semibold">Fare/km:</span> ${booking.fare_per_km}</p>
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Trip Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">Pickup Location:</span> {booking.pickup_location}</p>
          <p><span className="font-semibold">Pickup Date:</span> {new Date(booking.pickup_date).toLocaleString()}</p>
          <p className="md:col-span-2">
            <span className="font-semibold">Dropoff Locations:</span>
            <ul className="list-disc ml-6 mt-1">
              {(booking.dropoff_locations).map((d, i) => (
                <li key={i}>{d.destinaitonaddress}</li>
              ))}
            </ul>
          </p>
          <p><span className="font-semibold">Distance:</span> {booking.distance_km} km</p>
          <p><span className="font-semibold">Route Distance:</span> {booking.route_distance_km} km</p>
          <p><span className="font-semibold">Passengers:</span> {booking.number_of_passengers}</p>
          <p><span className="font-semibold">Luggage:</span> {booking.number_of_luggage}</p>
          <p className="text-lg font-bold text-gray-800 md:col-span-2">
            Total Fare: ${booking.total_amount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
