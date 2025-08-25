import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    console.log("Deleting service_area with ID:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Service Area ID is required" },
        { status: 400 }
      );
    }

    // Pehle check karo ke doc exist karta hai ya nahi
    const serviceAreaRef = doc(db, "service_areas", id);
    const serviceAreaSnap = await getDoc(serviceAreaRef);

    if (!serviceAreaSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Service Area not found" },
        { status: 404 }
      );
    }

    // Delete service area
    await deleteDoc(serviceAreaRef);

    return NextResponse.json(
      { success: true, message: "Service Area deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting service area:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting service area" },
      { status: 500 }
    );
  }
}
