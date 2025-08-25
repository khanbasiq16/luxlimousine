import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const docRef = doc(db, "service_areas", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Service area not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        service_area: docSnap.data()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service area:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching service area" },
      { status: 500 }
    );
  }
}
