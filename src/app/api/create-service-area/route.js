import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      city,
      state,
      country,
      latitude,
      longitude,
    } = body;

    if (!name || !city || !state || !country || !latitude || !longitude) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const id = uuidv4(); 
    const createdAt = new Date();

    // 🔹 Firestore me doc insert
    await setDoc(doc(db, "service_areas", id), {
      id,
      name,
      city,
      state,
      country,
      latitude,
      longitude,
      createdAt,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service area created successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating service area:", error);
    return NextResponse.json(
      { success: false, message: "Error creating service area" },
      { status: 500 }
    );
  }
}
