import { connectDB } from "@/lib/connect";
import User from "@/models/user.model";
import { checkAuthentication, checkOwnershipOrAdmin } from "@/lib/auth";
import bcryptjs from "bcryptjs";

// --------------------- GET SINGLE USER ---------------------
export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await checkAuthentication(req);
    checkOwnershipOrAdmin(user, params.userId);

    const target = await User.findById(params.userId).select("-password");
    if (!target)
      return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json(
      { message: "User fetched successfully", data: target },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 401 });
  }
}

// --------------------- UPDATE USER ---------------------
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const authUser = await checkAuthentication(req);
    checkOwnershipOrAdmin(authUser, params.userId);

    const body = await req.json();
    delete body.role;

    if (body.email) {
      const existing = await User.findOne({ email: body.email });
      if (existing && existing._id.toString() !== params.userId)
        return Response.json(
          { message: "Email already taken" },
          { status: 400 }
        );
    }

    if (body.password) {
      body.password = await bcryptjs.hash(body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(params.userId, body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updated)
      return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json(
      { message: "User updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// --------------------- DELETE USER ---------------------
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await checkAuthentication(req);
    checkOwnershipOrAdmin(user, params.userId);

    const deleted = await User.findByIdAndDelete(params.userId);
    if (!deleted)
      return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json(
      {
        message: "User deleted successfully",
        data: { id: deleted._id, email: deleted.email },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 401 });
  }
}
