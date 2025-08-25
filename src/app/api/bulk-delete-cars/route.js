import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Car IDs are required" },
        { status: 400 }
      );
    }

    const batch = writeBatch(db);
    const results = [];

    for (const id of ids) {
      const carRef = doc(db, "cars", id);
      const carSnap = await getDoc(carRef);

      if (!carSnap.exists()) {
        results.push({ id, status: "not_found" });
        continue;
      }

      const carData = carSnap.data();
      const imagePath = carData.car_image;

      if (imagePath) {
        try {
          const publicId = imagePath
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn(`Error deleting image for car ${id}:`, err.message);
        }
      }

      // 🔹 add delete to batch
      batch.delete(carRef);
      results.push({ id, status: "queued_for_delete" });
    }

    // 🔹 Commit batch (ek hi request me multiple deletes)
    await batch.commit();

    return NextResponse.json(
      { success: true, message: "Bulk delete completed", results },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { success: false, message: "Error in bulk delete" },
      { status: 500 }
    );
  }
}
