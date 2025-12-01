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

    const { text } = await req.json();
    const blog = await Blog.findById(blogId);
    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    const newComment = { user: user._id, text };
    blog.comments.push(newComment);
    await blog.save();

    const lastComment = blog.comments[blog.comments.length - 1];
    return NextResponse.json(
      { message: "Comment added successfully", comment: lastComment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { blogId } = await params;

    const blog = await Blog.findById(blogId).populate(
      "comments.user",
      "name email"
    );
    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    return NextResponse.json({
      message: "Comments fetched successfully",
      comments: blog.comments,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
