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
  console.log("bookid:", bookid);
  try {
    // Read the order book data by book ID
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
    console.log("orderBook:", orderBook);

    // if order book data not found then return an error log
    if (!orderBook) {
      const log = {
        created_at: currentTimeStamp,
        route: "/api/data/book/[bookid]",
        status: 404,
        message: "Order book data not found.",
      };
      errorLog(log);
      return NextResponse.json(log);
    } else {
      // If order book data found then return a success log and order book data
      return NextResponse.json({
        created_at: currentTimeStamp,
        route: "/api/data/book/[bookid]",
        status: 200,
        message: "Order book data found.",
        data: orderBook,
      });
    }
  } catch (error) {
    // If the system or database server error then return an error log
    const log = {
      created_at: currentTimeStamp,
      route: "/api/data/book/[bookid]",
      status: 500,
      message: error,
    };
    errorLog(log);
    return NextResponse.json(log);
  } finally {
    await prisma.$disconnect();
  }
}
