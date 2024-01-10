import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function PATCH(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const { item_id, item_name, item_price, item_desc } = await request.json();

    if (!item_price) {
      // Return a error log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/additional",
        status: 400,
        message: "Add-ons price must be filled in",
      });
    }

    const itemPrice = parseInt(item_price);

    if (itemPrice === 0) {
      // Return a error log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/additional",
        status: 400,
        message: "Add-ons price cannot be zero",
      });
    }

    const existingData = await prisma.additionals.findFirst({
      where: { item_id, item_name, item_price: itemPrice, item_desc },
    });

    if (existingData) {
      // Return a error log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/additional",
        status: 400,
        message: "Add-ons data already exist",
      });
    }

    // Update the item data
    const newData = await prisma.additionals.update({
      where: { item_id },
      data: {
        item_price: itemPrice,
        item_desc,
      },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/additional",
      status: 200,
      message: "Add-ons data updated",
      data: newData,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/additional",
      status: 500,
      message: error.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
