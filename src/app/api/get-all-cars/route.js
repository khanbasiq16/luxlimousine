import { NextResponse } from "next/server";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const carsRef = collection(db, "cars");

    // 🔹 Sare cars fetch karo, latest first
    const q = query(carsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      count: cars.length,
      data: cars,
    });

  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching cars" },
      { status: 500 }
    );
  }
}
