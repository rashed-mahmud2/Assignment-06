import { NextResponse } from "next/server";
import Blog from "@/models/blog.model";
import { connectDB } from "@/lib/connect";
import { checkAuthentication } from "@/lib/auth";

// 🟢 CREATE a new blog
export async function POST(req) {
  try {
    await connectDB();

    let user;
    try {
      user = await checkAuthentication(req);
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    const { title, content, image, category } = await req.json();

    if (!title || !content || !image || !category) {
      return NextResponse.json(
        {
          message: "All fields are required (title, content, image, category)",
        },
        { status: 400 }
      );
    }

    const blog = new Blog({
      title,
      content,
      image,
      category,
      author: user._id,
    });
    await blog.save();

    return NextResponse.json(
      { message: "Blog created successfully", blog },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// 🔵 READ all blogs
export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Blogs fetched successfully",
        count: blogs.length,
        data: blogs,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
