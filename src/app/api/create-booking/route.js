// File: src/app/api/create-booking/route.js
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { booking } = body;

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking data is required" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const user_id = booking?.userdata?.id || null;
    const car_id = booking?.cardata?.id || null;

    const customer_name = booking?.userdata?.name || "";
    const customer_email = booking?.userdata?.email || "";
    const customer_phone = booking?.userdata?.phone || "";

    const booking_date = new Date().toISOString();
    const pickup_date = new Date().toISOString();

    const pickup_location = booking?.sourceAddress || "";
    const dropoff_locations = booking?.destinationAddress || [];

    const source_coordinates = booking?.sourceCordinates || {};
    const destination_coordinates = booking?.destinationCordinates || [];

    const booking_time = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });

    // Distance & Duration
    const distance_km =
      booking?.directionData?.routes?.[0]?.distance / 1000 || 0;
    const route_distance_km = distance_km;

    const duration_seconds = booking?.directionData?.routes?.[0]?.duration || 0;
    const route_duration_minutes = Math.round(duration_seconds / 60);

    // Car Details
    const car_name = booking?.cardata?.title || "";
    const car_type = booking?.cardata?.car_type || "";
    const car_image = booking?.cardata?.car_image || "";

    const base_fare = parseFloat(booking?.cardata?.base_fare || 0);
    const fare_per_km = parseFloat(booking?.cardata?.fare_per_kilometer || 0);

    const number_of_passengers = booking?.cardata?.number_of_passengers || 1;
    const number_of_luggage = booking?.cardata?.number_of_luggage || 0;

    // Status & Payment
    const booking_status = "pending";
    const payment_status = "paid";

    const total_amount = parseFloat(booking?.carAmount || 0);

    const createdAt = new Date().toISOString();

    // Firestore Insert
    await setDoc(doc(db, "bookings", id), {
      id,
      user_id,
      car_id,
      customer_name,
      customer_email,
      customer_phone,
      booking_date,
      pickup_date,
      pickup_location,
      dropoff_locations,
      source_coordinates,
      destination_coordinates,
      booking_time,
      distance_km,
      route_distance_km,
      route_duration_minutes,
      car_name,
      car_type,
      car_image,
      base_fare,
      fare_per_km,
      number_of_passengers,
      number_of_luggage,
      booking_status,
      payment_status,
      total_amount,
      created_at: createdAt,
      updated_at: createdAt,
    });

    const notificationId = uuidv4();
    await setDoc(doc(db, "notifications", notificationId), {
      id: notificationId,
      user_id,
      booking_id: id,
      customer_email,
      car_image,
      message: `New booking created by ${customer_name} for ${car_name}`,
      type: "booking",
      read: false,
      created_at: createdAt,
      updated_at: createdAt,
    });

    return NextResponse.json(
      { success: true, message: "Booking created successfully", bookingId: id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating booking",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
