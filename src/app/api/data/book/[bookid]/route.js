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

export async function GET(request, { params: { bookid } }) {
  console.log("bookingid:", bookid);

  try {
    // Read order book data by bookid
    const orderBook = await prisma.orders_book.findUnique({
      where: {
        book_id: bookid,
      },
      include: {
        transactions: true,
        customers: true,
        products: {
          include: {
            branches: true,
          },
        },
      },
    });
    console.log(orderBook);

    // if data not found, return 404 error
    if (!orderBook) {
      console.log(currentTimeStamp, "Status: 404, Data not found");

      const log = {
        created_at: currentTimeStamp,
        status: 404,
        error: "Data not found",
      };

      console.log(log);

      errorLog(log);
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    } else {
      // Else return data
      console.log(currentTimeStamp, "Status: 200, Data found");
      return NextResponse.json(orderBook, { status: 200 });
    }
  } catch (error) {
    console.log(
      currentTimeStamp,
      "Status: 500, An error occurred while processing the request"
    );
    return NextResponse.json(
      { error: "Status: 500, An error occurred while processing the request" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
