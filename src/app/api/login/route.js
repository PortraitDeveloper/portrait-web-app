import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import prisma from "@/utils/prisma";
import { signJwtAccessToken } from "@/utils/jwt";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read username and password from body
    const { username, password } = await request.json();
    console.log("GET USERNAME AT API/LOGIN:", username);

    // Looking to see if the username exists
    const credentials = await prisma.user.findUnique({
      where: { username: username },
    });

    console.log("GET CREDENTIALS AT API/LOGIN:", credentials);

    // If the username is not found, the error message "Username doesn't exist" will appear.
    if (!credentials) {
      return NextResponse.json(
        { message: "Username doesn't exist" },
        { status: 400 }
      );
    }

    // If the username is found then identify the password input against the password in the encrypted database
    if (await bcrypt.compare(password, credentials.password)) {
      // If identified successfully, generate an access token
      const { password: hashedPassword, ...result } = credentials;
      const accessToken = signJwtAccessToken(result);
      return NextResponse.json(
        {
          result: { ...result, accessToken },
        },
        { status: 200 }
      );
    } else {
      // If not identified successfully, the error message "Invalid password" will appear.
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/login",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}