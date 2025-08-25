import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET() {
  try {
 
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);

    // Convert documents to array
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { success: true, bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching bookings", error: error.message },
      { status: 500 }
    );
  }
}
