import { connectDB } from "@/lib/connect";
import User from "@/models/user.model";
import Blog from "@/models/blog.model";
import { checkAuthentication } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    await checkAuthentication(req);

    const user = await User.findById(params.userId).select("-password");
    if (!user)
      return Response.json({ message: "User not found" }, { status: 404 });

    const blogs = await Blog.find({ author: params.userId }).sort({
      createdAt: -1,
    });

    return Response.json(
      {
        message: "User profile and blogs fetched successfully",
        data: {
          user,
          blogCount: blogs.length,
          blogs,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
