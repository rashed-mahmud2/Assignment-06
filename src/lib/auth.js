import jwt from "jsonwebtoken";
import User from "@/models/user.model";
import { connectDB } from "./connect";

// ✅ Authentication check
export async function checkAuthentication(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized!");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.sub);
  if (!user) throw new Error("User not found!");

  if (decoded.tokenVersion !== user.tokenVersion) {
    throw new Error("Token invalidated. Please login again.");
  }

  if (user.isSuspended) {
    throw new Error("Account suspended. Contact support.");
  }

  // return user object instead of attaching to req
  return user;
}

// ✅ Admin-only check
export function checkAuthorization(user) {
  if (user.role !== "admin") {
    throw new Error("Unauthorized: Admins only.");
  }
}

// ✅ Owner or Admin check
export function checkOwnershipOrAdmin(user, resourceUserId) {
  if (
    user._id.toString() !== resourceUserId.toString() &&
    user.role !== "admin"
  ) {
    throw new Error("Unauthorized: Not allowed.");
  }
}
