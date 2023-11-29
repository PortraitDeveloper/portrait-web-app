import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getTimeStamp from "@/utils/getTimeStamp";
import errorLog from "@/utils/errorLog";

// Prisma initial
const prisma = new PrismaClient();

// Set Time Zone from UTC to WIB or Asia/Jakarta Timezone where time difference is 7
const timeDiff = 7;

// Generate timestamp / current datetime
const currentTimeStamp = getTimeStamp(timeDiff);

export async function GET(request, { params: { productid } }) {
  console.log("productid:", productid);

  try {
    const product = await prisma.products.findUnique({
      where: {
        product_id: productid,
      },
    });

    if (!product) {
      console.log(currentTimeStamp, "status: 404", "error: Data not found");
      return NextResponse.json({
        created_at: currentTimeStamp,
        status: 404,
        error: "Data not found",
      });
    } else {
      console.log(
        currentTimeStamp,
        "status: 200",
        "message: Data found",
        product
      );
      return NextResponse.json({
        created_at: currentTimeStamp,
        status: 200,
        message: "Data found",
        data: product,
      });
    }
  } catch (error) {
    console.log(currentTimeStamp, "Status: 500", error);

    const log = {
      created_at: currentTimeStamp,
      status: 500,
      error,
    };

    errorLog(log);

    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
