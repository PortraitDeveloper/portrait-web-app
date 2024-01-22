import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { keyword } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Authorization
    const accessToken = request.headers.get("Authorization");

    if (!accessToken) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/additional/keyword",
        status: 401,
        message: "Suspicious request, not authorized to get".trim(),
      };
      errorLog(log);
      return NextResponse.json(
        { message: "You are not authorized to get this data" },
        { status: 401 }
      );
    }

    // const keyWord = keyword === "null" ? "%%" : "%" + keyword + "%";
    // const additionals =
    //   await prisma.$queryRaw`SELECT * FROM additionals WHERE item_name LIKE ${keyWord} ORDER BY CAST(SUBSTRING(item_id, 4) AS INTEGER) ASC`;

    // Read parameters
    const keyWord = keyword === "null" ? "" : keyword;

    // Search additionals data
    const additionals = await prisma.additionals.findMany({
      where: {
        item_name: {
          contains: keyWord,
          mode: "insensitive",
        },
      },
    });

    // Check whether additionals data exists or not
    if (!additionals || additionals.length === 0) {
      // If additionals data not found then return error message

      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/additional/search/[keyword]",
        status: 404,
        message: "Additionals data not found",
      });
    } else {
      // If additionals data found then return additionals data
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/additional/search/[keyword]",
        status: 200,
        message: "Additionals data found",
        data: additionals,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/additional/search/[keyword]",
      status: 500,
      message: error.message.trim(),
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
