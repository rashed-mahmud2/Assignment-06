import { NextResponse } from "next/server";
import Blog from "@/models/blog.model";
import { connectDB } from "@/lib/connect";
import { checkAuthentication } from "@/lib/auth";

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

    const { text } = await req.json();
    const blog = await Blog.findById(blogId);
    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    const comment = blog.comments.id(params.commentId);
    if (!comment)
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );

    if (
      comment.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    comment.text = text;
    await blog.save();

    return NextResponse.json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

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

    const comment = blog.comments.id(params.commentId);
    if (!comment)
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );

    if (
      comment.user.toString() !== user._id.toString() &&
      blog.author.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    comment.deleteOne();
    await blog.save();
    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
