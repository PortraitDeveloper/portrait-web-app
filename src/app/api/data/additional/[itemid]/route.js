import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Disable Caching
export const dynamic = "force-dynamic";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { itemid } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read a the item data by item ID
    const item = await prisma.additionals.findUnique({
      where: {
        item_id: itemid,
      },
    });

    // If item data not found then return an error log
    if (!item) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/additional/[itemid]",
        status: 404,
        message: "Item data not found.",
      };
      errorLog(log);
      return NextResponse.json(log);
    } else {
      // If item data found then return a success log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/additional/[itemid]",
        status: 200,
        message: "Item data found.",
        data: item,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/additional/[itemid]",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
