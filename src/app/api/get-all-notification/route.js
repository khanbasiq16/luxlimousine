// File: src/app/api/notifications/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET() {
  try {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    )).toISOString();

    const endOfDay = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23, 59, 59, 999
    )).toISOString();

    // Firestore query
    const q = query(
      collection(db, "notifications"),
      where("created_at", ">=", startOfDay),
      where("created_at", "<=", endOfDay)
    );

    const snapshot = await getDocs(q);

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { success: true, notifications },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching notifications", error: error.message },
      { status: 500 }
    );
  }
}
