import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { ids } = body; 

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Service Area IDs are required" },
        { status: 400 }
      );
    }

    const batch = writeBatch(db);

    for (const id of ids) {
      const serviceAreaRef = doc(db, "service_areas", id);
      const serviceAreaSnap = await getDoc(serviceAreaRef);

      if (serviceAreaSnap.exists()) {
        batch.delete(serviceAreaRef);
      }
    }

    // Commit batch
    await batch.commit();

    return NextResponse.json(
      { success: true, message: "Selected Service Areas deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting service areas:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting service areas" },
      { status: 500 }
    );
  }
}
