import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

export async function GET(request, { params: { productid } }) {
  // Generate timestamp / current datetime
  const currentTimeStamp = getTimeStamp(timeDiff);
  
  try {
    // Read a the product data by product ID
    const product = await prisma.products.findUnique({
      where: {
        product_id: productid,
      },
    });

    // If product data not found then return an error log
    if (!product) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/product/[productid]",
        status: 404,
        message: "Product data not found.",
      };
      errorLog(log);
      return NextResponse.json(log);
    } else {
      // If product data found then return a success log
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/product/[productid]",
        status: 200,
        message: "Product data found.",
        data: product,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/product/[productid]",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
