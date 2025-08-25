import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    console.log("Deleting car with ID:", id);

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
        console.warn("Error deleting image from Cloudinary:", err.message);
      }
    }

    await deleteDoc(carRef);

    return NextResponse.json(
      { success: true, message: "Car deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting car" },
      { status: 500 }
    );
  }
}
