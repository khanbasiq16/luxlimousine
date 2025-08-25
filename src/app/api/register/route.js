import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { signToken } from "@/app/component/breadcrumb/signToken";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone");
    const file = formData.get("profile_image");

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

   
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;



    let profileImageUrl = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64, {
        folder: `users`, 
        public_id: uuidv4(),         
        resource_type: "image",
      });

      profileImageUrl = result.secure_url;
    }

   
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name,
      email,
      phone,
      profileImage: profileImageUrl,
      role: "user",
      createdAt: new Date().toISOString(),
    });

        // Sign JWT token
        const token = signToken({ id: user.uid, email: email, role: "user" });

   const res =  NextResponse.json({
      message: "User registered successfully",
      success: true,
      user: { uid: user.uid, name, email, phone, profileImage: profileImageUrl },
    }, { status: 200 });

     res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });


    return res;

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
