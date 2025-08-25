import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

   
    const userDoc = await getDoc(doc(db, "users", decoded.id));
    if (!userDoc.exists()) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    
    return NextResponse.json(
      {
        user: {
          id: decoded.id,
          email: decoded.email,
          ...userDoc.data(),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("getUser API error:", err.message);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
