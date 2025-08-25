import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // 🔹 URL se id le rahe hain
    const body = await req.json();
    const { name, city, state, country, latitude, longitude } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Service area ID is required" },
        { status: 400 }
      );
    }

    // Check if doc exists
    const serviceAreaRef = doc(db, "service_areas", id);
    const existingDoc = await getDoc(serviceAreaRef);

    if (!existingDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "Service area not found" },
        { status: 404 }
      );
    }

    // Update fields (only send updated values)
    const updatedData = {
      ...(name && { name }),
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
      ...(latitude && { latitude }),
      ...(longitude && { longitude }),
      updatedAt: new Date(),
    };

    await updateDoc(serviceAreaRef, updatedData);

    return NextResponse.json(
      { success: true, message: "Service area updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating service area:", error);
    return NextResponse.json(
      { success: false, message: "Error updating service area" },
      { status: 500 }
    );
  }
}
