import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(request) {
  const body = await request.json();
  const { name, password } = body.data;
  console.log(body.data);

  if (!name || !password) {
    return new NextResponse("Missing name, email, or password", {
      status: 400,
    });
  }

  const exist = await prisma.user.findUnique({
    where: {
      name,
    },
  });

  if (exist) {
    return new NextResponse("User already exists", {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
