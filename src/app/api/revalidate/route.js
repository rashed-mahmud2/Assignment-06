// app/api/revalidate/route.js (Next.js App Router)
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request) {
  const tag = request.nextUrl.searchParams.get("tag");

  if (!tag) {
    return NextResponse.json({ error: "Tag is required" }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
