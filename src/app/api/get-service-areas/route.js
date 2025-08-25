import { NextResponse } from "next/server";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
  
    const q = query(
      collection(db, "service_areas"),
    );

    const snapshot = await getDocs(q);

    const serviceAreas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: serviceAreas,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service areas:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching service areas" },
      { status: 500 }
    );
  }
}
