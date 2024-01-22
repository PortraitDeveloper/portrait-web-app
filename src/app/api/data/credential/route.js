import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/credential",
        status: 401,
        message: "Suspicious request, not authorized to get data".trim(),
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to get this data" },
        { status: 401 }
      );
    }

    // Read all credentials data
    const credentials = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/credential",
      status: 200,
      message: "Item data found",
      data: credentials,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/credential",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/credential",
        status: 401,
        message: "Suspicious request, not authorized to alter".trim(),
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to alter this data" },
        { status: 401 }
      );
    }

    // Read the request body
    const { user_id, old_password, new_password, confirm_password } =
      await request.json();

    // Validate request body
    if (!old_password || !new_password || !confirm_password) {
      // Return error message
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/credential",
        status: 401,
        message: "All fields must be filled in",
      });
    }

    // Retrieve user credentials from the database
    const userCredential = await prisma.user.findUnique({
      where: { id: user_id },
    });

    // Validate old password
    const isValid = await bcrypt.compare(old_password, userCredential.password);

    // If old password not valid then return error message
    if (!isValid) {
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/credential",
        status: 401,
        message: "Invalid old password",
      });
    }

    // Validate if new_password is not the same as old_password
    if (new_password === old_password) {
      // Return error message
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/credential",
        status: 401,
        message: "The new password cannot be the same",
      });
    }

    // Validate if confirm_password matches new_password
    if (new_password !== confirm_password) {
      // Return error message
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/credential",
        status: 401,
        message: "Confirm password are not the same",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update the password in the database
    await prisma.user.update({
      where: { id: user_id },
      data: { password: hashedPassword },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/credential",
      status: 200,
      message: "Account setting have been saved",
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/credential",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
