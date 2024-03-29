import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";

export async function POST(request) {
  const body = await request.json();
  const { username, password, role } = body;
  console.log(body);

  if (!username || !password || !role) {
    return new NextResponse("Missing name, email, or password", {
      status: 400,
    });
  }

  const exist = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (exist) {
    return new NextResponse("User already exists", {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const credential = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
  });

  return NextResponse.json(credential);
}
