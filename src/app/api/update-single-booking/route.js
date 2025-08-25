import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    if (!status || !["pending", "confirmed", "cancelled"].includes(status.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

   
    await updateDoc(bookingRef, {
      booking_status: status.toLowerCase(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: `Status updated to ${status}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, message: "Error updating booking" },
      { status: 500 }
    );
  }
}
