import { NextResponse } from "next/server";

export async function POST(request) {
  // Read the body data
  const body = await request.json();
  console.log("body:", body);
  const token = "XYZ-123";

  return NextResponse.json(token, { status: 200 });
}
