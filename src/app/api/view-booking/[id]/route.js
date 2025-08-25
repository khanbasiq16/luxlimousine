// src/app/api/bookings/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const bookingRef = doc(db, "bookings", id); 
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, booking: bookingSnap.data()},
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching booking" },
      { status: 500 }
    );
  }
}
