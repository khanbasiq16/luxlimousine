import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingIds, status } = body;

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No booking IDs provided" },
        { status: 400 }
      );
    }

    if (!status || !["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const batch = writeBatch(db);

    for (const id of bookingIds) {
      const bookingRef = doc(db, "bookings", id);
      const bookingSnap = await getDoc(bookingRef);

      if (bookingSnap.exists()) {
        batch.update(bookingRef, {
          booking_status: status.toLowerCase(),
          updatedAt: new Date(),
        });
      }
    }

    await batch.commit();

    return NextResponse.json(
      {
        success: true,
        message: `Status updated for ${bookingIds.length} bookings`,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating bulk bookings:", error);
    return NextResponse.json(
      { success: false, message: "Error updating bookings" },
      { status: 500 }
    );
  }
}
