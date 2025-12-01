import { connectDB } from "@/lib/connect";
import User from "@/models/user.model";
import moment from "moment";
import { generateToken } from "@/lib/token";
import bcryptjs from "bcryptjs";

// login/route.js - ডিবাগ সংস্করণ
export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ডিবাগ: password check
    console.log("Input password:", password);
    console.log("Stored hash:", user.password);

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.isSuspended) {
      return Response.json(
        { message: "Account suspended. Contact admin." },
        { status: 403 }
      );
    }

    const expires = moment().add(
      process.env.JWT_ACCESS_EXPIRATION_MINUTES,
      "minutes"
    );

    const token = await generateToken(
      user._id,
      user.role,
      expires,
      "access",
      user.tokenVersion
    );

    return Response.json(
      {
        message: "Login successful",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          access: { token, expires: expires.toDate() },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
