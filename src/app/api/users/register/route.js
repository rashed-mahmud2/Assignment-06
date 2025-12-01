// register/route.js - Consistent approach
import { connectDB } from "@/lib/connect";
import User from "@/models/user.model";
import bcryptjs from "bcryptjs"; // ✅ একই package ব্যবহার করুন

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    console.log("🔍 Register - Raw password:", JSON.stringify(password));

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return Response.json({ message: "Email already taken" }, { status: 400 });

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log("✅ User registered successfully");

    return Response.json(
      {
        message: "User registered successfully",
        data: { _id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Register error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
