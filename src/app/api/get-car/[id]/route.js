import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Car ID is required" },
        { status: 400 }
      );
    }

    const carRef = doc(db, "cars", id);
    const carSnap = await getDoc(carRef);

    if (!carSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { id: carSnap.id, ...carSnap.data() } },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching car" },
      { status: 500 }
    );
  }
}
