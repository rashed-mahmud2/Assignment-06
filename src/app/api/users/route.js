import { connectDB } from "@/lib/connect";
import User from "@/models/user.model";
import { checkAuthentication, checkAuthorization } from "@/lib/auth";

// --------------------- GET ALL USERS (ADMIN ONLY) ---------------------
export async function GET(req) {
  try {
    await connectDB();
    const user = await checkAuthentication(req);
    checkAuthorization(user);

    const users = await User.find().select("-password");
    return Response.json(
      {
        message: "Users fetched successfully",
        count: users.length,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 401 });
  }
}
