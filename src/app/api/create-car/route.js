import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("carName");
    const description = formData.get("description");
    const number_of_passengers = Number(formData.get("passengers"));
    const number_of_luggage = Number(formData.get("luggages"));
    const base_fare = Number(formData.get("baseFare"));
    const fare_per_kilometer = Number(formData.get("farePerKm"));
    const car_type = formData.get("carType");
    const carImageFile = formData.get("carImage");

    if (
      !title ||
      !description ||
      !carImageFile ||
      !base_fare ||
      !fare_per_kilometer
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

  
    let profileImageUrl = null;
    if (carImageFile && carImageFile.size > 0) {
      const buffer = Buffer.from(await carImageFile.arrayBuffer());
      const base64 = `data:${carImageFile.type};base64,${buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64, {
        folder: "cars",
        public_id: uuidv4(),
        resource_type: "image",
      });

      profileImageUrl = result.secure_url;
    }

  const carId = uuidv4(); // custom uuid banaya

await setDoc(doc(db, "cars", carId), {
  id: carId, // optional: agar field ke andar bhi store karna ho
  title,
  description,
  number_of_passengers,
  number_of_luggage,
  car_image: profileImageUrl,
  base_fare,
  fare_per_kilometer,
  car_type,
  createdAt: new Date(),
});


  const carsSnapshot = await getDocs(collection(db, "cars"));
    const cars = carsSnapshot.docs.map((doc) => doc.data());

    return NextResponse.json(
      { success: true, 
        message: "Car created successfully" ,
        cars
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting car:", error);
    return NextResponse.json(
      { success: false, message: "Error inserting car" },
      { status: 500 }
    );
  }
}
