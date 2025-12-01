import { NextResponse } from "next/server";
import Blog from "@/models/blog.model";
import { connectDB } from "@/lib/connect";
import { checkAuthentication } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { blogId } = await params;
    const blog = await Blog.findById(blogId)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 🟠 UPDATE a blog
export async function PATCH(req, { params }) {
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

    if (
      blog.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const updated = await Blog.findByIdAndUpdate(blogId, data, {
      new: true,
    });

    return NextResponse.json({ message: "Blog updated successfully", updated });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 🔴 DELETE a blog
export async function DELETE(req, { params }) {
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

    if (
      blog.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await blog.deleteOne();
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
