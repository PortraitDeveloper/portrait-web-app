import { NextResponse } from "next/server";
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
    // Read all item data
    const items = await prisma.additionals.findMany();

    // Return all item data
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/additional",
      status: 200,
      message: "Items data found.",
      data: items,
    });
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/additional",
      status: 500,
      message: error.message.message,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const { item_name, item_price, item_desc } = await request.json();

    // Check whether the item data already exists
    const item = await prisma.additionals.findFirst({
      where: {
        item_name,
      },
    });

    // If item data already exists then return an error log
    if (item) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/additional",
        status: 400,
        message: "Item data already exists.",
      };
      return NextResponse.json(log);
    } else {
      // Generate a item ID
      const rowCount = await prisma.additionals.count();
      const rowNumber = rowCount + 1;
      const item_id = `it-${rowNumber}`;

      // Create a new item data
      const newData = await prisma.additionals.create({
        data: {
          item_id,
          item_name,
          item_price,
          item_desc,
        },
      });

      // Return a success log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/additional",
        status: 201,
        message: "Item data inserted.",
        data: newData,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/additional",
      status: 500,
      message: error.message.message,
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
    // Read the body data
    const { item_id, item_name, item_price, item_desc } = await request.json();

    // Update the item data
    const newData = await prisma.additionals.update({
      where: { item_id },
      data: { item_name, item_price, item_desc },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/additional",
      status: 200,
      message: "Item data updated.",
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

export async function DELETE(request) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);

  try {
    // Read the body data
    const { item_id } = await request.json();

    // Delete the item data by item ID
    await prisma.additionals.delete({
      where: { item_id },
    });

    // Return a success log
    return NextResponse.json({
      created_at: currentTimeStamp,
      route: "/api/data/additional",
      status: 200,
      message: "Item data has been deleted.",
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
