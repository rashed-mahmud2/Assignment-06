import { NextResponse } from "next/server";
import Blog from "@/models/blog.model";
import { connectDB } from "@/lib/connect";
import { checkAuthentication } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { blogId } = await params;

    let user;
    try {
      user = await checkAuthentication(req);
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    const blog = await Blog.findById(blogId);
    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    const alreadyLiked = blog.likes.includes(user._id);

    if (alreadyLiked) {
      blog.likes.pull(user._id);
      await blog.save();
      return NextResponse.json({
        message: "Unliked successfully",
        likes: blog.likes.length,
      });
    } else {
      blog.likes.push(user._id);
      await blog.save();
      return NextResponse.json({
        message: "Liked successfully",
        likes: blog.likes.length,
      });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
