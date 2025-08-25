import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({
      message: "Logout successfully",
      success: true,
    });

    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), 
      path: "/", 
    });

    return res;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
