// app/api/users/logout/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Clear the cookie (if you're using httpOnly cookie for token)
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("token", "", { path: "/", maxAge: 0 }); // remove token cookie
    response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 }); // optional if refresh token used
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout failed", error: error.message },
      { status: 500 }
    );
  }
}
