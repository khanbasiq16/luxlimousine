import { db } from "@/lib/firebase"; 
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("user_id", "==", userId),
    );

    const querySnapshot = await getDocs(q);

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
