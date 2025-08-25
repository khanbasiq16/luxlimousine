import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value; 
  const url = req.nextUrl.clone();

  if (!token) {
    if (url.pathname.startsWith("/panel")) {
      url.pathname = "/sign-in"; 
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    if (token && (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [ "/sign-in", "/sign-up"], 
};
