import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;

    const formData = await req.formData();
    const title = formData.get("carName");
    const description = formData.get("description");
    const number_of_passengers = Number(formData.get("passengers"));
    const number_of_luggage = Number(formData.get("luggages"));
    const base_fare = Number(formData.get("baseFare"));
    const fare_per_kilometer = Number(formData.get("farePerKm"));
    const car_type = formData.get("carType");
    const carImageFile = formData.get("carImage");

    if (!id || !title || !description || !base_fare || !fare_per_kilometer) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
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

    let imagePath = carSnap.data().car_image;

    if (carImageFile && typeof carImageFile !== "string") {
      if (imagePath) {
        try {
          const publicId = imagePath
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0]; 

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("Error deleting old image:", err.message);
        }
      }

      const buffer = Buffer.from(await carImageFile.arrayBuffer());
      const base64 = `data:${carImageFile.type};base64,${buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "cars",
        public_id: uuidv4(),
        resource_type: "image",
      });

      imagePath = result.secure_url;
    }

    // 🔹 Update Firestore doc
    await updateDoc(carRef, {
      title,
      description,
      number_of_passengers,
      number_of_luggage,
      car_image: imagePath,
      base_fare,
      fare_per_kilometer,
      car_type,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Car updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { success: false, message: "Error updating car" },
      { status: 500 }
    );
  }
}
